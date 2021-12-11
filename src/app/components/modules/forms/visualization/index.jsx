import Widget from 'app/components/elements/widget';
import Badge from '@material-ui/core/Badge';
import HomeIcon from '@material-ui/icons/Home';

const VisualizationForm = () => {
    const icon = (
        <Badge badgeContent={1} color="secondary">
            <HomeIcon />
        </Badge>
    );

    return (
        <Widget title="Visualization" icon={icon}>
            <>ciao</>
        </Widget>
    );
};

export default VisualizationForm;
