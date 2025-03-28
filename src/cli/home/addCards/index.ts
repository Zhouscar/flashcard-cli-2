import { heading, promptChoice } from "../../cliHelpers";
import { FillEmpty } from "./fillEmpty";
import { RuntimeAdd } from "./runtimeAdd";
import { StagedAdd } from "./stagedAdd";

export async function AddCards() {
    heading("Add Cards");
    const choice = await promptChoice("", [
        "Staged Add",
        "Fill Empty",
        "Runtime Add",
        "EXIT",
    ]);
    switch (choice) {
        case "Staged Add":
            await StagedAdd();
            break;
        case "Fill Empty":
            await FillEmpty();
            break;
        case "Runtime Add":
            await RuntimeAdd();
            break;
    }
}
