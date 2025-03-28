import { Card } from "ts-fsrs";

export interface Flashcard extends Card {
    id: number;
    isTopic: boolean;
    name: string;
    summary?: string;
    topicIds: number[];
}

type S = "cards" | "topicQueries" | keyof TopicQuery | keyof Flashcard;

export function s(theS: S): string {
    return theS;
}

export interface TopicQuery {
    id: number;
    cardIds: number[];
}

export function parseDateToRaw(date: Date): string {
    return date.toISOString().split("T")[0];
}

export function parseRawToDate(raw: string): Date {
    return new Date(raw);
}

export function parseBooleanToRaw(bool: boolean): number {
    return bool ? 1 : 0;
}

export function parseRawToBoolean(raw: number): boolean {
    return raw === 1;
}

export function parseRawToNumbers(raw: string): number[] {
    return JSON.parse(raw);
}

export function parseNumbersToRaw(numbers: number[]): string {
    return JSON.stringify(numbers);
}

export function parseUndefinableStringToRaw(
    str: string | undefined,
): string | null {
    return str ? str : null;
}

export function parseRawToUndefinableString(
    raw: string | null,
): string | undefined {
    return raw ? raw : undefined;
}

export function parseRawToFlashCard(raw: unknown): Flashcard {
    const data = raw as {
        id: number;
        isTopic: number;
        name: string;
        summary: string | null;
        topicIds: string;

        due: string;
        stability: number;
        difficulty: number;
        elapsed_days: number;
        scheduled_days: number;
        reps: number;
        lapses: number;
        state: number;
        last_review: string | null;
    };
    const card: Flashcard = {
        ...data,
        summary: parseRawToUndefinableString(data.summary),
        isTopic: parseRawToBoolean(data.isTopic),
        topicIds: parseRawToNumbers(data.topicIds),
        due: parseRawToDate(data.due),
        last_review: data.last_review
            ? parseRawToDate(data.last_review)
            : undefined,
    };
    return card;
}

export function parseRawToTopicQuery(raw: unknown): TopicQuery {
    const data = raw as {
        id: number;
        cardIds: string;
    };
    const query: TopicQuery = {
        ...data,
        cardIds: parseRawToNumbers(data.cardIds),
    };
    return query;
}
