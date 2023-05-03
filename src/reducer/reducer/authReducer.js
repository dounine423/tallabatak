import {MARK_AS_READ_CHAT, AUTH_SUCCESS, AUTH_FAIL,SEND_LOCATION_SUCCESS,CREATE_GROUP_SUCCESS,GET_CHAT_DATA_SUCCESS,CHANGE_SETTING_SUCCESS,PUZZLE_FINISHED,CHNAGE_SEND_STATUS} from "../actionType";
const INITIAL_STATE = {
  isLoggedIn: false,
  isLoading: true,
  userData: {},
  error: undefined,
  notificationBadge: 0,
  chatBadge: 0,
  chatList: [],
  groupList:[],
  userList: [],
  notiList:[],
};

export default function authReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case AUTH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isLoggedIn: true,
        userData: action.payload.user_data,
        userList: action.payload.user_list,
        radius:action.payload.radius,
        category:action.payload.category,
        notiList:action.payload.noti_list,
        notificationBadge: action.payload.notification_count,
        chatList: action.payload.chat_list,
        groupList:action.payload.group_list,
        notiSetting:action.payload.noti_setting,
        error: undefined,
      };
      break;
    case AUTH_FAIL:
      return {
        ...state,
        isLoading: false,
        isLoggedIn: false,
        error: action.payload,
      };
    case SEND_LOCATION_SUCCESS:
      console.log("reducer",action.payload);
      return{
        ...state,
        isLoading:true,
        notiList:action.payload.noti_list,
        notificationBadge:action.payload.notification_count,
        chatList:action.payload.chat_list,
        groupList:action.payload.group_list
      }
      break;
    case CREATE_GROUP_SUCCESS:
      return {
        ...state,
        groupList:action.payload
      }
    case CHNAGE_SEND_STATUS:
      return{
        ...state,
        isLoading:false,
      }
    case GET_CHAT_DATA_SUCCESS:
      return{
        ...state,
        chatList:action.payload
      }
    case CHANGE_SETTING_SUCCESS:
      return{
        ...state,
        notiSetting:action.payload.notiSetting,
        notiList:action.payload.notiList,
        notificationBadge:action.payload.noti_unread
      }
    case PUZZLE_FINISHED:
      return{
        ...state,
        notiList:action.payload
      }
    case MARK_AS_READ_CHAT:
      return{
        ...state,
        chatList:action.payload
      }
    case "ATUH_LOGOUT":
      return {
        ...state,
        isLoading: false,
        isLoggedIn: false,
      };
      break;
    default:
      return state;
  }
}
