import React from "react";
import { Provider } from "react-redux";
import PlacesNavigator from "./navigation/PlacesNavigator";
import { combineReducers, applyMiddleware, createStore } from "redux";
import ReduxThunk from "redux-thunk";
import placesReducer from "./store/places-reducer";
import { init } from "./helpers/db";

init()
  .then(() => {
    console.log("Database initialized");
  })
  .catch((err) => {
    console.log("Database initialized Failed");
    console.log(err);
  });

const rootReducer = combineReducers({
  places: placesReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

const App = (props) => {
  return (
    <Provider store={store}>
      <PlacesNavigator />
    </Provider>
  );
};

export default App;
