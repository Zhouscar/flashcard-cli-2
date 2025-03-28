import { Grade, Rating } from "ts-fsrs";
import { setToCardsDatabase } from "../../../../../database";
import { getCardById, getTopicCardIds } from "../../../../../database/getters";
import { Flashcard } from "../../../../../types";
import { promptChoice, promptText } from "../../../../cliHelpers";
import { f } from "../../../../../fsrs";

export async function ReviewTopic(topic: Flashcard) {
    console.log("[TOPIC]");
    console.log(topic.name);
    const today = new Date();
    let grade: Grade;
    if (topic.summary !== undefined) {
        const startTime = performance.now() / 1000;
        await promptText("");
        const endTime = performance.now() / 1000;
        const elapsed = endTime - startTime;
        const cardIds = getTopicCardIds(topic.id);
        const cards = cardIds.map(getCardById);
        cards.forEach((card) => {
            console.log(` - ${card.name} (${card.summary!})`);
        });
        console.log(topic.summary!);
        const choice = await promptChoice("Did you get it", ["no", "yes"]);
        grade =
            choice === "no"
                ? Rating.Again
                : elapsed < 10
                ? Rating.Easy
                : elapsed < 30
                ? Rating.Good
                : Rating.Hard;
    } else {
        const cardIds = getTopicCardIds(topic.id);
        const cards = cardIds.map(getCardById);
        cards.forEach((card) => {
            console.log(` - ${card.name} (${card.summary!})`);
        });
        grade = Rating.Again;
    }
    const newData = f.repeat(topic, today)[grade].card;
    const newSummary = await (async () => {
        while (true) {
            const newSummary = await promptText("Re-summarize\n");
            if (newSummary.trim().length === 0) {
                console.log("ERROR: Re-summary cannot be blank");
                continue;
            }
            return newSummary;
        }
    })();
    setToCardsDatabase({ ...topic, ...newData, summary: newSummary });
}
