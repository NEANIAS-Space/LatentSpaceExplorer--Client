import { useContext } from 'react';
import ProjectorContext from 'app/contexts/projector';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Widget from 'app/components/elements/widget';

const BarGraphWidget = () => {
    const { scores } = useContext(ProjectorContext);

    return (
        <Widget title="Clusters scores">
            <>
                <Grid container>
                    <Grid item xs={8}>
                        Calinski Harabasz:
                    </Grid>
                    <Grid item xs={4}>
                        <Box textAlign="right">
                            {scores.calinski_harabasz_score.toFixed(2)}
                        </Box>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={8}>
                        Davies Bouldin:
                    </Grid>
                    <Grid item xs={4}>
                        <Box textAlign="right">
                            {scores.davies_bouldin_score.toFixed(2)}
                        </Box>
                    </Grid>
                </Grid>
            </>
        </Widget>
    );
};

export default BarGraphWidget;
