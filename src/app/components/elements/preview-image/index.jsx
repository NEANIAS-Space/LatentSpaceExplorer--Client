import PropTypes from 'prop-types';
import Image from 'next/image';
import Widget from 'app/components/elements/widget';
import PreviewImageWrapper from './style';

const PreviewImage = ({ imagesFolderName, imageName }) => {
    console.log(process.env.NEXT_PUBLIC_NEXTCLOUD_URL);
    const imageUrl = `${process.env.NEXT_PUBLIC_NEXTCLOUD_URL}/apps/files_sharing/publicpreview/${imagesFolderName}?file=/${encodeURIComponent(imageName)}&a=true`;
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
