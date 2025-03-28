import { decorate, promptChoice } from "../../cliHelpers";
import { FillEmpty } from "./fillEmpty";
import { RuntimeAdd } from "./runtimeAdd";
import { StagedAdd } from "./stagedAdd";

export async function AddCards() {
    await decorate("Add Cards", async () => {
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
    });
}
