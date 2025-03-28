import { createEmptyCard } from "ts-fsrs";
import { Flashcard } from "../types";
import { addToCardsDatabase } from ".";

export function newCard({
    name,
    summary,
    isTopic,
}: {
    name: string;
    summary?: string;
    isTopic: boolean;
}): Flashcard {
    const now = new Date();
    const data = createEmptyCard(now);
    const id = addToCardsDatabase({
        name,
        summary,
        isTopic,
        topicIds: [],
        ...data,
    });
    return { id, name, summary, isTopic, topicIds: [], ...data };
}
