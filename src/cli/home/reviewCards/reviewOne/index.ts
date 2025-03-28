import { Flashcard } from "../../../../types";
import { decorate } from "../../../cliHelpers";
import { ReviewCard } from "./reviewCard";
import { ReviewTopic } from "./reviewTopic";

export async function ReviewOne(card: Flashcard) {
    await decorate("", async () => {
        if (card.isTopic) {
            await ReviewTopic(card);
        } else {
            await ReviewCard(card);
        }
    });
}
