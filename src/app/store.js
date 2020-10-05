import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import userReducer from '../redux/reducers/userReducer';

export default configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer
  },
});
