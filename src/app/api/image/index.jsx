import api from 'app/api';

const getImage = async (userId, experimentId, imageName) => {
    const image = await api(userId).get(
        `experiments/${experimentId}/images/${imageName}`,
    );

    return image;
};

export default getImage;
