import AVA from "./avatar.png";

export const initialState = {
  user: null,
  email: null,
  img: AVA,
  name: "",
  footer: true,
  posts: [],
  dark: true,
  profri: [],
};

const reducer = (state, action) => {
  console.log(action);
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.user,
      };

    case "SET_EMAIL":
      return {
        ...state,
        email: action.email,
      };

    case "SET_IMG":
      return {
        ...state,
        img: action.img,
      };

    case "SET_NAME":
      return {
        ...state,
        name: action.name,
      };

    case "SET_BIO":
      return {
        ...state,
        bio: action.bio,
      };

    case "FOOTER":
      return {
        ...state,
        footer: action.footer,
      };

    case "POSTS":
      return {
        ...state,
        posts: action.posts,
      };

    case "DARK":
      return {
        ...state,
        dark: action.dark,
      };

    case "PROFRI":
      return {
        ...state,
        profri: action.profri,
      };

    default:
      return state;
  }
};

export default reducer;
