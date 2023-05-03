import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert
} from "react-native";
import { Button } from "react-native-paper";
import { Input, Icon,Avatar,Badge } from "react-native-elements";
import { connect } from "react-redux";
import { theme } from "../components/theme";
import Client from "../components/Client";
import Group from "../components/Group";
import CheckBoxText from "../components/CheckBox";
import {
  createGroupAction,
  markAsReadChat,
  sendLocationAction,
  getOneTimeLocation
} from "../reducer/action";
import { BASE_URL } from "../reducer/actionType";

class PeoplesScreen extends React.Component {
  constructor(props) {
    super(props);
    const {device_id}=this.props.route.params;
    this.state = {
      PersonGroupFlag: true,
      visible: false,
      chatList: [],
      groupName:"",
      device_id
    };
  }

  sendLocation=()=>{
    const { location,radius,userData ,status} = this.props;
    const {device_id}=this.state;
    let request={
      user_id:userData.id,
      lat:location.currentLatitude,
      lng:location.currentLongitude,
      radius,
      device_id,
      status
    };
    this.props.getOneTimeLocation();
    this.props.sendLocationAction(request).then(()=>{
      console.log("request every 4.5s",request);
    });
   
  }

  componentDidMount() {
    const timer=setInterval(()=>{
      this.sendLocation();
    },4500)
    this.setState({timer})
    let userListData = [];
    const { userData, userList } = this.props;
    this.setState({
      userId: userData.id,
      userName: userData.name,
      userPhoto: BASE_URL + userData.image,
      userListData,
    });
    userList.map((item) =>
      userListData.push({
        id: item.id,
        name: item.name,
        email: item.email,
        isChecked: false,
      })
    );
  }

  componentWillUnmount(){
    const {timer}=this.state;
    console.log("component dismonet");
    clearInterval(timer);
  }

  onchatNotificationClick = () => {
    // Toast.show({
    //   type:"success",
    //   text1:"hello",
    //   text2:"this is simple "
    // })
    this.props.navigation.navigate("notification");
  };

  onClientPress = (item,id) => {
    let sender=this.props.userData.id;
    let thread_id=item.thread_id;
    let sen_cli=thread_id.split('_');
    let client_id=sen_cli.find((ele)=>{
      return ele!=sender
    })
    let req={
      sender,
      client_id,
      thread_id
    }
    this.props.markAsReadChat(req);
    this.props.navigation.navigate("person-chat", { type: "person", client: item });
  };

  onGroupPersoanlBtnPress = () => {
    this.setState({
      PersonGroupFlag: !this.state.PersonGroupFlag,
    });
  };

  onNewGroupPress = () => {
    this.setState({
      visible: true,
    });
  };

  onModalCancelPress = () => {
    this.setState({
      visible: false,
    });
  };

  onCheckBoxHandler = (item, id) => {
    let { userListData } = this.state;
    item.isChecked = !item.isChecked;
    userListData[id] = item;
    this.setState({
      userListData,
    });
  };

  onCreateGroupPress = () => {
    const {  groupName, userId, userName } = this.state;
    let {groupList}=this.props;
   let result= this.validation();
   if(result==false){
    return;
   }else{
    let groupInfo = {
      group_name: groupName,
      country: "Germany",
      state: "Local",
      city: "Hamburg",
      user_id: userId,
      members:result,
      user_name: userName,
    };

    this.props.createGroupAction(groupInfo,groupList)
    this.setState({visible: false})
   }
  };

  onGroupNameChange = (groupName) => {
    this.setState({
      groupName,
    });
  };

  validation=()=>{
    const {groupName,userListData}=this.state;
    let members=[];
    userListData.map((item,id)=>{
      if (item.isChecked){
        members.push(item.id);
      } 
    })
    if(groupName==""||members.length<2){
      Alert.alert("Group name must be filled and Select more than 2 members");
      return false;
    }else{
      return members;
    }
  }

  onGroupListPress = (item) => {
    this.props.navigation.navigate("group-chat", { type: "group", group: item });
  };

  onAddUserPress=()=>{
    this.props.navigation.navigate('users');
  }

