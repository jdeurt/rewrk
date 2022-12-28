export const makeId = () =>
    `${Date.now()}-${Math.random().toFixed(20).slice(2)}`;
