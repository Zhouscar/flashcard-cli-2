import { database } from ".";
import {
    Flashcard,
    parseDateToRaw,
    parseRawToFlashCard,
    parseRawToTopicQuery,
    s,
} from "../types";

export function getTopicCardIds(topicId: number) {
    const statement = database.prepare(
        `SELECT * FROM ${s("topicQueries")} WHERE ${s("id")} = ?`,
    );
    return parseRawToTopicQuery(statement.get(topicId)).cardIds;
}

export function getCardById(cardId: number) {
    const statement = database.prepare(
        `SELECT * FROM ${s("cards")} WHERE ${s("id")} = ?`,
    );
    return parseRawToFlashCard(statement.get(cardId));
}

export function getTopics(): Flashcard[] {
    const statement = database.prepare(
        `SELECT * FROM ${s("cards")} WHERE ${s(
            "isTopic",
        )} = 1 ORDER BY RANDOM()`,
    );
    return statement.all().map(parseRawToFlashCard);
}

export function getEmptyCards(): Flashcard[] {
    const statement = database.prepare(
        `SELECT * FROM ${s("cards")} WHERE ${s("summary")} IS NULL AND ${s(
            "isTopic",
        )} = 0`,
    );
    return statement.all().map(parseRawToFlashCard);
}

export function getDueCards(): Flashcard[] {
    const now = new Date();
    const statement = database.prepare(
        `SELECT * FROM ${s("cards")} WHERE ${s("due")} <= ?`,
    );
    return statement
        .all(parseDateToRaw(now))
        .map(parseRawToFlashCard)
        .filter((card: Flashcard) => {
            if (card.isTopic) {
                const cardIds = getTopicCardIds(card.id);
                return cardIds.length > 1;
            } else {
                return card.summary !== undefined;
            }
        });
}

export function getDueAmountOnDay(date: Date): number {
    const statement = database.prepare(
        `SELECT COUNT(*) AS count FROM ${s("cards")} WHERE ${s("due")} = ?`,
    );
    const result = statement.get(parseDateToRaw(date)) as {
        count: number;
    };
    return result.count;
}

export function getReviewedAmountOnDay(date: Date): number {
    const statement = database.prepare(
        `SELECT COUNT(*) AS count FROM ${s("cards")} WHERE ${s(
            "last_review",
        )} = ?`,
    );
    const result = statement.get(parseDateToRaw(date)) as {
        count: number;
    };
    return result.count;
}
