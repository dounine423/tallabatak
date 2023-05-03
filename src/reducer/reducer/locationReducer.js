import { GET_LOCATION } from "../actionType";

const INITIAL_STATE = {
  location: {},
};
export default function locationReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_LOCATION:
      return {
        ...state,
        location: action.payload,
      };
      break;
    default:
      return state;
      break;
  }
}
