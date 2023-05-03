import axios from "axios";
import Geolocation from "@react-native-community/geolocation";
import {
  AUTH_SUCCESS,
  AUTH_FAIL,
  CHAT_FAIL,
  CHAT_SUCCESS,
  GET_GROUPS_SUCCESS,
  GET_GROUPS_FAIL,
  GET_CHAT_DATA_FAIL,
  GET_CHAT_DATA_SUCCESS,
  GET_NOTIFICATIONS_SUCCESS,
  GET_NOTIFICATIONS_FAIL,
  CREATE_GROUP_FAIL,
  CREATE_GROUP_SUCCESS,
  GET_LOCATION,
  BASE_URL,
  GET_PUZZLE_DATA_SUCCESS,
  GET_PUZZLE_DATA_FAIL,
  SEND_LOCATION_SUCCESS,
  PUZZLE_FINISHED,
  CHANGE_SETTING_SUCCESS,
  CHNAGE_SEND_STATUS,
  MARK_AS_READ_CHAT,
  GET_SCORE_SUCCESS,
  GET_SCORE_START,
  GET_NEAR_BY_USERS_STRAT,
  GET_NEAR_BY_USERS_SUCCESS
} from "./actionType";



const authSuccess = (userData) => {
  return {
    type: AUTH_SUCCESS,
    payload: userData,
  };
};

const authFail = (err) => {
  return {
    type: AUTH_FAIL,
    payload: err,
  };
};

const getChatDataSuccess = (chatData) => {
  return {
    type: GET_CHAT_DATA_SUCCESS,
    payload: chatData.dm,
  };
};

const getChatDataFail = () => {
  return {
    typy: GET_CHAT_DATA_FAIL,
  };
};

const getGroupInfoSuccess = (groupList) => {
  return {
    type: GET_GROUPS_SUCCESS,
    payload: groupList,
  };
};

const getGroupInfoFail = () => {
  return {
    type: GET_GROUPS_FAIL,
  };
};

const createGroupSuccess = (group_list,groupData,group_id) => {
  let new_group={
    group_name:groupData.group_name,
    message:"New group "+groupData.group_name+" created",
    thread_id:group_id
  }
  group_list.unshift(new_group);
  return {
    type: CREATE_GROUP_SUCCESS,
    payload: group_list,
  };
};

const createGroupFail = () => {
  return {
    type: CREATE_GROUP_FAIL,
  };
};

const getNotificationSuccess = (notification) => {
  return {
    type: GET_NOTIFICATIONS_SUCCESS,
    payload: notification.notifi,
  };
};

const getNotificationFail = () => {
  return {
    type: GET_NOTIFICATIONS_FAIL,
  };
};

const getLocation = (location) => {
  return {
    type: GET_LOCATION,
    payload: location,
  };
};

const getPuzzleDataSuccess=(data)=>{
  return {
    type:GET_PUZZLE_DATA_SUCCESS,
    payload:data
  }
}

const getPuzzleDataFail=(data)=>{
  return {
    type:GET_PUZZLE_DATA_FAIL,
    payload:data
  }
}

const sendLocationSuccess=(data)=>{
  return {
    type:SEND_LOCATION_SUCCESS,
    payload:data
  }
}

const addChat=(data)=>{
  return{
    type:CHAT_SUCCESS,
    payload:data
  }
}

const puzzleFinishedSuccess=(data)=>{
  return {
    type:PUZZLE_FINISHED,
    payload:data
  }
}

const notiSettingChangeSuccess=(setting,notiData)=>{
  let changedData={
    notiSetting:setting.status,
    notiList:notiData.noti_list,
    noti_unread:notiData.notification_count
  }
  return{
    type:CHANGE_SETTING_SUCCESS,
    payload:changedData
  }
}

const markasReadChatSuccess=(data)=>{
  return{
    type:MARK_AS_READ_CHAT,
    payload:data
  }
}

const getScoreSuccess=(data)=>{
  return{
    type:GET_SCORE_SUCCESS,
    payload:data
  }
}

const getScoreStart=()=>{
  return{
    type:GET_SCORE_START
  }
}

const getNearUsersSuccess=(data)=>{
  return{
    type:GET_NEAR_BY_USERS_SUCCESS,
    payload:data
  }
}

const getNearUsersStart=()=>{
  return{
    type:GET_NEAR_BY_USERS_STRAT
  }
}

export const login = (data) => {
  return (dispatch) => {
    return axios({
      url: BASE_URL+"Login/do_login_app",
      method: "post",
      data,
    })
      .then((res) => {
        if (res.data.status == 1) {
          dispatch(authSuccess(res.data));
        } else {
          dispatch(authFail("err"));
        }
      })
      .catch((err) => {
        dispatch(authFail(err));
      });
  };
};

export const sendChatAction = (data) =>(dispatch)=> {
  dispatch(addChat(data));
  axios({
    url: BASE_URL+"Chat/ajax_send_message",
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
    method: "post",
    data
  }).then((res)=>{
    
  }).catch((err)=>{
    
  })
};

export const createGroupAction = (groupData,group_list) => {
  let formData = new FormData();
  formData.append("group_name", groupData.group_name);
  formData.append("country", groupData.country);
  formData.append("state", groupData.state);
  formData.append("city", groupData.city);
  formData.append("user_id", groupData.user_id);
  formData.append("user_name", groupData.user_name);
  groupData.members.map((item) => {
    formData.append("members[]", item);
  });
  return (dispatch) => {
    return axios({
      url: BASE_URL+"Chat/ajax_create_group",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      method: "post",
      data: formData,
    }).then((res) => {
      if (res.status < 300) {
        dispatch(createGroupSuccess(group_list,groupData,res.data.group_id));
      } else {
        dispatch(createGroupFail);
      }
    });
  };
};

