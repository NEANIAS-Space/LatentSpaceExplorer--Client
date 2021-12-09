const graphManager = (components, points, labels, clusters, attribute = 0) => {
    // 5_o_Clock_Shadow
    // Arched_Eyebrows
    // Attractive
    // Bags_Under_Eyes
    // Bald => 5
    // Bangs
    // Big_Lips
    // Big_Nose
    // Black_Hair
    // Blond_Hair
    // Blurry
    // Brown_Hair
    // Bushy_Eyebrows
    // Chubby
    // Double_Chin
    // Eyeglasses => 16
    // Goatee
    // Gray_Hair
    // Heavy_Makeup
    // High_Cheekbones
    // Male => 21
    // Mouth_Slightly_Open
    // Mustache
    // Narrow_Eyes
    // No_Beard => 25
    // Oval_Face
    // Pale_Skin
    // Pointy_Nose
    // Receding_Hairline
    // Rosy_Cheeks
    // Sideburns
    // Smiling => 32
    // Straight_Hair
    // Wavy_Hair
    // Wearing_Earrings
    // Wearing_Hat => 36
    // Wearing_Lipstick
    // Wearing_Necklace
    // Wearing_Necktie
    // Young => 40

    const is3D = components === 3;
    const labelsName = Object.keys(labels[0]);
    const groups = Array.from(labelsName).fill(clusters);

    groups[0] = clusters;

    let l = labels.map((object) => Object.values(object));
    l = l[0].map((col, c) => l.map((row, r) => (l[r][c] ? 0 : 1)));

    for (let i = 1; i < l.length; i += 1) {
        groups[i] = l[i];
    }

    // console.log('groups', groups);

    const trace = {
        x: [],
        y: [],
        ...(is3D && { z: [] }),
        text: [],
        type: is3D ? 'scatter3d' : 'scatter',
        mode: 'markers',
        marker: {
            line: {
                color: 'rgb(0, 0, 0)',
                width: 1,
            },
        },
    };

    const graphData = Array.from([...new Set(groups[attribute])]).fill(trace);

    for (let i = 0; i < points.length; i += 1) {
        const group = groups[attribute][i];

        graphData[group] = {
            ...graphData[group],
            x: [...graphData[group].x, points[i][0]],
            y: [...graphData[group].y, points[i][1]],
            ...(is3D && {
                z: [...graphData[group].z, points[i][2]],
            }),
            text: [...graphData[group].text, labels[i].file_name],
        };
    }

    // console.log('graphData', graphData);

    return graphData;
};

export default graphManager;
