import api from 'app/api';

const getImage = async (userId, experimentId, imageName) => {
    const image = await api(userId).get(
        `experiments/${experimentId}/images/${imageName}`,
    );

    return image;
};

const getImagesFolderName = async (userId, experimentId) => {
    const publicImagesFolderName = await api(userId).get(
        `/experiments/${experimentId}/images/folder-name`,
    );

    return publicImagesFolderName;
};

export { getImage, getImagesFolderName };
