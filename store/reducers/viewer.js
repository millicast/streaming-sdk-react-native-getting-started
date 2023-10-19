const initialState = {
  streamName: null,
  accountId: null
};

const viewerReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'viewer/setStreamName':
      return {
        ...state,
        streamName: action.payload,
      };
    case 'viewer/setAccountId':
      return {
        ...state,
        accountId: action.payload,
      };
    default:
      return state;
  }
};

export default viewerReducer;
