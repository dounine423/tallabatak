import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { connect } from "react-redux";
import { TextInput } from "react-native-paper";
import Background from "../components/Background";
import Logo from "../components/Logo";
import Button from "../components/Button";
import Header from "../components/LoginHeader";
import { theme } from "../components/theme";
import { emailValidator } from "../helpers/emailValidator";
import { passwordValidator } from "../helpers/passwordValidator";
import { login,getOneTimeLocation } from "../reducer/action";
import getFCMToekn from '../helpers/GetFCMToken'


class LoginScreen extends React.Component {
  static navigationOptions = {
    title: "LoginScreen",
    headerStyle: {
      backgroundColor: "#f4511e",
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold",
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      text: "",
      currentLongitude: "",
      currentLatitude: "",
      isLoading:false,
      device_id:null,
    };
  }

  componentDidMount = () => {
   
    getFCMToekn().then((data)=>{
      this.setState({device_id:data})
    })
    this.props.getOneTimeLocation();
  };

  changeEmailHandler = (text) => {
    this.setState({
      email: text,
    });
  };

  changePasswordHandler = (text) => {
    this.setState({
      password: text,
    });
  };

  onLoginBtnClick = () => {
    const { email, password ,device_id} = this.state;
    const { currentLatitude, currentLongitude } = this.props.location;
    const emailError = emailValidator(email);
    const passwordError = passwordValidator(password);
    this.setState({isLoading:true});
    
    if (emailError || passwordError) {
      this.setState({
        emailError,
        passwordError,
        isLoading:false
      });
      return;
    }
    let req = {
      email1: email,
      password1: password,
      lat: currentLatitude,
      lng: currentLongitude,
      device_id:device_id
    };
    console.log(req)
    this.props.login(req).then(() => {
      this.setState({
        email: "",
        password: "",
        emailError: "",
      });
      const { isLoggedIn } = this.props;
      if (isLoggedIn) {
        this.setState({isLoading:false})
        this.props.navigation.navigate("peoples",{device_id});
      } else {
        this.setState({ 
          emailError: "Invalid Login",
          isLoading:false
         });
        return;
      }
    });
  };
  render() {
    const { email, password, emailError, passwordError,isLoading } = this.state;
    return (
      <Background>
        <Logo />
        <Header>Welcome Tallabatak</Header>
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            label="Email"
            selectionColor="#fd5631"
            underlineColor="transparent"
            mode="outlined"
            returnKeyType="next"
            value={email}
            placeholder="Email"
            onChangeText={this.changeEmailHandler}
            autoCapitalize="none"
            autoCompleteType="email"
            textContentType="emailAddress"
            keyboardType="email-address"
          />
          {emailError ? <Text style={styles.error}>{emailError}</Text> : null}
        </View>
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            selectionColor="#fd5631"
            underlineColor="transparent"
            mode="outlined"
            label="Password"
            returnKeyType="done"
            value={password}
            onChangeText={this.changePasswordHandler}
            secureTextEntry
          />
          {passwordError ? (
            <Text style={styles.error}>{passwordError}</Text>
          ) : null}
        </View>
        <Button mode="contained" onPress={this.onLoginBtnClick}>
          Login
        </Button>
        {isLoading ? (
          <ActivityIndicator size={100} style={styles.whiteOverlay} />
        ) : null}
      </Background>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoggedIn: state.auth.isLoggedIn,
  isLoading: state.auth.isLoading,
  error: state.auth.error,
  location:state.location.location
});

const mapDispatchToProps = (dispatch) => ({
  login: (data) => dispatch(login(data)),
  getOneTimeLocation: () => dispatch(getOneTimeLocation()),
});

const styles = StyleSheet.create({
  loginWrapper: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  mainTitle: {
    fontSize: 20,
    paddingTop: 60,
    paddingBottom: 15,
  },
  secondaryTitle: {
    fontSize: 16,
    paddingBottom: 20,
  },
  textInput: {
    height: 50,
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 15,
    paddingBottom: 15,
    borderColor: "transparent",
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 1,
    borderWidth: 1,
    marginTop: 20,
  },
  inputButton: {
    width: "90%",
    display: "flex",
    flexDirection: "row",
    height: 50,
    justifyContent: "center",
    borderRadius: 10,
    alignSelf: "center",
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 15,
    paddingBottom: 15,
    marginTop: 40,
    backgroundColor: "#61dbfc",
    elevation: 1,
  },
  container: {
    width: "100%",
    marginVertical: 12,
  },
  input: {
    backgroundColor: theme.colors.surface,
  },
  description: {
    fontSize: 13,
    color: theme.colors.secondary,
    paddingTop: 8,
  },
  error: {
    fontSize: 13,
    color: theme.colors.error,
    paddingTop: 8,
  },
  whiteOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: Dimensions.get("window").height / 6,
    bottom: 0,
    justifyContent: "center",
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
