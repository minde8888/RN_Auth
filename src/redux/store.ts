import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import rootReducer from './reducers';
import { AuthState } from './slice/authSlice';

type ImmutableCheck = { warnAfter: number };
type GetDefaultMiddlewareFn = (arg0: { immutableCheck: ImmutableCheck }) => any;

interface Action {
  type: string;
  payload: AuthState;
}

const storageMiddleware = ({ getState }: any) => {
  return (next: (arg0: any) => any) => (action: Action) => {
    const result = next(action);
    return result;
  };
};

const errorMiddleware = () => {
  return (next: (arg0: any) => any) => (action: Action) => {
    try {
      return next(action);
    } catch (error: any) {
      console.error('Error:', error);
      if (action.type === 'auth/login') {
        console.log('Login error:', error);
      } else {
        console.log('Other error:', error);
      }
      throw error;
    }
  };
};

const reHydrateStore = () => {
  return {}
};

export const store = configureStore({
  reducer: {
    data: rootReducer
  },
  preloadedState: reHydrateStore(),
  middleware: (getDefaultMiddleware: GetDefaultMiddlewareFn) => [
    ...getDefaultMiddleware({
      immutableCheck: { warnAfter: 200 }
    }).concat(storageMiddleware, errorMiddleware),
  ]
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch();
