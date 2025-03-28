import { heading, promptChoice } from "../cliHelpers";
import { AddCards } from "./addCards";
import { ReviewCards } from "./reviewCards";
import { ViewTimeline } from "./viewTimeline";

export async function Home() {
    while (true) {
        heading("Home");
        const choices = await promptChoice("Home", [
            "Review Cards",
            "Add Cards",
            "View Timeline",
            "EXIT",
        ]);
        if (choices === "EXIT") break;
        switch (choices) {
            case "Review Cards":
                await ReviewCards();
                break;
            case "Add Cards":
                await AddCards();
                break;
            case "View Timeline":
                await ViewTimeline();
                break;
        }
    }
}
