const initialState = {
    count1: 0,
  };
  
  const publisherReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'INCREMENT1':
        return {
          ...state,
          count1: state.count1 + 1,
        };
      case 'DECREMENT1':
        return {
          ...state,
          count1: state.count1 - 1,
        };
      default:
        return state;
    }
  };
  
  export default publisherReducer;
  