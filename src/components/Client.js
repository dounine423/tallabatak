import React from "react";
import { StyleSheet, View, Text } from "react-native";
import {Avatar,Badge} from 'react-native-elements';

export default function Client({ lastMsg, userName, avatar, badge, ...props }) {
  return (
    <View style={styles.containerStyle}>
      <Avatar rounded source={{uri:avatar}} size={60}/>
      {badge!=0 ?(
        <Badge status="success" value={badge}/>
      ):null}
      <View style={styles.textContainerStyle}>
        <View style={styles.textContainer}>
          <Text style={styles.textStyle}>{userName}</Text>
          <Text style={styles.textStyle}>{lastMsg}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 2,
    flexDirection: "row",
    marginTop: 10,
  },
  textContainer: {
    flex: 1,
    flexDirection: "column",
    marginHorizontal: "5%",
    marginTop: "1%",
  },
  textStyle: {
    fontSize: 18,
    fontFamily: "Cairo-SemiBold",
    color: "#000000",
  },
  textContainerStyle: {
    flex: 2,
    flexDirection: "row",
    borderColor: "#fd5631",
    borderBottomWidth: 2,
    marginLeft: 5,
    marginRight: 5,
  },
});
