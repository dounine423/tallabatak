import { useState,useEffect } from "react";
import { View ,Text} from "react-native";
import {CheckBox} from '@rneui/themed';

const RadioGroup=()=>{
    const [type,setType]=useState('')
    return(
        <View >
            <CheckBox
                checked={type === 'chat'}
                onPress={() => setType('chat')}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
            />
            <CheckBox
                checked={type === 'group'}
                onPress={() => setType('group')}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
            />
            <CheckBox
                checked={type === 'post'}
                onPress={() => setType('post')}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
            />
            <CheckBox
                checked={type === 'other'}
                onPress={() => setType('other')}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
            />
        </View>
    )
}

export default RadioGroup;