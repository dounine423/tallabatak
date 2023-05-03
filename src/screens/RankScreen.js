import { useEffect } from "react";
import { useSelector } from "react-redux";
import { View,StyleSheet,ScrollView } from "react-native";
import {Text,Icon,Badge,Avatar}from 'react-native-elements'
import { BASE_URL } from "../reducer/actionType";

const RankScreen=(props)=>{

    const {userData,notificationBadge}=useSelector((state)=>state.auth);
    const {noti_id,score}=props.route.params;
    useEffect(()=>{
        console.log(score);
        return ()=>onchatNotificationClick();
    },[])

    const onchatNotificationClick=()=>{
        props.navigation.navigate('notification')
    }

    return(
        <View style={styles.background}>
             <View style={styles.header}>
                {/* <Icon onPress={this.onBackHandler} style={styles.backIcon} size={30} type="ionicon" name="arrow-undo-outline" color="#fd5631"/> */}
                <Text   style={styles.headerText} >  Ranking  </Text>
                <Icon
                    name="notifications"
                    color="#fd5631"
                    size={45}
                    iconStyle={styles.iconStyle}
                    onPress={onchatNotificationClick}
                />
                {notificationBadge != 0 ? (
                    <Badge status="success" value={notificationBadge}  containerStyle={{position:"absolute",top:-4,right:70}}/>
                ) : null}
                <Avatar rounded source={{uri:BASE_URL+userData.image}} size={50}/>
            </View>
            <ScrollView style={{padding:10}}>
                <View style={styles.textContainer}>
                    <Text style={styles.tableHeader}>Rank</Text>
                    <Text style={styles.tableHeader}>Name</Text>
                    <Text style={styles.tableHeader}>Score</Text>
                </View>
                    {
                        score.map((item,id)=>(
                            <View key={id} style={[styles.textContainer,item.id==noti_id?styles.myScore:null]}>
                                <Text style={[styles.tableBody,id<3?styles.hightLight:null]}>{id+1}</Text>
                                <Text style={[styles.tableBody,id<3?styles.hightLight:null]}>{item.name}</Text>
                                <Text style={[styles.tableBody,,id<3?styles.hightLight:null]}>{ Math.floor(item.puzzle_score/60)<1?null:(Math.floor(item.puzzle_score/60))+"m" } {item.puzzle_score%60}s</Text>
                            </View>
                        ))
                    }
            </ScrollView>
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
    header:{
        flexDirection: "row",
        marginTop: 40,
        justifyContent: "flex-end",
    },
    headerText:{
        textAlign: "auto",
        fontSize: 30,
        marginTop: 5,
        fontWeight: "bold",
    },
    iconStyle: {
      width: 50,
      height: 50,
      borderRadius: 50,
      marginLeft: 15,
      marginRight: 10,
      marginTop: 5,
    },
    textContainer:{
        flexDirection:"row",
        justifyContent:"space-between",
        marginTop:15
    },
    tableHeader:{
        fontSize:25,
        fontWeight:"400"
    },
    tableBody:{
        fontSize:20
    },
    hightLight:{
        color:"#fd5631"
    },
    myScore:{
        borderColor:"#fd5631",
        borderWidth:2,
        borderRadius:10,
        padding:5
    }
  });
  

  export default RankScreen