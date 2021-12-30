import createDataContext from "./createDataContext";
import trackerApi from '../api/tracker';
import { navigate } from "../navigationRef";
import AsyncStorage from '@react-native-async-storage/async-storage';


const authReducer = (state, action) => {
  switch (action.type) {
      case 'add_error':
          return {...state, errorMessage: action.payload}
      case 'signup':
          return { errorMessage: '', token: action.payload}
    default:
      return state;
  }
};

const signup = (dispatch) => async ({ email, password }) => {
    try{
      const response = await trackerApi.post('/signup', { email, password } )
      await AsyncStorage.setItem('token', response.data.token);

      dispatch({type: 'signup', payload: response.data.token});

      //navigate to a flow
      navigate('TrackList');

    } catch (error) {
        dispatch({ type: 'add_error', payload: 'Something went wrong during signup' });
    };
  };

const signin = (dispatch) => {
  return ({ email, password }) => {
    //try to sign in
    //handle success by updating state
    //handle failure by showing error message (somehow)
  };
};

const signout = (dispatch) => {
  return () => {
    //somehow sign out!!
  };
};

export const { Provider, Context } = createDataContext(
  authReducer,
  { signin, signup, signout },
  { token: null, errorMessage: '' }
)
