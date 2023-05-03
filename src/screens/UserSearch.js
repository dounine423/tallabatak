import { useEffect ,useState,useRef} from "react";
import { useSelector,useDispatch } from "react-redux";
import { View,StyleSheet ,Dimensions, ScrollView,ActivityIndicator } from "react-native";
import {Slider,Text,Icon ,Image} from '@rneui/themed';
import { Badge,Avatar } from "react-native-elements";
import CheckBoxText from "../components/CheckBox";
import { BASE_URL } from "../reducer/actionType";
import User from '../components/User';
import {searchUsersAction,sendChatAction,getChatAllDataAction} from '../reducer/action';

const UserSearch=(props)=>{
    const dispatch=useDispatch();

    const {userData,userList,category,notificationBadge}=useSelector((state)=>state.auth);
    const {location }=useSelector((state)=>state.location)
    const {result,isSuccess}=useSelector((state)=>state.user)

    const [radius,setRadius]=useState(10000);
    const [users,setUsers]=useState([]);
    const [initUsers,setInitUsers]=useState([])
    const [checked,setChecked]=useState([]);
    const [barFlag,setBarFlag]=useState(true);
    const [activityFlag,setActivity]=useState(false)
    const checkedRef =useRef(checked);
    const usersRef=useRef(users);
    const userInit=useRef(initUsers);
    let initData;
    let temp=[];
    category.map((item)=>{
        temp.push({...item,checked:false})
    })
    const [categories,setCategories]=useState(temp);

    useEffect(()=>{
      let req={
        user_id:userData.id,
        country:userData.country,
        city:userData.city,
        min:"0.01",
        max:radius,
        lat:location.currentLatitude,
        lng:location.currentLongitude
      }
      const timer=setTimeout(()=>{
        searchUsersAction(req)
          .then((res)=>parseRes(res))
          
          
      },500)
      return ()=>clearTimeout(timer);
    },[radius])
   const onchatNotificationClick = () => {
        props.navigation.navigate("notification");
      };
    
    const onBarHandler=()=>{
        setBarFlag(!barFlag);
        console.log("result",result);
        console.log("status",isSuccess)
    }


    const onCheckBoxHandler=(item,id)=>{
        let tempCate=[...categories];
        item.checked=!item.checked;
        tempCate[id]=item;
        setCategories([...tempCate]);
        if(item.checked==true){
            checkedRef.current.push(item.id);
        }else{
            checkedRef.current= checkedRef.current.filter((ele)=>{
                return ele!=item.id
            })
        }

        setChecked(checkedRef.current);
        // setChecked(tempChecked=>[...tempChecked]);
        // setChecked([])
        searchByCategory();
    }

    const searchByCategory=()=>{
        let checked_str="";
        checkedRef.current.map((item)=>{
            checked_str+="*"+item;
        });
        if(checkedRef.current.length==0){
          console.log(initData)
            usersRef.current=userInit.current
            setUsers(initUsers);
            return;
        }
        checked_str+="*";
        let result= usersRef.current.filter((item)=>{
            let cate_str="*"+item.interested_in+"*";
            return(
                checked_str.toLowerCase().indexOf(cate_str)>-1
            )
        })
        usersRef.current=result;
        setUsers(usersRef.current);
    }

    const radiusHandler=(value)=>{
        setRadius(value);
    }

    const parseRes=(res)=>{
        let res_data=res;
        res_data= res_data.sort((a,b)=>{
            return a.dist-b.dist;
        });
        usersRef.current=res_data;
        userInit.current=res_data;
        console.log(res_data)
        searchByCategory();

    }

    const onUserPress=(item)=>{
        let req={
          user_id:userData.id,
          client_id:item.id,
          message:"Hi",
          is_group:0
        };
        let req2={
          user_id:userData.id,
          client_id:0,
          last_message_id:1
        }
       dispatch(sendChatAction(req));
       dispatch(getChatAllDataAction(req2))
       props.navigation.navigate("peoples")
    }

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
              fontSize: 30,
              marginTop: 5,
              fontWeight: "bold",
            }}
          >
            Sellers
          </Text>
          <Icon
            name="notifications"
            color="#fd5631"
            size={45}
            iconStyle={styles.iconStyle}
            onPress={onchatNotificationClick}
          />
          {notificationBadge != 0 ? (
            <Badge status="success" value={notificationBadge} containerStyle={{position:"absolute",top:-4,right:70}}/>
          ) : null}
          <Avatar source={{uri:BASE_URL+userData.image}} rounded size={50}/>
            </View>
            {activityFlag ? (
          <ActivityIndicator size={100} style={styles.whiteOverlay} />
        ) : (
          <View style={styles.containerBody}>
                <ScrollView style={barFlag?styles.searchBar:styles.hideBar}>
                    {/* <Input value={index} onChangeText={onTextChangeHandler} leftIcon={{type:"font-awesome",name:"search", color:"#fd5631"}} placeholder="Enter the name of seller"/> */}
                    <Slider value={radius} onValueChange={radiusHandler} minimumValue={10} maximumValue={100000} step={100} trackStyle={styles.trackStyle} thumbProps={{
                        children:(
                            <Icon name="user" type="font-awesome" size={15} reverse containerStyle={{bottom:14,right:10}} color="#fd5631" />
                        )
                    }} thumbStyle={{ height: 20, width: 20, backgroundColor: 'transparent' }}/>
                    <Text style={styles.text}>{radius/1000}km</Text>
                    <Text style={{color:"#fd5631",fontSize:17}}>Category</Text>
                    {
                        categories.map((item,id)=>(
                            <CheckBoxText key={id} title={item.title_eng} checked={item.checked} onPress={()=>onCheckBoxHandler(item,id)}/>
                        ))
                    }

                </ScrollView>
                <Icon onPress={onBarHandler}  type="ionicon" name="list-outline" size={30} color="#fd5631"/>
                <ScrollView >
                    {usersRef.current.map((item,id)=>(
                        <User key={id} onPress={()=>onUserPress(item)} name={item.name} email={item.email} avatar={item.image} dist={item.dist?item.dist:null}/>
                    ))}
                </ScrollView>
            </View>
        )}

        </View>
    )
}

const styles = StyleSheet.create({
    background: {
      width: "100%",
      height: "100%",
      backgroundColor: "#ffffff",
      paddingRight:5,
      paddingLeft:5
    },
    iconStyle: {
      width: 50,
      height: 50,
      borderRadius: 50,
      marginLeft: 15,
      marginRight: 10,
      marginTop: 5,
    },
    containerBody:{
      display:"flex",
      flexDirection:"row",
      flex:1
    },
    hideBar:{
      display:"none"
    },
    searchBar:{
      marginLeft:10
  
    },
    notiBar:{
      marginTop:20
    },
    trackStyle:{
        height:6,
        backgroundColor:"transparent"
    },
    text:{
        textAlign:"center"
    },
    whiteOverlay: {
      position: "absolute",
      left: 0,
      right: 0,
      top: Dimensions.get("window").height / 4,
      bottom: 0,
      justifyContent: "center",
    },
  });

export default UserSearch;