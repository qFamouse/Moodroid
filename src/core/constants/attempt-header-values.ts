import { SummaryHeader } from "~core/enums/summary-header";

export const HEADER_VALUES = {
    ru: new Map([
        ["Попытка", [SummaryHeader.attempt]],
        ["Состояние", [SummaryHeader.state]],
        ["Баллы", [SummaryHeader.mark]],
        ["Оценка", [SummaryHeader.grade]],
        ["Просмотр", [SummaryHeader.review]],
        ["Отзыв", [SummaryHeader.feedback]]
    ]),
    en: new Map([
        ["Attempt", [SummaryHeader.attempt]],
        ["State", [SummaryHeader.state]],
        ["Marks", [SummaryHeader.mark]],
        ["Grade", [SummaryHeader.grade]],
        ["Review", [SummaryHeader.review]],
        ["Feedback", [SummaryHeader.feedback]]
    ])
};
