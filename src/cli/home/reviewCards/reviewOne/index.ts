import { Flashcard } from "../../../../types";
import { heading } from "../../../cliHelpers";
import { ReviewCard } from "./reviewCard";
import { ReviewTopic } from "./reviewTopic";

export async function ReviewOne(card: Flashcard) {
    heading("");
    if (card.isTopic) {
        await ReviewTopic(card);
    } else {
        await ReviewCard(card);
    }
}
