import { database } from "./database";
import { s } from "./types";

const cards = database.prepare(`SELECT * FROM ${s("cards")}`).all();
const queries = database.prepare(`SELECT * FROM ${s("topicQueries")}`).all();
console.log(cards);
console.log(queries);
