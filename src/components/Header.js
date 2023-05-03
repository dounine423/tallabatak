import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";

export default function Header() {
  return (
    <View
      style={{
        flexDirection: "row",
        marginTop: 40,
        justifyContent: "flex-end",
      }}
    >
      <Text
        style={{
          textAlign: "auto",
          fontSize: 30,
          marginTop: 5,
          fontWeight: "bold",
        }}
      >
        Peoples
      </Text>
      <TouchableOpacity
        underlayColor="#fff"
        onPress={this.onchatNotificationClick}
      >
        <View>
          <Icon
            name="notifications"
            color="#fd5631"
            size={45}
            iconStyle={styles.iconStyle}
          />
          <View
            style={{
              position: "absolute",
              backgroundColor: "#fd5631",
              width: 25,
              height: 25,
              left: 41,
              top: -5,
              borderRadius: 100,
              borderColor: "#46CF76",
              borderWidth: 1,
            }}
          >
            <Text style={{ fontSize: 17, marginLeft: 6, fontWeight: "bold" }}>
              3
            </Text>
          </View>
        </View>
        {
          
        }
      </TouchableOpacity>
      <TouchableOpacity onPress={this.onAvatarClick}>
        <Image style={styles.imageStyle} source={avatar1} />
      </TouchableOpacity>
      
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
    backgroundColor: theme.colors.surface,
  },
  imageStyle: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginLeft: 15,
    marginRight: 10,
    borderColor: "#fd5631",
    marginLeft: 15,
    padding: 7,
  },
  iconStyle: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginLeft: 15,
    marginRight: 10,
    marginTop: 5,
  },
  scrollStyle: {
    paddingHorizontal: "7%",
    marginBottom: "18%",
    paddingBottom: "1.5%",
  },
  searchStyle: {
    margin: 10,
    borderRadius: 10,
  },
});
