const initialState = {
  count2: 0,
};

const viewerReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'INCREMENT2':
      return {
        ...state,
        count2: state.count2 + 1,
      };
    case 'DECREMENT2':
      return {
        ...state,
        count2: state.count2 - 1,
      };
    default:
      return state;
  }
};

export default viewerReducer;
