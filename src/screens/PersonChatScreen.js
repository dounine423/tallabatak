import {useEffect,useState,useCallback} from 'react'
import { View,Text,StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'
import { GiftedChat } from "react-native-gifted-chat";
import { Icon ,Badge,Avatar} from "react-native-elements";
import { BASE_URL } from '../reducer/actionType';
import {getChatDataAction,chatAction} from '../reducer/action'

const PersonChatScreen=(props)=>{
    
    const [messages,setMessages]=useState([]);
    const [lastMsgId,setLastId]=useState(1);

    const userData=useSelector((state)=>state.auth.userData);
    const notificationBadge=useSelector((state)=>state.auth.notificationBadge)

    const client=props.route.params.client;
    const sender = {
        _id: userData.id,
        key: userData.id,
        avatar: BASE_URL+ userData.image,
        name: userData.name,
      };
    const receiver = {
      _id: client.client_id,
      key: client.client_id,
      avatar: BASE_URL+"assets/upload/5485546671658987044.png",
      name: client.client_name,
    };

    const req={
        user_id:userData.id,
        client_id:client.client_id,
        last_message_id:lastMsgId,
    }

    useEffect(()=>{
        let timer=setInterval(()=>{
            let temp=[];
            getChatDataAction(req).then((res)=>{
                res.dm.map((item,id)=>{
                    if (item.sender == client.client_id) {
                        temp.unshift({
                            _id: item.id,
                            key: id,
                            text: item.message,
                            user: receiver,
                        });
                    }
                    if (item.sender == userData.id) {
                        temp.unshift({
                            _id: item.id,
                            key: id,
                            text: item.message,
                            user: sender,
                        });
                    }
                })
                setMessages(temp);
            });
        },2000);
        
        return ()=>clearInterval(timer);
    },[]);

    const onSend=useCallback((message=[])=>{
        let req={
            user_id:userData.id,
            client_id:client.client_id,
            message:message[0].text
        }
        chatAction(req);
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
               Person Chat Room
                </Text>
                    <Icon
                    name="notifications"
                    color="#fd5631"
                    size={45}
                    iconStyle={styles.iconStyle}
                    onPress={onchatNotificationClick}
                    />
                    {notificationBadge!=0?(<Badge value={notificationBadge} status="success" containerStyle={{position:"absolute",top:-4,right:70}}/>):null}
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

export default PersonChatScreen