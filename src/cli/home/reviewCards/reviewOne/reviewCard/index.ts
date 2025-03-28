import { Grade, Rating } from "ts-fsrs";
import { getTopicCardIds, getTopics } from "../../../../../database/getters";
import { Flashcard } from "../../../../../types";
import { promptChoice, promptText } from "../../../../cliHelpers";
import { f } from "../../../../../fsrs";
import { setToCardsDatabase } from "../../../../../database";
import { newCard } from "../../../../../database/setters";

export async function ReviewCard(card: Flashcard) {
    console.log(card.name);
    const today = new Date();
    const startTime = performance.now() / 1000;
    await promptText("");
    const endTime = performance.now() / 1000;
    const elapsed = endTime - startTime;
    console.log(card.summary!);
    const choice = await promptChoice("Did you get it", ["no", "yes"]);
    const grade: Grade =
        choice === "no"
            ? Rating.Again
            : elapsed < 5
            ? Rating.Easy
            : elapsed < 15
            ? Rating.Good
            : Rating.Hard;
    const newData = f.repeat(card, today)[grade].card;
    const newSummary = await (async () => {
        while (true) {
            const newSummary = await promptText("Re-summarize\n");
            if (newSummary.trim().length === 0) {
                console.log("ERROR: Re-summary cannot be blank.");
                continue;
            }
            return newSummary;
        }
    })();
    const topicsToAdd = getTopics().filter(
        (topic) => !card.topicIds.includes(topic.id),
    );
    let chosenTopicName = (await promptChoice("Add to a topic", [
        "NEW TOPIC",
        ...topicsToAdd.map((topic) => topic.name),
    ]))!;
    if (chosenTopicName === "NEW TOPIC") {
        while (true) {
            const newTopicName = await promptText("New topic name\n");
            if (newTopicName.trim().length === 0) {
                console.log("ERROR: New topic name cannot be blank.");
                continue;
            }
            chosenTopicName = newTopicName;
            const newTopic = newCard({ name: newTopicName, isTopic: true });
            topicsToAdd.push(newTopic);
            break;
        }
    }
    const chosenTopicId = topicsToAdd.find(
        (topic) => topic.name === chosenTopicName,
    )!.id;
    setToCardsDatabase({
        ...card,
        ...newData,
        summary: newSummary,
        topicIds: [...card.topicIds, chosenTopicId],
    });
}
