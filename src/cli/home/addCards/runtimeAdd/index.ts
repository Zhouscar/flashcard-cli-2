import { newCard } from "../../../../database/setters";
import { heading, promptChoice, promptText } from "../../../cliHelpers";

export async function RuntimeAdd() {
    heading("Runtime Add");
    while (true) {
        if ((await promptChoice("Keep Proceed", ["Yes", "EXIT"])) === "EXIT")
            break;
        const name = await promptText("concept");
        console.log();
        const summary = await promptText(name + "\n");
        console.log();
        newCard({ name, summary, isTopic: false });
    }
}
