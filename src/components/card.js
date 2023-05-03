import { View, StyleSheet,Image,  Animated,Easing,Text} from "react-native";
import { useState } from "react";
import { Icon } from "react-native-elements";
import { useEffect } from "react";

const Card = ({size,uri,show,onPress,id,cardId,check,render}) => {
  const [itemClik,setItemClik]=useState(false)
  const Rotate=new Animated.Value(0)
  Animated.timing(
    Rotate,
    {
      toValue:1,
      duration:1200,
      easing:Easing.linear,
      useNativeDriver:true
    }
  ).start()
  const spin=Rotate.interpolate({
    inputRange:[0,1],
    outputRange:['180deg','360deg']
  }) 

  useEffect(()=>{
  },[])
  

  return (
    show?(
      check?(
          <Image source={{uri:uri}} style={[styles.imageStyle,{height:size,width:size}]}/>
        ):(
        <Animated.View style={{transform:[{rotateY:spin}]}}>
          <Image source={{uri:uri}} style={[styles.imageStyle,{height:size,width:size}]}/>
        </Animated.View> )
      
      ):(
          <View key={cardId} style={[styles.cardStyle,{height:size,width:size}]}>
            {/* <Text>{cardId}</Text> */}
            <Icon onPress={()=>onPress(id,cardId)} type="ionicon" name="image-outline" color="#ffffff" size={size-10}/>
          </View>
      )
      
  );
};

export default Card;

const styles = StyleSheet.create({
  cardStyle: {
    marginRight:2,
    marginLeft:2,
    borderRadius:10,
    borderColor:"#FAAB78",
    borderWidth:2,
    backgroundColor:"#FAAB78",
  },
  imageStyle:{
    marginRight:2,
    marginLeft:2,
    borderRadius:10,
    borderWidth:2,
    borderColor:"#fd5631"
  },
  card_front:{
    transform:[{rotateY:'180deg'}]
  }
});
