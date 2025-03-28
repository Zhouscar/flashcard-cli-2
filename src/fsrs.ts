import { fsrs, generatorParameters } from "ts-fsrs";

export const params = generatorParameters({
    enable_fuzz: true,
    enable_short_term: false,
    request_retention: 0.85,
});

export const f = fsrs(params);
