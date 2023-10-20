const initialState = {
    streamName: null,
    publishingToken: null,
  };
  
  const publisherReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'publisher/setPublishingToken':
        return {
          ...state,
          publishingToken: action.payload,
        };
      case 'publisher/setStreamName':
        return {
          ...state,
          streamName: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default publisherReducer;
  