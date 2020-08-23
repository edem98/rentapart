import {
  SIGN_IN,
  SIGN_UP,
  SET_USER_TYPE,
  UPDATE_USER,
  SIGNOUT,
  CHANGE_PASSWORD,
} from "./type";

const signIn = (credentials) => {
  return {
    type: SIGN_IN,
    payload: credentials,
  };
};

const signUp = (credentials) => {
  return {
    type: SIGN_UP,
    payload: credentials,
  };
};

const setUserType = (userType) => {
  return {
    type: SET_USER_TYPE,
    payload: userType,
  };
};

const updateUser = (user) => {
  return {
    type: UPDATE_USER,
    payload: user,
  };
};

const signOut = () => {
  return {
    type: SIGNOUT,
    payload: { user: {}, userType: "" },
  };
};

const changePassword = (password) => {
  return {
    type: CHANGE_PASSWORD,
    payload: password,
  };
};

export { signIn, signUp, setUserType, updateUser, signOut, changePassword };
