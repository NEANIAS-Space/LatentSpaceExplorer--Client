import { useContext, useState, useEffect } from 'react';
import { TagCloud } from 'react-tagcloud';
import { occurrences, indexOfAll } from 'app/utils/maths';
import { FormControl, InputLabel } from '@material-ui/core';
import { Box } from '@material-ui/core';
import { Tooltip } from '@material-ui/core';
import ProjectorContext from 'app/contexts/projector';
import SimpleSelect from 'app/components/elements/selects/simple';

const WordCloudManager = (attributes, traces, traceId) => {
    if (!(Object.keys(attributes).length > 0 && traces.length > 0)) {
        return [];
    }

    const index = indexOfAll(traces, traceId);

    const data = [];

    attributes.data.forEach((values) => {
        values = values.filter((value, id) => index.includes(id));
        const symbols = [...new Set(values)];

        symbols.forEach((value) => {
            const count = occurrences(values, value);
            data.push({ value, count });
        });
    });

    return data;
};

const WordCloudGraph = () => {
    const { attributes, groups } = useContext(ProjectorContext);

    const [data, setData] = useState([]);
    const [clusterId, setClusterId] = useState('');
    const [clusters, setClusters] = useState([]);

    const compare = (object1, object2) => {
        if (object1.id > object2.id) {
            return 1;
        }
        if (object1.id < object2.id) {
            return -1;
        }
        return 0;
    };

    useEffect(() => {
        const uniqueGroups = [...new Set(groups)];

        const options = uniqueGroups.map((value, id) => ({
            id: value,
            value,
        }));

        options.sort(compare);

        setClusters(options);
        setClusterId('');
    }, [groups]);

    useEffect(() => {
        setData(WordCloudManager(attributes, groups, clusterId));
    }, [attributes, groups, clusterId]);

    const renderTag = (tag, size, color) => {
        const styles = {
            margin: '0px 3px',
            verticalAlign: 'middle',
            display: 'inline-block',
        };
        const { className, style, ...props } = tag.props || {};
        const fontSize = size + 'px';
        const key = tag.key || tag.value;
        const tagStyle = { ...styles, color, fontSize, ...style };

        let tagClassName = 'tag-cloud-tag';
        if (className) {
            tagClassName += ' ' + className;
        }

        return (
            <Tooltip title={`${tag.value}: ${tag.count}`} key={key} arrow>
                <span className={tagClassName} style={tagStyle} {...props}>
                    {tag.value}
                </span>
            </Tooltip>
        );
    };

    return (
        <>
            <FormControl variant="outlined" margin="dense" fullWidth>
                <InputLabel id="cluster">Cluster</InputLabel>
                <SimpleSelect
                    name="cluster"
                    options={clusters}
                    value={clusterId}
                    setValue={(event) => {
                        const id = event.target.value;
                        setClusterId(id);
                    }}
                />
            </FormControl>
            <Box textAlign="center" clone>
                <TagCloud
                    tags={data}
                    minSize={3}
                    maxSize={25}
                    colorOptions={{ luminosity: 'dark' }}
                    shuffle={false}
                    randomSeed={42}
                    renderer={renderTag}
                />
            </Box>
        </>
    );
};

export default WordCloudGraph;
