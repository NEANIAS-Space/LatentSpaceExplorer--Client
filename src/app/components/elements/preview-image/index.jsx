import { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import ProjectorContext from 'app/contexts/projector';
import Image from 'next/image';
import Widget from 'app/components/elements/widget';
import getImage from 'app/api/image';
import PreviewImageWrapper from './style';
import { getExperimentImages } from 'app/api/experiment';

const PreviewImage = ({ imageName }) => {
    const [session] = useSession();
    const router = useRouter();

    const { setOpenMessageBox } = useContext(ProjectorContext);
    const { setErrorMessage } = useContext(ProjectorContext);

    const [imageUrl, setImageUrl] = useState('');

    const userId = session.user.email;
    const experimentId = router.query.id;
    const [dirName, setDirName] = useState('');
    
    const fetchDirName = getExperimentImages(userId, experimentId)
        .then(
            (result) => {
                console.log(`fetch ${dirName}`)
                setDirName(result.data)
            }
        );

    useEffect(() => {
        console.log(`Useffect ${dirName}`)
        if( dirName == ''){
            fetchDirName
        console.log(`Fine Useffect ${dirName}`)
        }
    },[]);
    
    const fetchImage = () => {
        setImageUrl('');

        getImage(dirName, imageName)
            .then((response) => {
                //console.log(response.data);
                setImageUrl(response);
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
