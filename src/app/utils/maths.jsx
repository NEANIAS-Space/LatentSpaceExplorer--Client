const range = (start, stop, step) =>
    Array.from(
        { length: (stop - start) / step + 1 },
        (_, i) => start + i * step,
    );

const average = (array) =>
    array.length > 0 ? array.reduce((a, v, i) => (a * i + v) / (i + 1)) : 0;

const occurrences = (array, value) =>
    array.reduce((a, v) => (v === value ? a + 1 : a), 0);

const indexOfAll = (array, value) =>
    array.reduce(
        (previous, element, i) =>
            element === value ? [...previous, i] : previous,
        [],
    );

export { range, average, occurrences, indexOfAll };
