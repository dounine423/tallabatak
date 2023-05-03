import {
  GET_GROUPS_FAIL,

} from "../actionType";
const INITIAL_STATE = {
  isSuccess: false,
  groupList: [],
};

export default function groupReducer(state = INITIAL_STATE, action) {
  switch (action.type) {

    case GET_GROUPS_FAIL:
      return {
        ...state,
        isSuccess: false,
      };
      break;
    default:
      return state;
      break;
  }
}
