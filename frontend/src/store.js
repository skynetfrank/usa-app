import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { clientesApi } from "./api/clientesApi";
import splashReducer from "./slices/splashSlice";


import {
  userDetailsReducer,
  userListReducer,
  userRegisterReducer,
  userSigninReducer,
  userUpdateProfileReducer,
  userUpdateReducer,
} from "./reducers/userReducers";


import {
  clienteDetailsReducer,
  clienteListReducer,
  clienteRegisterReducer,
  clienteUpdateProfileReducer,
} from "./reducers/clienteReducers";


import { usersApi } from "./api/usersApi";


const preloadedState = {
  userSignin: {
    userInfo: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null,
  },


};

// Automatically adds the thunk middleware and the Redux DevTools extension
const store = configureStore({
  // Automatically calls `combineReducers`
  reducer: {
    splash: splashReducer,
    userSignin: userSigninReducer,
    userRegister: userRegisterReducer,
    userDetails: userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer,
    userUpdate: userUpdateReducer,
    userList: userListReducer,
    clienteDetails: clienteDetailsReducer,
    clienteUpdateProfile: clienteUpdateProfileReducer,
    clienteList: clienteListReducer,
    clienteRegister: clienteRegisterReducer,
    [clientesApi.reducerPath]: clientesApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(clientesApi.middleware, usersApi.middleware,),
  preloadedState,
});
setupListeners(store.dispatch);
export default store;
