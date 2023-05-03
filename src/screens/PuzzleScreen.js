import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Modal,
  Linking,
  Dimensions,
  StyleSheet,
  Alert,
  ActivityIndicator,

} from "react-native";
import {useDispatch,useSelector} from 'react-redux'
import {Button,Image} from 'react-native-elements'
import Card from "../components/card";
import { puzzleFinished,getSocreAction } from "../reducer/action";
import { BASE_URL } from "../reducer/actionType";

const PuzzleScreen = (props) => {
  
  const dispatch=useDispatch();

  const screen=Dimensions.get("screen").width;
  const {noti_id,post_url,item_id,post_id}=props.route.params;
  const {difficulty,puzzle_data,post_title,post_img,img_count,time}=useSelector((state)=>state.puzzle);
  const noti_list=useSelector((state)=>state.auth.notiList);
  const {isLoading,score} =useSelector((state)=>state.noti);

  const [sec, setSec] = useState(time);
  const [timer, setTimer] = useState(0);
  const [cardRender,setCardRender]=useState(true)
  const [gameFlag,setGameFlag]=useState(img_count);
  const [attempCard,setAttempCard]=useState([]);
  const [totalData,setTotalData]=useState(puzzle_data);
  const [size,setSize]=useState((screen-50)/difficulty);
  const [modalFlag,setModalFlag]=useState(false);
  const [attempFlag,setAttempFlag]=useState(true);
  const secRef = useRef(sec);

  

  useEffect(() => {
    setAttempCard([]);
    setTotalData(puzzle_data)
    startGame();
    return ()=>
     clearInterval(timer)
    
  }, []);

  const startGame=()=>{
    let secTimer = setInterval(() => {
    secRef.current -= 1;
    setSec(secRef.current);
    setCardRender(false);
    if(secRef.current<1){
      clearInterval(secTimer);
      gameFinish(false)
    }
    }, 1000);
    setTimer(secTimer);
  }

  const swapCard=(ids,flag)=>{
    let temp=totalData;
    temp[ids[0]][ids[1]].show=flag
    setTotalData([...temp])
  }

  const verifyCard=(ids)=>{
    let temp=totalData;
    temp[ids[0]][ids[1]].check=true
  }

  const compareCard=()=>{
    if(attempCard[0].cardId==attempCard[1].cardId){
      return true
    }else
      return false
  }

  const compareSuccess=()=>{
    swapCard(attempCard[0].id,true)
    swapCard(attempCard[1].id,true)
    verifyCard(attempCard[0].id)
    verifyCard(attempCard[1].id)
    setAttempCard([])
    setGameFlag(gameFlag-1)
    if(gameFlag==1){
      clearInterval(timer)
      gameFinish(true)
    }
  }

  const compareFail=()=>{
    swapCard(attempCard[0].id,false)
    swapCard(attempCard[1].id,false)
    setAttempCard([])
  }

  const gameFinish=(flag)=>{
    clearInterval(timer);
    if(flag==true){
      setModalFlag(true);
      let scoreData={
        success:1,
        score:(time-secRef.current),
        noti_id,
        post_id
      }
      let noti_temp=noti_list;
      noti_temp[item_id].is_puzzle_play=1;
      noti_temp[item_id].score=scoreData.score;
      dispatch( puzzleFinished(scoreData,noti_temp));
    }else{
      let req={
        success:2,
        score:0,
        noti_id,
        post_id
      }
      let noti_temp=noti_list;
      noti_temp[item_id].is_puzzle_play=2;
      dispatch( puzzleFinished(req,noti_temp));
      Alert.alert('Game Over','',[ {text: 'OK', onPress: () =>  props.navigation.navigate('notification')}]);
    }
    
  }

  const addAttempCard=(id,cardId)=>{
    let data={
      id,
      cardId
    }
    let temp=attempCard
    temp.push(data)
    setAttempCard([...temp])
    if(attempCard.length>1){
      setAttempFlag(false);
      if(compareCard()){
        setTimeout(()=>{
          compareSuccess();
          setAttempFlag(true);
        },700)
      }      
      else{
        setTimeout(()=>{
          compareFail();
          setAttempFlag(true)
        },700)
      }
    }
    
  }
  const handleCardPress=(id,cardId)=>{
    if(attempFlag==true){
      setCardRender(true)
      const ids=id.split('*')
      swapCard(ids,true)
      addAttempCard(ids,cardId)
    }
  }

  const onPostPress=()=>{
    Linking.openURL(post_url);
  }

  const onScorePress=()=>{
    dispatch(getSocreAction({post_id}));
    if(isLoading==false){
      props.navigation.navigate('rank',{noti_id,score});
    }
  }

  const timerPaser=()=>{
    let time={
      min:(Math.floor(secRef.current/60)>9?Math.floor(secRef.current/60):"0"+Math.floor(secRef.current/60)),
      sec:((secRef.current%60)>9?(secRef.current%60):"0"+(secRef.current%60))
    }
    return time;
  }

  return (
    <View style={styles.container}>
      <Modal
          animationType="slide"
          transparent={true}
          visible={modalFlag}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Your Score : {((time-secRef.current))} s</Text>
              <Text style={styles.modalText}>You got coupon on {post_title}</Text>
              <Image onPress={onPostPress} source={{uri:BASE_URL+post_img}} style={{width:(screen-100),height:(screen-100)}}/>
              <View style={styles.buttonContainer}>
                <Button  buttonStyle={{backgroundColor:"#fd5631",margin:10,borderRadius:10}}  onPress={onPostPress} title="Go to Post"/>
                <Button  type="outline" buttonStyle={styles.button} titleStyle={styles.titleStyle} onPress={onScorePress} title="Go to Score"/>
              </View>
            </View>
          </View>
      </Modal>
      <ScrollView >
      {isLoading ? (
          <ActivityIndicator size={100} style={styles.whiteOverlay} />
        ) : null}
        <View style={styles.textContainer}>
          <Text style={styles.textStyle}> Time Left  </Text> 
          <Text style={styles.timeText}>{timerPaser().min} m : {timerPaser().sec} s</Text>
        </View>
        {/* <Button title="stop" onPress={stopBtnPress}/> */}
        {
          cardRender?(totalData.map((cards,rowId)=>(
            <View key={rowId} style={styles.cardRow}> 
              {
               cards.map((card,colId)=>(
                <Card  onPress={handleCardPress} size={size} id={rowId+"*"+colId} show={card.show} uri={card.url} key={colId} cardId={card.id} check={card.check}/>
               ))
              }
            </View>
          ))):(
            <React.Fragment>
              {
                totalData.map((cards,rowId)=>(
                  <View key={rowId} style={styles.cardRow}> 
                    {
                     cards.map((card,colId)=>(
                      <Card  onPress={handleCardPress}  size={size} id={rowId+"*"+colId} show={card.show} uri={card.url} key={colId} cardId={card.id} check={true}/>
                     ))
                    }
                  </View>
                ))
              }
            </React.Fragment>
          )
          
        }
      </ScrollView>
      
    </View>
  );
};

const styles=StyleSheet.create({
  container:{
    flex:1,
    marginLeft:10,
    marginRight:10
  },  
  cardRow:{
    flex:1,
    flexDirection:"row",
    marginTop:5,
    justifyContent:"center"
  },
  textStyle:{
    fontSize:35,
    textAlign:"center",
    color:"#fd5631",
    fontWeight:"bold"
  },
  timeText:{
    fontSize:35,
    textAlign:"center",
    color:"#000000",
    fontWeight:"bold"
  },
  textContainer:{
    flexDirection:"row",
    justifyContent:"center",
    marginTop:40,
    marginBottom:30
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderColor:"#fd5631",
    margin:10,
    borderWidth:2,
    borderRadius:10
  },
  titleStyle:{
    color:"#fd5631"
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  modalText: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize:17,
    marginBottom:10
  },
  buttonContainer:{
    flexDirection: "row",
    margin: 10,
  },
  whiteOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: Dimensions.get("window").height / 6,
    bottom: 0,
    justifyContent: "center",
  },
})

export default PuzzleScreen;