  render() {
    const {
      PersonGroupFlag,
      visible,
      userListData,
      groupName,
    } = this.state;
    const { notificationBadge,chatList,groupList,userData} = this.props;
    return (
      <View style={styles.background}>
        <View
          style={{
            flexDirection: "row",
            marginTop: 40,
            justifyContent: "flex-end",
          }}
        >
          {
            PersonGroupFlag?(<Icon onPress={this.onAddUserPress} type="font-awesome" name="user-plus" reverse size={25} color="#fd5631" style={{marginTop:-5}}/>):null
        }
          
          <Text
            style={{
              textAlign: "auto",
              fontSize: 30,
              marginTop: 5,
              fontWeight: "bold",
            }}
          >
            Contacts
          </Text>
              <Icon
                name="notifications"
                color="#fd5631"
                size={45}
                iconStyle={styles.iconStyle}
                onPress={this.onchatNotificationClick}
              />
              {notificationBadge!=0?(<Badge status="success" value={notificationBadge} containerStyle={{position:"absolute",top:-4,right:70}}/>):null}
            <Avatar source={{uri:BASE_URL+userData.image}} rounded size={50}/>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={this.onGroupPersoanlBtnPress}
          >
            <Button
              mode={PersonGroupFlag ? "contained" : "outlined"}
              style={PersonGroupFlag ? styles.selectedButton : null}
            >
              <Text
                style={PersonGroupFlag ? styles.textStyle : styles.buttonText}
              >
                Personal
              </Text>
            </Button>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={this.onGroupPersoanlBtnPress}
          >
            <Button
              mode={PersonGroupFlag ? "outlined" : "contained"}
              style={PersonGroupFlag ? null : styles.selectedButton}
            >
              <Text
                style={PersonGroupFlag ? styles.buttonText : styles.textStyle}
              >
                Group
              </Text>
            </Button>
          </TouchableOpacity>
        </View>
        {PersonGroupFlag ? (
          <View>
            <ScrollView>
              {chatList.map((item, id) => (
                <TouchableOpacity
                  key={id}
                  onPress={() => {
                    this.onClientPress(item,id);
                  }}
                >
                  <Client
                    lastMsg={item.message}
                    userName={item.client_name}
                    avatar={BASE_URL+"assets/upload/5485546671658987044.png"}
                    badge={item.unread_count}
                    id={id}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ) : (
          <React.Fragment>
            <Modal animationType="slide" transparent visible={visible}>
              <View style={styles.modalView}>
                <Input
                  placeholder="Enter the Group name"
                  value={groupName}
                  onChangeText={this.onGroupNameChange}
                  style={styles.groupName}
                />
                <ScrollView style={styles.scrollStyle}>
                  <View>
                    {userListData.map((item, id) => (
                      <CheckBoxText key={id} title={item.name} checked={item.isChecked} onPress={()=>this.onCheckBoxHandler(item,id)}/>
                    ))}
                  </View>
                </ScrollView>
                <View style={styles.modalButtonContainer}>
                  <Button
                    mode="contained"
                    labelStyle={styles.textStyle}
                    style={styles.selectedButton}
                    onPress={this.onCreateGroupPress}
                  >
                    Create
                  </Button>
                  <Button
                    onPress={this.onModalCancelPress}
                    labelStyle={styles.buttonText}
                  >
                    Cancel
                  </Button>
                </View>
              </View>
            </Modal>
            <ScrollView>
              {groupList.map((item, id) => (
                <TouchableOpacity
                  key={id}
                  onPress={() => {
                    this.onGroupListPress(item);
                  }}
                >
                  <Group
                    avatar={BASE_URL+"assets/upload/5485546671658987044.png"}
                    groupName={item.group_name}
                    lastMsg={item.message}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Button
              icon="plus"
              mode="contained"
              style={styles.newGroupContainer}
              onPress={this.onNewGroupPress}
            />
          </React.Fragment>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
    backgroundColor: theme.colors.surface,
    paddingLeft:5,
    paddingRight:5
  },
  imageStyle: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginLeft: 15,
    marginRight: 10,
    borderColor: "#fd5631",
    borderWidth: 2,
    padding: 7,
  },
  iconStyle: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginLeft: 15,
    marginRight: 10,
    marginTop: 5,
  },
  scrollStyle: {
    paddingHorizontal: "7%",
    marginBottom: "18%",
    paddingBottom: "1.5%",
  },
  searchStyle: {
    margin: 10,
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    margin: 10,
  },
  modalButtonContainer: {
    flexDirection: "row",
    margin: 10,
    position: "absolute",
    bottom: 20,
  },
  buttonStyle: {
    width: "50%",
  },
  selectedButton: {
    backgroundColor: "#fd5631",
    marginLeft: 5,
    marginRight: 5,
  },
  buttonText: {
    color: "#fd5631",
    fontSize: 20,
    textAlign: "center",
  },
  textStyle: {
    fontSize: 20,
    textAlign: "center",
  },
  textListView: {
    fontSize: 25,
    textAlign: "center",
    margin: 7,
  },
  newGroupContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#fd5631",
  },
  modalView: {
    marginTop: 40,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 45,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  checkboxStyle: {
    position: "absolute",
    right: 0,
    top: 5,
  },
  badgeStyle: {
    position: "absolute",
    width: 25,
    height: 25,
    left: 41,
    top: -5,
  },
  modalName: {
    fontSize: 22,
  },
  modalEmail: {
    color: "grey",
  },
  groupName: {
    marginTop: 10,
    borderBottomWidth: 2,
    borderColor: "#fd5631",
  },
});

const mapStateToProps = (state) => ({
  userData: state.auth.userData,
  notificationBadge: state.auth.notificationBadge,
  userList: state.auth.userList,
  groupList: state.auth.groupList,
  chatList: state.auth.chatList,
  lastId: state.group.lastId,
  radius:state.auth.radius,
  location: state.location.location,
  status:state.auth.notiSetting,
});

const mapDispatchToProps = (dispatch) => ({
  createGroupAction: (data1,data2) => dispatch(createGroupAction(data1,data2)),
  markAsReadChat:(data)=>dispatch(markAsReadChat(data)),
  sendLocationAction:(data)=>dispatch(sendLocationAction(data)),
  getOneTimeLocation: () => dispatch(getOneTimeLocation()),
});

export default connect(mapStateToProps, mapDispatchToProps)(PeoplesScreen);
