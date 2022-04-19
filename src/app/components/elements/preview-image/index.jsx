import PropTypes from 'prop-types';
import Image from 'next/image';
import Widget from 'app/components/elements/widget';
import PreviewImageWrapper from './style';

const PreviewImage = ({ imagesFolderName, imageName }) => {
    const imageBaseUrl = process.env.NEXT_PUBLIC_NEXTCLOUD_URL;
    const imagePreviewPath = '/apps/files_sharing/publicpreview/';
    const imageEncodedName = encodeURIComponent(imageName);
    const imageUrlParams = `?file=/${imageEncodedName}&a=true`;

    const imageUrl = `${imageBaseUrl}${imagePreviewPath}${imagesFolderName}${imageUrlParams}`;

    return (
        <Widget title={imageName}>
            <PreviewImageWrapper>
                <Image
                    src={imageUrl}
                    alt="Preview Image"
                    layout="fill"
                    objectFit="contain"
                    unoptimized
                    data-testid="PreviewImageTest"
                />
            </PreviewImageWrapper>
        </Widget>
    );
};

PreviewImage.propTypes = {
    imagesFolderName: PropTypes.string.isRequired,
    imageName: PropTypes.string.isRequired,
};

export default PreviewImage;
