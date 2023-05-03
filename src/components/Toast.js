import {ToastAndroid,Platform} from 'react-native'

 const ToastMsg=(msg)=>{
    ToastAndroid.show(msg,ToastAndroid.SHORT);

}

export default ToastMsg