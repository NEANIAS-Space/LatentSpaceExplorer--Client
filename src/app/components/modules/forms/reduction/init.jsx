const initialFormState = {
    algorithm: 'pca',
    components: 2,
    tsne: {
        perplexity: 10,
        iterations: 1000,
        learningRate: 200,
        metric: 'euclidean',
        init: 'random',
    },
    umap: {
        neighbors: 15,
        minDistance: 0.1,
        metric: 'euclidean',
        densmap: false,
    },
    spectralEmbedding: {
        affinity: 'nearest_neighbors',
    },
    isomap: {
        neighbors: 15,
        metric: 'euclidean',
    },
};

const algorithmOptions = [
    { id: 'pca', value: 'pca' },
    { id: 'tsne', value: 'tsne' },
    { id: 'umap', value: 'umap' },
    { id: 'truncatedSvd', value: 'truncated svd' },
    { id: 'spectralEmbedding', value: 'spectral embedding' },
    { id: 'isomap', value: 'isomap' },
    { id: 'mds', value: 'mds' },
];

const componentsOptions = [
    { id: 2, value: 2 },
    { id: 3, value: 3 },
];

const metricOptions = [
    { id: 'euclidean', value: 'euclidean' },
    { id: 'cosine', value: 'cosine' },
    { id: 'minkowski', value: 'minkowski' },
    { id: 'manhattan', value: 'manhattan' },
    { id: 'chebyshev', value: 'chebyshev' },
    { id: 'canberra', value: 'canberra' },
    { id: 'mahalanobis', value: 'mahalanobis' },
];

const initParamsOptions = [
    { id: 'random', value: 'random' },
    { id: 'pca', value: 'pca' },
];

const affinityOptions = [
    { id: 'nearest_neighbors', value: 'nearest neighbors' },
    { id: 'rbf', value: 'rbf' },
];

export {
    initialFormState,
    algorithmOptions,
    componentsOptions,
    metricOptions,
    initParamsOptions,
    affinityOptions,
};
