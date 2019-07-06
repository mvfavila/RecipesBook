import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Actions, ofType, Effect } from "@ngrx/effects";
import { of } from "rxjs";
import { switchMap, catchError, map, tap } from "rxjs/operators";

import * as AuthActions from "./auth.actions";
import { environment } from "src/environments/environment";
import { User } from "../user.model";

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const handleAuthentication = (
  expiresIn: number,
  email: string,
  userId: string,
  token: string
) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem("userData", JSON.stringify(user));
  return new AuthActions.AuthenticateSuccess({
    email,
    userId,
    token,
    expirationDate
  });
};

const handleError = errorRes => {
  let errorMessage = "An unknown error occurred!";

  if (!errorRes.error || !errorRes.error.error) {
    return of(new AuthActions.AuthenticateFail(errorMessage));
  }

  switch (errorRes.error.error.message) {
    case "EMAIL_NOT_FOUND":
    case "INVALID_PASSWORD":
      errorMessage = "Incorrect e-mail and/or password.";
      break;
    case "USER_DISABLED":
      errorMessage = "The user account has been disabled by an administrator.";
      break;
    case "EMAIL_EXISTS":
      errorMessage = "This e-mail is already registered.";
      break;
    case "OPERATION_NOT_ALLOWED":
      errorMessage = "Password sign-in is disabled for this project.";
      break;
    case "TOO_MANY_ATTEMPTS_TRY_LATER":
      errorMessage =
        "We have blocked all requests from this device due to unusual activity. Try again later.";
      break;
  }

  return of(new AuthActions.AuthenticateFail(errorMessage));
};

@Injectable()
export class AuthEffects {
  private signupBaseUrl = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${
    environment.firebaseApiKey
  }`;
  private loginBaseUrl = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${
    environment.firebaseApiKey
  }`;
  private readonly returnSecureToken = true;

  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupAction: AuthActions.SignupStart) => {
      return this.http
        .post<AuthResponseData>(this.signupBaseUrl, {
          email: signupAction.payload.email,
          password: signupAction.payload.password,
          returnSecureToken: this.returnSecureToken
        })
        .pipe(
          map(resData => {
            return handleAuthentication(
              +resData.expiresIn,
              resData.email,
              resData.localId,
              resData.idToken
            );
          }),
          catchError(errorRes => {
            return handleError(errorRes);
          })
        );
    })
  );

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http
        .post<AuthResponseData>(this.loginBaseUrl, {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: this.returnSecureToken
        })
        .pipe(
          map(resData => {
            return handleAuthentication(
              +resData.expiresIn,
              resData.email,
              resData.localId,
              resData.idToken
            );
          }),
          catchError(errorRes => {
            return handleError(errorRes);
          })
        );
    })
  );

  @Effect({ dispatch: false })
  authRedirect = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS, AuthActions.LOGOUT),
    tap(() => {
      this.router.navigate(["/"]);
    })
  );

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const userData: {
        email: string;
        id: string;
        _token: string;
        _tokenExpirationDate: string;
      } = JSON.parse(localStorage.getItem("userData"));

      if (!userData) {
        return { type: "DUMMY" };
      }

      const loadedUser = new User(
        userData.email,
        userData.id,
        userData._token,
        new Date(userData._tokenExpirationDate)
      );

      if (loadedUser.token) {
        return new AuthActions.AuthenticateSuccess({
          email: loadedUser.email,
          userId: loadedUser.id,
          token: loadedUser.token,
          expirationDate: new Date(userData._tokenExpirationDate)
        });
        // const expirationDuration =
        //   new Date(userData._tokenExpirationDate).getTime() -
        //   new Date().getTime();
        // this.autoLogout(expirationDuration);
      }

      return { type: "DUMMY" };
    })
  );

  @Effect({ dispatch: false })
  autoLogout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      localStorage.removeItem("userData");
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router
  ) {}
}
