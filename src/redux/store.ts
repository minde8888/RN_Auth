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
        }).concat(storageMiddleware),
    ]
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch();
