import { combineReducers } from "redux";
import authReducer from "./reducer/authReducer";
import groupReducer from "./reducer/groupReducer";
import userReducer from "./reducer/userReducer";
import notificationReducer from "./reducer/notificationReducer";
import locationReducer from "./reducer/locationReducer";
import puzzleReducer from "./reducer/puzzleReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  group: groupReducer,
  user: userReducer,
  noti: notificationReducer,
  location: locationReducer,
  puzzle:puzzleReducer
});

export default rootReducer;
