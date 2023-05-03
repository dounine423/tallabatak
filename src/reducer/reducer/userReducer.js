import {
  GET_NEAR_BY_USERS_STRAT,
  GET_NEAR_BY_USERS_SUCCESS
} from "../actionType";
const INITIAL_STATE = {
  isSuccess: false,
  result:[]
};

export default function userReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_NEAR_BY_USERS_STRAT:
      return{
        ...state,
        isSuccess:false
      }
    case GET_NEAR_BY_USERS_SUCCESS:
      return{
        isSuccess:true,
        result:action.payload
      }
    default:
      return state;
  }
}
