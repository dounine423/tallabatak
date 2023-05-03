import { useEffect } from "react";
import { View ,TouchableOpacity ,StyleSheet} from "react-native";
import {Text,Avatar} from  '@rneui/themed';
import { BASE_URL } from "../reducer/actionType";

const User=({avatar,name,email,dist,onPress})=>{
    useEffect(()=>{},[])

    return(
        <View>
            <TouchableOpacity onPress={onPress}>
                <View style={styles.container}>
                    <View style={styles.leftContainer}>
                        <Avatar rounded size={40} source={{uri:BASE_URL+avatar}}/>
                        <View style={styles.textContainer}>
                            <Text style={styles.nameText}>{name}</Text>
                            <Text style={styles.emailText}>{email}</Text>
                        </View>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.nameText}>{dist}km</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles=StyleSheet.create({
    container:{
        flexDirection:"row",
        borderBottomColor:"#fd5631",
        borderBottomWidth:2,
        marginRight:10,
        marginLeft:10,
        marginTop:10,
        padding:5,
        justifyContent:"space-between"
    },
    image:{
        width: 60,
        height: 60,
        borderRadius: 70,
        borderColor: "#fd5631",
        borderWidth: 2,
    },
    textContainer:{
        marginLeft:15
    },
    nameText:{
        fontSize:17
    },
    emailText:{
        fontSize:15
    },
    leftContainer:{
        flexDirection:"row"
    }
})

export default User;