export const getGroupInfoAction = (msgData) => {
  let formData = new FormData();
  formData.append("user_id", msgData.userId);
  formData.append("longitude", msgData.currentLongitude);
  formData.append("latitude", msgData.currentLatitude);
  return (dispatch) => {
    return axios({
      url: BASE_URL+"Chat/get_group_info",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      method: "post",

      data: formData,
    })
      .then((res) => {
        if (res.status < 300) {
          dispatch(getGroupInfoSuccess(res.data));
        } else {
          dispatch(getGroupInfoFail());
        }
      })
      .catch((err) => {
        dispatch(getGroupInfoFail());
      });
  };
};

export const getNotificationAction = (userId) => {
  let formData = new FormData();
  formData.append("user_id", userId);
  return (dispatch) => {
    return axios({
      url: BASE_URL+"Home/GetPushmsg",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      method: "post",
      data: formData,
    })
      .then((res) => {
        if (res.status < 300) {
          dispatch(getNotificationSuccess(res.data));
        } else {
          dispatch(getNotificationFail());
        }
      })
      .catch((err) => {
        dispatch(getGroupInfoFail());
      });
  };
};

export const getChatAllDataAction = (data) => {
  return (dispatch) => {
    return axios({
      url: BASE_URL+"Chat/get_current_dm",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      method: "post",
      data
    })
      .then((res) => {
        if (res.status < 300) {
          dispatch(getChatDataSuccess(res.data));
        } else {
          dispatch(getChatDataFail());
        }
      })
      .catch(() => {});
  };
};

export async function getChatDataAction(data) {
  const response = await axios({
    url: BASE_URL+"Chat/get_current_dm",
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
    method: "post",
    data
  });
  return response.data
}

export async function chatAction(msgData) {
  let formData = new FormData();
  formData.append("user_id", msgData.user_id);
  formData.append("client_id", msgData.client_id);
  formData.append("message", msgData.message);
  formData.append("is_group", msgData.is_group);
  const response = await axios({
    url: BASE_URL+"Chat/ajax_send_message",
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
    method: "post",
    data: formData,
  });
  return response;
}

export async function groupChatAction(data) {
  const response = await axios({
    url: BASE_URL+"Chat/chat_group_app",
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
    data,
  });
  return response;
}

export async function getGroupChatAction(msgData) {
  let formData = new FormData();
  formData.append("user_id", msgData.user_id);
  formData.append("group_id", msgData.group_id);
  formData.append("last_message_id", msgData.last_msg_id);
  const response = await axios({
    url: BASE_URL+"Chat/get_current_group",
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  });
  return response.data;
}

export const getOneTimeLocation = () => {
  return (dispatch) => {
    Geolocation.getCurrentPosition((position) => {
      const currentLongitude = JSON.stringify(position.coords.longitude);
      const currentLatitude = JSON.stringify(position.coords.latitude);
      let location = {
        currentLatitude,
        currentLongitude,
      };
      dispatch(getLocation(location));
    });
  };
};

export const subscribeLocation = () => {
  return (dispatch) => {
    watchID = Geolocation.watchPosition((position) => {
      const currentLongitude = JSON.stringify(position.coords.longitude);
      const currentLatitude = JSON.stringify(position.coords.latitude);
      let location = {
        currentLatitude,
        currentLongitude,
      };
      dispatch(getLocation(location));
    });
  };
};

export const getPuzzleDataAction=(post_id)=>{
  let data={
    post_id
  }
  return (dispatch)=>{
    return axios({
      url: BASE_URL+"Chat/get_puzzle_data",
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      data,
    }).then((res)=>{
      if(res.data.status=="success"){
        dispatch(getPuzzleDataSuccess(res.data));
      }
      else 
        dispatch(getPuzzleDataFail(res.data.message));
    })
  }  
}

export const puzzleFinished=(scoreData,notiData)=>(dispatch)=>{
  axios({
    url:BASE_URL+"Chat/puzzle_finished",
    method:"post",
    headers:{
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
    data:scoreData
  }).then(()=>[
    dispatch(puzzleFinishedSuccess(notiData))
  ])
}

export async function  searchUsersAction (data){
const result= await axios({
    url:BASE_URL+"Home/get_near_users",
    method:"post",
    headers:{
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
    data
  })
  return result.data;
}

export const sendLocationAction=(data)=>{
  return (dispatch)=>{
    return axios({
      url:BASE_URL+"Home/real_time_response",
      method:"post",
      headers:{
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      data
    }).then((res)=>{
      console.log("action event")
      dispatch(sendLocationSuccess(res.data));
    }).catch((err)=>{
    })
  }
 
}

export const changeNotiSetting=(data)=>{
  return (dispatch)=>{
    return axios({
      url: BASE_URL+"Chat/set_noti_setting",
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      data,
    }).then((res)=>{
      if(res.data.status=="success"){
        dispatch(notiSettingChangeSuccess(data,res.data));
      }
    })
  }  
}

export const sendDataStatus=()=>{
  return (dispatch)=>{
    dispatch({type:CHNAGE_SEND_STATUS})
  }
}

export const markAsReadChat=(data)=>{
  return (dispatch)=>{
    return axios({
      url:BASE_URL+"Chat/markAsChatRead",
      method:"post",
      headers:{
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      data
    }).then((res)=>{
      dispatch(markasReadChatSuccess(res.data))
    })
  }
}

export const getSocreAction=(data)=>{
  return(dispatch)=>{
    dispatch(getScoreStart())
    return axios({
      url:BASE_URL+"Chat/get_score",
      method:"post",
      headers:{
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      data
    }).then((res)=>{
      dispatch(getScoreSuccess(res.data))
    })
  }
}


