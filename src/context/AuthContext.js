import createDataContext from "./createDataContext";
import trackerApi from '../api/tracker';
import { navigate } from "../navigationRef";
import AsyncStorage from '@react-native-async-storage/async-storage';


const authReducer = (state, action) => {
  switch (action.type) {
      case 'add_error':
          return {...state, errorMessage: action.payload}
      case 'signin':
          return { errorMessage: '', token: action.payload }
      case 'clear_error_message':
          return { ...state, errorMessage: '' }      
    default:
      return state;
  }
};

const clearErrorMessage = (dispatch) => () => {
    dispatch({ type: 'clear_error_message' })
}

const signup = (dispatch) => async ({ email, password }) => {
    try{
      const response = await trackerApi.post('/signup', { email, password } )
      await AsyncStorage.setItem('token', response.data.token);

      dispatch({type: 'signin', payload: response.data.token});

      //navigate to a flow
      navigate('TrackList');

    } catch (error) {
        dispatch({ type: 'add_error', payload: 'Something went wrong during sign up' });
    };
  };

const signin = (dispatch) => async({ email, password }) => {
      try {
          const response = await trackerApi.post('/signin', { email, password });
          await AsyncStorage.setItem('token', response.data.token);

          dispatch({type: 'signin', payload: response.data.token})

          navigate('TrackList')

      }catch(err){
        dispatch({type: 'add_error', payload: 'Something went wrong during sign in'})
      }
};

const signout = (dispatch) => {
  return () => {
    //somehow sign out!!
  };
};

export const { Provider, Context } = createDataContext(
  authReducer,
  { signin, signup, signout, clearErrorMessage },
  { token: null, errorMessage: '' }
)
