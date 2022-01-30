const projectorFormReducer = (state, action) => {
    switch (action.type) {
        case 'COMMON':
            return {
                ...state,
                [action.field]: action.value,
            };

        case 'ALGORITHM':
            return {
                ...state,
                [action.algorithm]: {
                    ...state[action.algorithm],
                    [action.field]: action.value,
                },
            };

        default:
            return state;
    }
};

export default projectorFormReducer;
