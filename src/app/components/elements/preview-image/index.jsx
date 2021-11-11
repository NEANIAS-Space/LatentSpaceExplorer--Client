import { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import Image from 'next/image';
import Widget from 'app/components/elements/widget';
import Box from '@material-ui/core/Box';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import LockIcon from '@material-ui/icons/Lock';
import ProjectorContext from 'app/contexts/projector/context';
import getImage from 'app/api/image';
import PreviewImageWrapper from './style';

const PreviewImage = ({ imageName }) => {
    const [session] = useSession();
    const router = useRouter();

    const { previewImageIsLocked, setPreviewImageIsLocked } =
        useContext(ProjectorContext);

    const [imageSrc, setImageSrc] = useState(null);

    const fetchImage = () => {
        getImage(session.user.email, router.query.id, imageName)
            .then((url) => setImageSrc(url))
            .catch((error) => console.log(error));
    };

    useEffect(fetchImage, [session, router, imageName]);

    const handleToggleLock = () => {
        setPreviewImageIsLocked(!previewImageIsLocked);
    };

    return (
        <Widget>
            <PreviewImageWrapper>
                {imageSrc && (
                    <Image
                        src={imageSrc}
                        alt="Preview Image"
                        layout="fill"
                        objectFit="contain"
                        unoptimized
                        data-testid="PreviewImageTest"
                    />
                )}
                <Box
                    position="absolute"
                    bottom="-15px"
                    right="-15px"
                    height={30}
                    width={30}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    bgcolor="white"
                    borderRadius="50%"
                    onClick={handleToggleLock}
                >
                    {previewImageIsLocked ? <LockIcon /> : <LockOpenIcon />}
                </Box>
            </PreviewImageWrapper>
        </Widget>
    );
};

PreviewImage.propTypes = {
    imageName: PropTypes.string.isRequired,
};

export default PreviewImage;
