import PropTypes from 'prop-types';
import Image from 'next/image';
import Widget from 'app/components/elements/widget';
import PreviewImageWrapper from './style';

const PreviewImage = ({ imagesFolderName, imageName }) => {
    const imageUrl = `https://files.dev.neanias.eu/apps/files_sharing/publicpreview/${imagesFolderName}?file=/${imageName}&a=true`;

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
