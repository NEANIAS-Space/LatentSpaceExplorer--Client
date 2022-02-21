import api from 'app/api';

const getImage = async (userId, experimentId) => {
    const image = await api(userId).get(
        `experiments/${experimentId}/images_share_link/`,
    );

    return image;
};

export default getImage;
