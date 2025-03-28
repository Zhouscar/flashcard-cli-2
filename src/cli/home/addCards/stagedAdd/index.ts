import { setToCardsDatabase } from "../../../../database";
import { newCard } from "../../../../database/setters";
import { Flashcard } from "../../../../types";
import { promptChoice, promptText } from "../../../cliHelpers";

export async function StagedAdd() {
    const cards: Flashcard[] = [];
    while (true) {
        const status = await promptChoice("Keep Proceed", [
            "Yes",
            "Get to Filling",
            "EXIT",
        ]);
        if (status === "EXIT") return;
        if (status === "Get to Filling") break;
        const name = await promptText("name");
        const card = newCard({ name, isTopic: false });
        cards.push(card);
    }
    while (cards.length > 0) {
        const card = cards.pop()!;
        if ((await promptChoice("Keep Proceed", ["Yes", "EXIT"])) === "EXIT")
            break;
        const summary = await promptText(card.name + "\n");
        setToCardsDatabase({ ...card, summary });
    }
}
