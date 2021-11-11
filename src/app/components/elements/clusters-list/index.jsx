import { useContext } from 'react';
import ProjectorContext from 'app/contexts/projector/context';
import Widget from 'app/components/elements/widget';
import Box from '@material-ui/core/Box';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import DownloadIcon from '@material-ui/icons/GetApp';
import TreeItem from '@material-ui/lab/TreeItem';
import { grey } from '@material-ui/core/colors';
import ClustersListWrapper from './style';

const ClustersList = () => {
    const { graphData } = useContext(ProjectorContext);

    const file = {};

    for (let i = 0; i < graphData.length; i += 1) {
        file[i] = graphData[i].text;
    }

    const renderTree = (traces) => (
        <TreeView
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            disableSelection
        >
            {traces.map((trace, traceId) => (
                <TreeItem
                    key={traceId.toString()}
                    nodeId={traceId.toString()}
                    label={`trace ${traceId} (${trace.text.length})`}
                >
                    {trace.text.map((point) => (
                        <TreeItem key={point} nodeId={point} label={point} />
                    ))}
                </TreeItem>
            ))}
        </TreeView>
    );

    return (
        <Widget title="Clusters">
            <>
                <Box
                    position="absolute"
                    height={30}
                    width={30}
                    top="18px"
                    right="5px"
                >
                    <a
                        href={`data:text/json;charset=utf-8,${encodeURIComponent(
                            JSON.stringify(file),
                        )}`}
                        download="clusters.json"
                    >
                        <DownloadIcon style={{ color: grey[900] }} />
                    </a>
                </Box>
                <ClustersListWrapper>
                    {renderTree(graphData)}
                </ClustersListWrapper>
            </>
        </Widget>
    );
};

export default ClustersList;
