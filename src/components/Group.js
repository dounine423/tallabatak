import React from "react";
import { View, Image, StyleSheet, Text } from "react-native";
import { Avatar } from "react-native-elements";

export default function Group({ avatar, groupName, lastMsg }) {
  return (
    <View style={styles.groupContainer}>
      <Avatar rounded source={{uri:avatar}} size={60}/>
      <View style={styles.textContainer}>
        <View>
          <Text style={styles.textStyle}>{groupName}</Text>
          <Text style={styles.countStyle}>{lastMsg}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  groupContainer: {
    margin: 5,
    flex: 1,
    flexDirection: "row",
    marginTop: 10,
    height: 60,
  },
  imageStyle: {
    width: 60,
    height: 60,
    borderRadius: 70,
    borderColor: "#fd5631",
    borderWidth: 2,
  },
  textStyle: {
    marginLeft: 10,
    marginTop: 4,
    fontSize: 17,
    fontFamily: "Cairo-SemiBold",
    color: "#000000",
  },
  countStyle: {
    fontSize: 14,
    fontFamily: "Cairo-SemiBold",
    color: "grey",
    marginLeft: 10,
  },
  textContainer: {
    flex: 2,
    flexDirection: "row",
    borderColor: "#fd5631",
    borderBottomWidth: 2,
    marginLeft: 5,
    marginRight: 5,
  },
});
