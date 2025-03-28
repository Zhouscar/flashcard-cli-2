import { Flashcard } from "../../../../types";
import { ReviewCard } from "./reviewCard";
import { ReviewTopic } from "./reviewTopic";

export async function ReviewOne(card: Flashcard) {
    if (card.isTopic) {
        await ReviewTopic(card);
    } else {
        await ReviewCard(card);
    }
}
