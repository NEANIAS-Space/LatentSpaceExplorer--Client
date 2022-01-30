const initialFormState = {
    algorithm: 'dbscan',
    dbscan: {
        eps: 0.5,
        minSamples: 5,
        metric: 'euclidean',
    },
    kmeans: {
        nClusters: 8,
    },
    agglomerativeClustering: {
        distanceThreshold: 5,
        affinity: 'euclidean',
        linkage: 'ward',
    },
    spectralClustering: {
        nClusters: 8,
        affinity: 'nearest_neighbors',
        nNeighbors: 10,
    },
    optics: {
        minSamples: 5,
        metric: 'euclidean',
        clusterMethod: 'xi',
        minClusterSize: 0,
    },
    gaussianMixture: {
        nComponents: 2,
        initParams: 'kmeans',
    },
    birch: {
        nClusters: 3,
        threshold: 0.5,
    },
};

const algorithmOptions = [
    { id: 'dbscan', value: 'dbscan' },
    { id: 'affinityPropagation', value: 'affinity propagation' },
    { id: 'kmeans', value: 'kmeans' },
    {
        id: 'agglomerativeClustering',
        value: 'agglomerative clustering',
    },
    { id: 'spectralClustering', value: 'spectral clustering' },
    { id: 'optics', value: 'optics' },
    { id: 'gaussianMixture', value: 'gaussian mixture' },
    { id: 'birch', value: 'birch' },
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

const AGAffinintyOptions = [
    { id: 'euclidean', value: 'euclidean' },
    { id: 'cosine', value: 'cosine' },
    { id: 'manhattam', value: 'manhattam' },
];

const SCAffinintyOptions = [
    { id: 'nearest_neighbors', value: 'nearest_neighbors' },
    { id: 'rbf', value: 'rbf' },
];

const linkageOptions = [
    { id: 'ward', value: 'ward' },
    { id: 'complete', value: 'complete' },
    { id: 'average', value: 'average' },
    { id: 'single', value: 'single' },
];

const clusterMethodOptions = [
    { id: 'xi', value: 'xi' },
    { id: 'dbscan', value: 'dbscan' },
];

const initParamsOptions = [
    { id: 'kmeans', value: 'kmeans' },
    { id: 'random', value: 'random' },
];

export {
    initialFormState,
    algorithmOptions,
    metricOptions,
    AGAffinintyOptions,
    SCAffinintyOptions,
    linkageOptions,
    clusterMethodOptions,
    initParamsOptions,
};
