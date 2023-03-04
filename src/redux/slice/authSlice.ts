import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
    isLoggedIn?: boolean;
    error?: string | null;
    token: string;
    refreshToken: string;
}

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false
    } as AuthState,
    reducers: {
        registerFail: (state, action: PayloadAction<string>) => {
            return {
                ...state,
                isLoggedIn: false,
                error: action.payload
            };
        },
        loginSuccess: (state, { payload }: PayloadAction<AuthState>) => {
            return {
                ...state,
                isLoggedIn: true,
                token: payload.token,
                refreshToken: payload.refreshToken
            };
        },
        loginFail: (state, action: PayloadAction<string>) => {
            return {
                ...state,
                isLoggedIn: false,
                error: action.payload
            };
        },
        userLogout: (state) => {
            return {
                ...state,
                isLoggedIn: false,
                token: '',
                refreshToken: ''
            };
        },
        changeRefreshToken: (state, { payload }: PayloadAction<AuthState>) => {
            return {
                ...state,
                token: payload.token,
                refreshToken: payload.refreshToken
            };
        }
    }
});

export const { loginSuccess, loginFail, userLogout, changeRefreshToken, registerFail } = authSlice.actions;

export default authSlice.reducer;
