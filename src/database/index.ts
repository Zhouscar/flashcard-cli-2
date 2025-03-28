import {
    Flashcard,
    parseBooleanToRaw,
    parseDateToRaw,
    parseNumbersToRaw,
    parseRawToFlashCard,
    parseUndefinableStringToRaw,
    s,
    TopicQuery,
} from "../types";
import { getTopicCardIds } from "./getters";

const Database = require("better-sqlite3");
export const database = new Database(`${s("cards")}.db`);

database.pragma("journal_mode = WAL");
database.exec(`
        CREATE TABLE IF NOT EXISTS ${s("cards")} (
        ${s("id")} INTEGER PRIMARY KEY AUTOINCREMENT,
        ${s("isTopic")} INTEGER NOT NULL,
        ${s("name")} TEXT NOT NULL,
        ${s("summary")} TEXT,
        ${s("topicIds")} TEXT NOT NULL,
        ${s("due")} DATE NOT NULL,
        ${s("stability")} REAL NOT NULL,
        ${s("difficulty")} REAL NOT NULL,
        ${s("elapsed_days")} INTEGER NOT NULL,
        ${s("scheduled_days")} INTEGER NOT NULL,
        ${s("reps")} INTEGER NOT NULL,
        ${s("lapses")} INTEGER NOT NULL,
        ${s("state")} TINYINT NOT NULL,
        ${s("last_review")} DATE
    )`);

database.exec(`
        CREATE TABLE IF NOT EXISTS ${s("topicQueries")} (
        ${s("id")} INTEGER PRIMARY KEY,
        ${s("cardIds")} TEXT NOT NULL
    )`);

export function setToTopicQueriesDatabase(query: TopicQuery) {
    const statement = database.prepare(`
        INSERT INTO ${s("topicQueries")} (${s("id")}, ${s("cardIds")})
        VALUES (?, ?)
        ON CONFLICT(${s("id")}) DO UPDATE SET
        ${s("cardIds")} = excluded.${s("cardIds")};
    `);
    statement.run(query.id, parseNumbersToRaw(query.cardIds));
}

export function addToCardsDatabase(card: Omit<Flashcard, "id">) {
    const statement = database.prepare(`
        INSERT INTO ${s("cards")} (
        ${s("isTopic")},
        ${s("name")},
        ${s("summary")},
        ${s("topicIds")},
        ${s("due")},
        ${s("stability")},
        ${s("difficulty")},
        ${s("elapsed_days")},
        ${s("scheduled_days")},
        ${s("reps")},
        ${s("lapses")},
        ${s("state")},
        ${s("last_review")}
        ) VALUES
        (?,?,?,?,?,?,?,?,?,?,?,?,?)
    `);
    const { lastInsertRowid } = statement.run(
        parseBooleanToRaw(card.isTopic),
        card.name,
        parseUndefinableStringToRaw(card.summary),
        parseNumbersToRaw(card.topicIds),
        parseDateToRaw(card.due),
        card.stability,
        card.difficulty,
        card.elapsed_days,
        card.scheduled_days,
        card.reps,
        card.lapses,
        card.state,
        card.last_review ? parseDateToRaw(card.last_review) : null,
    );

    const thisCardId = lastInsertRowid as number;

    if (card.isTopic) {
        setToTopicQueriesDatabase({ id: thisCardId, cardIds: [] });
    } else {
        card.topicIds.forEach((topicId) => {
            const cardIds = getTopicCardIds(topicId);
            cardIds.push(thisCardId);
            setToTopicQueriesDatabase({ id: topicId, cardIds: cardIds });
        });
    }

    return thisCardId;
}

export function setToCardsDatabase(card: Flashcard) {
    const statement0 = database.prepare(
        `SELECT * FROM ${s("cards")} WHERE ${s("id")} = ?`,
    );
    const prevCard = parseRawToFlashCard(statement0.get(card.id));

    const statement = database.prepare(`
        UPDATE ${s("cards")} SET
        ${s("isTopic")} = ?,
        ${s("name")} = ?,
        ${s("summary")} = ?,
        ${s("topicIds")} = ?,
        ${s("due")} = ?,
        ${s("stability")} = ?,
        ${s("difficulty")} = ?,
        ${s("elapsed_days")} = ?,
        ${s("scheduled_days")} = ?,
        ${s("reps")} = ?,
        ${s("lapses")} = ?,
        ${s("state")} = ?,
        ${s("last_review")} = ?
        WHERE id = ${card.id}
    `);
    statement.run(
        parseBooleanToRaw(card.isTopic),
        card.name,
        parseUndefinableStringToRaw(card.summary),
        parseNumbersToRaw(card.topicIds),
        parseDateToRaw(card.due),
        card.stability,
        card.difficulty,
        card.elapsed_days,
        card.scheduled_days,
        card.reps,
        card.lapses,
        card.state,
        card.last_review ? parseDateToRaw(card.last_review) : null,
    );

    if (!card.isTopic) {
        card.topicIds.forEach((topicId) => {
            if (prevCard.topicIds.includes(topicId)) return;
            const cardIds = getTopicCardIds(topicId);
            cardIds.push(card.id);
            setToTopicQueriesDatabase({ id: topicId, cardIds: cardIds });
        });
    }

    // removing does not need to be handled

    // prevCard.topicIds.forEach((topicId) => {
    //     if (card.topicIds.includes(topicId)) return;
    //     const cardIds = getTopicCardIds(topicId);
    //     cardIds(card.id);
    //     setToTopicQueriesDatabase({ id: topicId, cardIds: cardIds });
    // });
}
