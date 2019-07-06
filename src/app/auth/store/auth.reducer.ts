import { Action, createReducer, on } from "@ngrx/store";
import { User } from "../user.model";
import * as AuthActions from "./auth.actions";

export interface State {
  user: User;
  authError: string;
  isLoading: boolean;
}
const initialState: State = { user: null, authError: null, isLoading: false };

export function authReducer(authState: State | undefined, authAction: Action) {
  return createReducer(
    initialState,
    on(AuthActions.loginStart, AuthActions.signupStart, state => ({
      ...state,
      authError: null,
      isLoading: true
    })),
    on(AuthActions.authenticateSuccess, (state, action) => ({
      ...state,
      authError: null,
      isLoading: false,
      user: new User(
        action.email,
        action.userId,
        action.token,
        action.expirationDate
      )
    })),
    on(AuthActions.authenticateFail, (state, action) => ({
      ...state,
      user: null,
      authError: action.errorMessage,
      isLoading: false
    })),
    on(AuthActions.logout, state => ({ ...state, user: null })),
    on(AuthActions.clearError, state => ({ ...state, authError: null }))
  )(authState, authAction);
}
