import { useContext } from 'react';
import { TagCloud } from 'react-tagcloud';
import { occurrences, indexOfAll } from 'app/utils/maths';
import ProjectorContext from 'app/contexts/projector';

const WordCloudManager = (labels, traces) => {
    const traceId = 0;
    const labelId = 0;
    console.log('cluster', traceId, 'label', labelId);

    console.log('cluster length', occurrences(traces, traceId));

    const index = indexOfAll(traces, traceId);
    console.log('index length', index.length);

    let values = labels.data[labelId];
    values = values.filter((value, id) => index.includes(id));
    console.log('values', values.length);

    const symbols = [...new Set(values)];
    console.log('symbols', symbols);

    const data = [];
    symbols.forEach((value) => {
        const count = occurrences(values, value);
        data.push({ value, count });
    });

    console.log(data);

    return data;
};

const WordCloud = () => {
    const { wordCloudData } = useContext(ProjectorContext);

    return (
        <TagCloud
            tags={wordCloudData}
            minSize={16}
            maxSize={64}
            colorOptions={{ luminosity: 'dark' }}
        />
    );
};

export { WordCloud, WordCloudManager };
