import { setToCardsDatabase } from "../../../../database";
import { newCard } from "../../../../database/setters";
import { Flashcard } from "../../../../types";
import { heading, promptChoice, promptText } from "../../../cliHelpers";

export async function StagedAdd() {
    heading("Staged Add");
    const cards: Flashcard[] = [];
    while (true) {
        const status = await promptChoice("Keep Proceed", [
            "Yes",
            "Get to Filling",
            "EXIT",
        ]);
        if (status === "EXIT") return;
        if (status === "Get to Filling") break;
        const name = await promptText("concept");
        const card = newCard({ name, isTopic: false });
        cards.push(card);
        console.log();
    }
    while (cards.length > 0) {
        const card = cards.pop()!;
        if ((await promptChoice("Keep Proceed", ["Yes", "EXIT"])) === "EXIT")
            return;
        const summary = await promptText(card.name + "\n");
        setToCardsDatabase({ ...card, summary });
        console.log();
    }
}
