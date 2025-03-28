import {
    getDueAmountOnDay,
    getDueCards,
    getReviewedAmountOnDay,
} from "../../../database/getters";

const NUM_DAYS_AGO = 3;
const NUM_DAYS_AHEAD = 7;

export async function ViewTimeline() {
    const reviewedAmounts: number[] = [];
    const dueAmounts: number[] = [];
    const now = new Date();
    for (
        let offsetDays = -NUM_DAYS_AGO;
        offsetDays <= NUM_DAYS_AHEAD;
        offsetDays++
    ) {
        const date = new Date(now);
        date.setDate(now.getDate() + offsetDays);
        if (offsetDays < 0) {
            reviewedAmounts.push(getReviewedAmountOnDay(date));
        } else if (offsetDays > 0) {
            dueAmounts.push(getDueAmountOnDay(date));
        }
    }

    let timeline = "";
    reviewedAmounts.forEach((amount) => {
        timeline += `[${amount}], `;
    });
    timeline += `[${getReviewedAmountOnDay(now)},${getDueCards().length}), `;
    dueAmounts.forEach((amount, i) => {
        timeline += `(${amount})` + (i < dueAmounts.length - 1 ? ", " : "");
    });

    console.log(`${timeline}\n`);
}
