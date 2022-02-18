import api from 'app/api';

const getImage = async (dirName, imageName) => {
    imageName = imageName.replace('+', '%2B');
    const image = `https://files.dev.neanias.eu/apps/files_sharing/publicpreview/${dirName}?file=/${imageName}&a=true`;
    console.log(image);
    return image;
};

export default getImage;
