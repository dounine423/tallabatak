import React from "react";
import { Provider } from "react-redux";
import TabNavigator from "./TabNavigator";
import configureStore from "./src/reducer/store";



const store = configureStore();

class App extends React.Component {

  render() {
    return(
      <Provider store={store}>
        <TabNavigator/>
      </Provider>
    );
  }
}

export default App;
