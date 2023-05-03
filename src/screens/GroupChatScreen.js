import { useState ,useEffect} from "react";
import { View ,StyleSheet,Text} from "react-native";
import { useSelector } from 'react-redux'
import { GiftedChat } from "react-native-gifted-chat";
import { Icon ,Badge,Avatar} from "react-native-elements";
import { BASE_URL } from '../reducer/actionType';
import {getGroupChatAction,groupChatAction} from '../reducer/action'
import { useCallback } from "react";

const GroupChatScreen=(props)=>{

    const userData=useSelector((state)=>state.auth.userData);
    const notificationBadge=useSelector((state)=>state.auth.notificationBadge);

    const [lastMsgId,setLastMsg]=useState(1);
    const [messages,setMessages]=useState([]);

    const group_data=props.route.params.group;
    const sender = {
        _id: userData.id,
        key: userData.id,
        avatar: BASE_URL+ userData.image,
        name: userData.name,
    };

    const receiver = {
        _id: group_data.thread_id,
        key: group_data.thread_id,
        avatar: BASE_URL+"assets/upload/5485546671658987044.png",
        name: group_data.group_name,
    };
    useEffect(()=>{
        let req={
            user_id:userData.id,
            group_id:group_data.thread_id,
            last_message_id:lastMsgId
        }
        let timer=setInterval(()=>{
            getGroupChatAction(req).then((res)=>{
                let temp=[];
                res.group_chat.map((item,id)=>{
                    if (item.sender == userData.id) {
                        temp.unshift({
                          text: item.message,
                          key: item.id,
                          _id: id,
                          user: sender,
                        });
                      } else {
                        temp.unshift({
                          text: item.message,
                          key: item.id,
                          _id: id,
                          user: {
                            id: sender,
                            name: "sss",
                            avatar: BASE_URL+"assets/upload/5485546671658987044.png",
                          },
                        });
                    }
                })
                setMessages(temp);
            })
        },2000)
        return ()=>clearInterval(timer)
    },[]);

   const onSend=useCallback((message=[])=>{
        let req={
            user_id:userData.id,
            thread_id:group_data.thread_id,
            last_message_id:lastMsgId,
            message: message[0].text,
        }
        groupChatAction(req)
    })
    
    const onchatNotificationClick = () => {
        props.navigation.navigate("notification");
    };
    
    return(
        <View style={styles.background}>
            <View
                style={{
                flexDirection: "row",
                marginTop: 40,
                justifyContent: "flex-end",
                }}
            >
                <Text
                style={{
                    textAlign: "auto",
                    fontSize: 22,
                    marginTop: 5,
                    fontWeight: "bold",
                }}
                >
                Group Chat Room
                </Text>
                    <Icon
                    name="notifications"
                    color="#fd5631"
                    size={45}
                    iconStyle={styles.iconStyle}
                    onPress={onchatNotificationClick}
                    />
                    {notificationBadge!=0?(<Badge value={notificationBadge} status="success" containerStyle={{position:"absolute",top:-5,right:70}}/>):null}
                <Avatar source={{uri:sender.avatar}} rounded size={50}/>
            </View>
            <GiftedChat
                messages={messages}
                showAvatarForEveryMessage={true}
                onSend={(messages) => onSend(messages)}
                showUserAvatar
                user={sender}
            />
        </View>
    )
}

const styles=StyleSheet.create({
    background: {
        flex: 1,
        width: "100%",
        height: "100%",
        backgroundColor: "#ffffff",
        paddingLeft:5,
        paddingRight:5
      },
      iconStyle: {
        width: 50,
        height: 50,
        borderRadius: 50,
        marginLeft: 15,
        marginRight: 10,
        marginTop: 5,
      },
})

export default GroupChatScreen;