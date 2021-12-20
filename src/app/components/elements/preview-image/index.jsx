import { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import ProjectorContext from 'app/contexts/projector';
import Image from 'next/image';
import Widget from 'app/components/modules/widget';
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

        getImage(userId, experimentId, imageName)
            .then((url) => {
                setImageUrl(url);
            })
            .catch((e) => {
                setOpenMessageBox(true);
                setErrorMessage(e.response.data.detail);
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
