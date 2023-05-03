import {
  GET_SCORE_SUCCESS,
  GET_SCORE_START
} from "../actionType";

const INITAIL_STATE = {
  score: [],
  isLoading: true,
};

export default function notificationReducer(state = INITAIL_STATE, action) {
  switch (action.type) {
    case GET_SCORE_SUCCESS:
      return{
        score:action.payload.scores,
        isLoading:false
      }
    case GET_SCORE_START:
      return{
        isLoading:true
      }
    default:
      return state;
      break;
  }
}
