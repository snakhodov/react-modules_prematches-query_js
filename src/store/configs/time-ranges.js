const hours = (hours) =>
    parseInt(
        new Date(new Date().setHours(new Date().getHours() + hours)).setSeconds(0) / 1000
    );

const allTo = () =>
    new Date(
        new Date(new Date().setFullYear(new Date().getFullYear() + 1)).setSeconds(0)
    );

export const timeRangesConfig = {
    1: {
        to: () => Math.floor(allTo().setDate(allTo().getDate() - 1) / 1000),
    },
    2: {
        to: () => parseInt(new Date().setHours(23, 59, 59, 999) / 1000),
    },
    3: {
        to: () => hours(12),
    },
    4: {
        to: () => hours(3),
    },
    5: {
        to: () => hours(1),
    },
};