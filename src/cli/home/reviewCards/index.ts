import { Card, State } from "ts-fsrs";
import { getDueCards } from "../../../database/getters";
import { Flashcard } from "../../../types";
import { heading, promptChoice } from "../../cliHelpers";
import { ReviewOne } from "./reviewOne";

export function getRetrievability(card: Card): number {
    if (card.scheduled_days <= 0) return 0;
    return Math.exp(-Math.log(2) * (card.elapsed_days / card.scheduled_days));
}

async function ReviewSelective(
    sampleCards: Flashcard[],
    sortOrder: "descending_retreivability" | "random",
    cardGroupName: string,
): Promise<"EXITED" | undefined> {
    heading("Reviewing " + cardGroupName);

    let cards: Flashcard[] = [];
    if (sortOrder === "descending_retreivability") {
        cards = sampleCards.sort(
            (a, b) => getRetrievability(a) - getRetrievability(b),
        );
    } else if (sortOrder === "random") {
        cards = [...sampleCards];
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
    }
    while (cards.length > 0) {
        const card = cards.pop()!;
        if ((await promptChoice("Keep Proceed?", ["Yes", "EXIT"])) === "EXIT") {
            return "EXITED";
        }
        await ReviewOne(card);
    }
    console.log(`\nDone reviewing ${cardGroupName}`);
    return undefined;
}

export async function ReviewCards() {
    heading("Review Cards");
    const cards = getDueCards();
    const newCards = cards.filter((card) => card.state === State.New);
    const learningCards = cards.filter(
        (card) =>
            card.state === State.Learning || card.state === State.Relearning,
    );
    const reviewCards = cards.filter((card) => card.state === State.Review);
    console.log(
        `There are currently\n  ${newCards.length} new cards,\n  ${learningCards.length} learning cards,\n  ${reviewCards.length} review cards.`,
    );
    while (true) {
        const cards = getDueCards();
        if (cards.length === 0) break;

        const newCards = cards.filter((card) => card.state === State.New);
        const learningCards = cards.filter(
            (card) =>
                card.state === State.Learning ||
                card.state === State.Relearning,
        );
        const reviewCards = cards.filter((card) => card.state === State.Review);

        let exited = false;

        exited =
            (await ReviewSelective(
                learningCards,
                "random",
                "Learning Cards",
            )) === "EXITED";
        if (exited) return;
        exited =
            (await ReviewSelective(
                reviewCards,
                "descending_retreivability",
                "Review Cards",
            )) === "EXITED";
        if (exited) return;
        exited =
            (await ReviewSelective(newCards, "random", "New Cards")) ===
            "EXITED";
        if (exited) return;
    }
    console.log("\nYou're done, Princess");
}
