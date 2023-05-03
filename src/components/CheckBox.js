import { useEffect } from "react"
import { View,StyleSheet ,Text} from "react-native"
import {CheckBox} from '@rneui/themed'

const CheckBoxText=({checked,title,onPress})=>{
    useEffect(()=>{
    },[])
    return(
        <View style={styles.container}>
            <CheckBox size={30} checked={checked} onPress={onPress} title={title} checkedColor="#fd5631"/>
        </View>
    )
}

const styles=StyleSheet.create({
    container:{
        flexDirection:"row",
        width:'100%'
    },
});

export default CheckBoxText;