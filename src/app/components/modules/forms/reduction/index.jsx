import { useState } from 'react';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { FormControl, InputLabel } from '@material-ui/core';
import Widget from 'app/components/modules/widget';
import SimpleSelect from 'app/components/elements/selects/simple';
import LoadingButton from 'app/components/elements/loading-button';
import { postReduction } from 'app/api/reduction';
import sleep from 'app/utils/chronos';

const ReductionForm = () => {
    const [session] = useSession();
    const router = useRouter();

    const [openMessageBox, setOpenMessageBox] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [algorithm, setAlgorithm] = useState('pca');
    const algorithmOptions = [
        { id: 'pca', value: 'PCA' },
        { id: 'tsne', value: 'TSNE' },
        { id: 'umap', value: 'UMAP' },
        { id: 'truncated_svd', value: 'TruncatedSVD' },
        { id: 'spectral_embedding', value: 'Spectral Embedding' },
        { id: 'isomap', value: 'Isomap' },
        { id: 'mds', value: 'MDS' },
    ];

    const [components, setComponents] = useState(2);
    const componentsOptions = [
        { id: 2, value: 2 },
        { id: 3, value: 3 },
    ];

    const [loading, setLoading] = useState(false);

    const userId = session.user.email;
    const experimentId = router.query.id;

    const handleSubmit = async () => {
        const params = {};

        switch (algorithm) {
            case 'pca':
                break;
            default:
                break;
        }

        postReduction(userId, experimentId, algorithm, components, params)
            .then(() => sleep(1000).then(() => setLoading(false)))
            .catch((e) => {
                setOpenMessageBox(true);
                setErrorMessage(e.response.data.detail);
                setLoading(false);
            });
    };

    return (
        <Widget title="Reduction">
            <form>
                <FormControl variant="outlined" margin="dense" fullWidth>
                    <InputLabel id="algorithm">Algorithm</InputLabel>
                    <SimpleSelect
                        id="algorithm"
                        options={algorithmOptions}
                        value={algorithm}
                        setValue={setAlgorithm}
                    />
                </FormControl>
                <FormControl variant="outlined" margin="dense" fullWidth>
                    <InputLabel id="components">Components</InputLabel>
                    <SimpleSelect
                        id="component"
                        options={componentsOptions}
                        value={components}
                        setValue={setComponents}
                    />
                </FormControl>
                <LoadingButton
                    text="Compute"
                    type="submit"
                    color="primary"
                    isLoading={loading}
                    onClick={() => {
                        setLoading(true);
                        handleSubmit();
                    }}
                />
            </form>
        </Widget>
    );
};

export default ReductionForm;
