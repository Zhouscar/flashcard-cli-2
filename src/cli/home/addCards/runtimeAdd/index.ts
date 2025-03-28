import { newCard } from "../../../../database/setters";
import { promptChoice, promptText } from "../../../cliHelpers";

export async function RuntimeAdd() {
    while (true) {
        if ((await promptChoice("Keep Proceed", ["Yes", "EXIT"])) === "EXIT")
            break;
        const name = await promptText("name");
        const summary = await promptText("summary");
        newCard({ name, summary, isTopic: false });
    }
}
