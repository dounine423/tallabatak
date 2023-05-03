import  messaging from '@react-native-firebase/messaging';

messaging().setBackgroundMessageHandler(async remoteMsg=>{
    console.log("background",remoteMsg.notification.title);
    console.log("background",remoteMsg.notification.body);
});

messaging().onMessage(async remoteMsg=>{
    console.log("foreground",remoteMsg.notification.title);
    console.log("foreground",remoteMsg.notification.body);
})

const getFCMToekn=async()=>{ 
    try{
        const newFCMToken=await messaging().getToken();
        console.log(newFCMToken);
        return newFCMToken;
    }catch(err){
        console.log(err);
        return null;
    }
}

export default getFCMToekn;