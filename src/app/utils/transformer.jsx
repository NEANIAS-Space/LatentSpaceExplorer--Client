const camelCaseKeysToUnderscore = (o) =>
    Object.keys(o).reduce((acc, k) => {
        const newKey = k.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);
        acc[newKey] = o[k];
        return acc;
    }, {});

export default camelCaseKeysToUnderscore;
