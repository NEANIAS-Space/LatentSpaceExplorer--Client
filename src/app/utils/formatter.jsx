const camelCaseKeysToUnderscore = (o) =>
    Object.keys(o).reduce((acc, k) => {
        const newKey = k.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);
        acc[newKey] = o[k];
        return acc;
    }, {});

const normalize = (str) => String(str).toLowerCase().replaceAll('_', ' ');

export { camelCaseKeysToUnderscore, normalize };
