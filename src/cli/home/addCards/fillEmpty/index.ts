import { setToCardsDatabase } from "../../../../database";
import { getEmptyCards } from "../../../../database/getters";
import { heading, promptChoice, promptText } from "../../../cliHelpers";

export async function FillEmpty() {
    heading("Fill Empty");
    const cards = getEmptyCards();
    while (cards.length > 0) {
        const card = cards.pop()!;
        if ((await promptChoice("Keep Proceed", ["Yes", "EXIT"])) === "EXIT")
            break;
        const summary = await promptText(card.name + "\n");
        setToCardsDatabase({ ...card, summary });
        console.log();
    }
}
