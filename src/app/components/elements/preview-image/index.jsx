import { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import ProjectorContext from 'app/contexts/projector';
import Image from 'next/image';
import Widget from 'app/components/elements/widget';
import getImage from 'app/api/image';
import PreviewImageWrapper from './style';

const PreviewImage = ({ imageName }) => {
    const [session] = useSession();
    const router = useRouter();

    const { setOpenMessageBox } = useContext(ProjectorContext);
    const { setErrorMessage } = useContext(ProjectorContext);

    const [imageUrl, setImageUrl] = useState('');

    const userId = session.user.email;
    const experimentId = router.query.id;

    const fetchImage = () => {
        setImageUrl('');

        getImage(userId, experimentId)
            .then((response) => {
                const dirName = encodeURI(response.data);
                const url = `https://files.dev.neanias.eu/apps/files_sharing/publicpreview/${dirName}?file=/${imageName}&a=true`;

                setImageUrl(url);
            })
            .catch((error) => {
                setOpenMessageBox(true);
                setErrorMessage(error.response.data.message);
            });
    };

    useEffect(fetchImage, [
        userId,
        experimentId,
        imageName,
        setOpenMessageBox,
        setErrorMessage,
    ]);

    return (
        <Widget title={imageName}>
            <PreviewImageWrapper>
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt="Preview Image"
                        layout="fill"
                        objectFit="contain"
                        unoptimized
                        data-testid="PreviewImageTest"
                    />
                ) : (
                    <Image
                        src="/preview-image-loader.gif"
                        alt="Preview Image"
                        layout="fill"
                        objectFit="contain"
                        unoptimized
                        data-testid="PreviewImageTest"
                    />
                )}
            </PreviewImageWrapper>
        </Widget>
    );
};

PreviewImage.propTypes = {
    imageName: PropTypes.string.isRequired,
};

export default PreviewImage;
