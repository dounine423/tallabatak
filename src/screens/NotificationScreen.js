import React from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Text,
  Dimensions,
  Alert,
} from "react-native";
import { connect } from "react-redux";
import {  Icon,Badge ,Button,Avatar} from "react-native-elements";
import { getPuzzleDataAction ,changeNotiSetting,getSocreAction} from "../reducer/action";
import { BASE_URL } from "../reducer/actionType";
import CheckBoxText from "../components/CheckBox";

class Notification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notiList: [],
      setting:[],
      searchBarShow:false,
      index:"",
      activityFlag:false,
    };
  }
  componentDidMount = () => {
    const settingLabel=['New Notifications','Chat Notifications','Group Notifications','Post Notifications','Other Notifications'];
    const {  notiList,notiSetting } = this.props;
    let settings=[];
    let checked;
    for(let i=0;i<5;i++){
      if(notiSetting[i]==1)
        checked=true;
      else
        checked=false;
      settings.push({title:settingLabel[i],checked})
    }
    this.setState({
      notiList,
      setting:settings
    })
  };

  onchatNotificationClick = () => {
    // this.props.navigation.navigate("peoples");
  };

  onCheckBoxPress = (item,id) => {
    let {setting}=this.state;
    item.checked=!item.checked;
    setting[id]=item;
    this.setState({setting})
  };

  onSeacrhBarPress=()=>{
    let {searchBarShow} =this.state;
    this.setState({
      searchBarShow:!searchBarShow
    })
    
  }

  onOkBtnPress=(item,id)=>{
    this.setState({activityFlag:true})
    console.log(item)
    this.props.getPuzzleDataAction(item.post_id).then(()=>{
      this.setState({activityFlag:false});
      this.props.navigation.navigate('puzzle',{noti_id:item.id,post_url:item.other.click_action,item_id:id,post_id:item.post_id});
    });
  }

  onCancelBtnPress=(url)=>{
    Linking.openURL(url);
  }

  onNotiPress=(item,id)=>{
    switch(item.type){
      case "post-detail":
        if(item.is_puzzle_play=="0"){
          Alert.alert('Puzzle Play','', [
            {
              text: 'Cancel',
              // onPress: () =>this.onCancelBtnPress(item.other.click_action),
              style: 'cancel',
            },
            {
              text: 'Go to Post',
              onPress: () =>this.onCancelBtnPress(item.other.click_action),
              style: 'cancel',
            },
            {text: 'OK', onPress: () =>this.onOkBtnPress(item,id)},
          ]);
          break;
        } else{
          Linking.openURL(item.other.click_action);
          break;
        }
      case "chat":
        this.props.navigation.navigate('peoples');
        break;
      case "group":
        this.props.navigation.navigate('peoples');
        break;
      default:
        break;
    }

  }

  onBackHandler=()=>{
    this.props.navigation.navigate('peoples')
  }

  onSettingHandler=()=>{
    const {setting}=this.state;
    const {userData,location,radius}=this.props;
    this.setState({
      activityFlag:true
    })
    let settingValue="";
    let value;
    setting.map((item)=>{
      if(item.checked)
        value=1;
      else  
        value=0;
      settingValue+=value
    })
    let req={
      user_id:userData.id,
      status:settingValue,
      lat:location.currentLatitude,
      lng:location.currentLongitude,
      radius:radius,
      device_id:userData.device_id
    }
    this.props.changeNotiSetting(req).then(()=>{{
      this.setState({
        notiList:this.props.notiList,
        activityFlag:false,
        searchBarShow:false
      })
    }})
  }

  onPuzzleScoreHandler=(item)=>{
    const {score}=this.props;
    let req={
      post_id:item.post_id
    }
    this.setState({
      activityFlag:true
    })
    this.props.getSocreAction(req).then(()=>{
      this.setState({
        activityFlag:false
      });
      console.log(score)
      this.props.navigation.navigate('rank',{noti_id:item.id,score})
    })
  }

  render() {
    const {searchBarShow,notiList,activityFlag,setting} =this.state;
    const { userData,notificationBadge} = this.props;
    return (
      <View style={styles.background}>
        <View
          style={{
            flexDirection: "row",
            marginTop: 40,
            justifyContent: "flex-end",
          }}
        >
          {/* <Icon onPress={this.onBackHandler} style={styles.backIcon} size={30} type="ionicon" name="arrow-undo-outline" color="#fd5631"/> */}
          <Text
            style={{
              textAlign: "auto",
              fontSize: 30,
              marginTop: 5,
              fontWeight: "bold",
            }}
          >
            Notifications
          </Text>
          <Icon
            name="notifications"
            color="#fd5631"
            size={45}
            iconStyle={styles.iconStyle}
            onPress={this.onchatNotificationClick}
          />
          {notificationBadge != 0 ? (
            <Badge status="success" value={notificationBadge}  containerStyle={{position:"absolute",top:-4,right:70}}/>
          ) : null}
          <Avatar rounded source={{uri:BASE_URL+userData.image}} size={50}/>
        </View>
        <View style={styles.containerBody}>
          <ScrollView style={searchBarShow ? styles.searchBar :styles.hideBar}>
            {
              setting.map((item,id)=>(
                <CheckBoxText key={id} title={item.title} checked={item.checked} onPress={()=>this.onCheckBoxPress(item,id)} />
              ))
            }
            <Button  title="Confirm" onPress={this.onSettingHandler} buttonStyle={{backgroundColor:"#fd5631"}} containerStyle={{color:"#fd5631"}}  icon={
              <Icon
                name="checkmark-outline"
                size={20}
                color="white"
                type="ionicon"
              />
            }
            />
          </ScrollView>
          <Icon onPress={this.onSeacrhBarPress} type="ionicon" name="settings-outline" size={30} color="#fd5631"/>
          <ScrollView style={styles.notiBar}>
            {
              notiList.map((item, id) => (
                // <View key={id} style={{flexDirection:"row"}}>
                   <TouchableOpacity
                    key={id}
                    onPress={() => this.onNotiPress(item,id)}
                   >
                   <View style={{flexDirection:"row",justifyContent:"space-between"}}>
                    <Text style={styles.description}>{item.message}</Text>
                    {
                      item.is_puzzle_play?(<Icon iconStyle={{}}  onPress={()=>this.onPuzzleScoreHandler(item)} type="ionicon" name="attach-outline" size={25} color="#fd5631"/>):null
                    }
                    
                  </View>
                  <Text style={item.is_read == 0 ? styles.date : styles.diselectItem}> {item.created_at}</Text>
                </TouchableOpacity>
              ))
            }
           </ScrollView>
           {activityFlag ? (
          <ActivityIndicator size={100} style={styles.whiteOverlay} />
        ) : null}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
    backgroundColor: "#ffffff",
    paddingRight:5,
    paddingLeft:5
  },
  description: {
    fontSize: 17,
    flex:0.9,
    marginLeft:10,
    marginTop:15
  },
  date: {
    fontSize: 17,
    color: "#fd5631",
    margin: 10,
    textAlign: "right",
  },
  diselectItem: {
    fontSize: 17,
    margin: 10,
    textAlign: "right",
  },
  iconStyle: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginLeft: 15,
    marginRight: 10,
    marginTop: 5,
  },
  whiteOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: Dimensions.get("screen").height / 6,
    bottom: 0,
    justifyContent: "center",
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
    marginTop:30

  },
  notiBar:{
    marginTop:20
  },
  btn_color:{
    color:"#fd5631"
  },
  backIcon:{
   
  }
});

const mapStateToProps = (state) => ({
  userData: state.auth.userData,
  notiList: state.auth.notiList,
  notificationBadge: state.auth.notificationBadge,
  notiSetting:state.auth.notiSetting,
  puzzleFlag:state.puzzle.flag,
  location:state.location.location,
  radius:state.auth.radius,
  score:state.noti.score
});

const mapDispatchToProps = (dispatch) => ({
  getPuzzleDataAction:(data)=>dispatch(getPuzzleDataAction(data)),
  changeNotiSetting:(data)=>dispatch(changeNotiSetting(data)),
  getSocreAction:(data)=>dispatch(getSocreAction(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
