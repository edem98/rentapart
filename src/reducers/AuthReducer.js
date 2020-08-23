const initialState = {
  user: {
    token: null,
  },
  userType: "",
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_USER_TYPE":
      return {
        ...state,
        userType: action.payload.userType,
      };
    case "SIGN_IN":
      return {
        ...state,
        user: {
          ...state.user,
          email: action.payload.email,
          id: action.payload.id,
          userId: action.payload.userId,
          firstname: action.payload.firstname,
          lastname: action.payload.lastname,
          profile_pic: action.payload.profile_pic,
          phone: action.payload.phone,
          token: action.payload.token,
          password: action.payload.password,
        },
      };
    case "SIGN_UP":
      return {
        ...state,
        user: {
          ...state.user,
          firstname: action.payload.firstname,
          lastname: action.payload.lastname,
          phone: action.payload.phone,
          token: action.payload.token,
          email: action.payload.email,
          profile_pic: action.payload.profile_pic,
          password: action.payload.password,
        },
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: {
          ...state.user,
          firstname: action.payload.firstname,
          lastname: action.payload.lastname,
          phone: action.payload.phone,
          email: action.payload.email,
          profile_pic: action.payload.profile_pic,
        },
      };

    case "SIGNOUT":
      return {
        ...state,
        user: action.payload.user,
        userType: "",
      };
    default:
      return state;
  }
}
