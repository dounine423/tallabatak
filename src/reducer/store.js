import { applyMiddleware, createStore } from "redux";
// import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import thunk from "redux-thunk";

const middleware = [thunk];

const configureStore = () => {
  return createStore(rootReducer, applyMiddleware(thunk));
};

export default configureStore;

// export const persistor = persistStore(store);

// export const store = configureStore({ reducer: rootReducer });
