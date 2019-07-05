import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Actions, ofType, Effect } from "@ngrx/effects";
import { of } from "rxjs";
import { switchMap, catchError, map, tap } from "rxjs/operators";

import * as AuthActions from "./auth.actions";
import { environment } from "src/environments/environment";

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable()
export class AuthEffects {
  private loginBaseUrl = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${
    environment.firebaseApiKey
  }`;
  private readonly returnSecureToken = true;

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
            const expirationDate = new Date(
              new Date().getTime() + +resData.expiresIn * 1000
            );
            return new AuthActions.LoginSuccess({
              email: resData.email,
              userId: resData.localId,
              token: resData.idToken,
              expirationDate
            });
          }),
          catchError(errorRes => {
            let errorMessage = "An unknown error occurred!";

            if (!errorRes.error || !errorRes.error.error) {
              return of(new AuthActions.LoginFail(errorMessage));
            }

            switch (errorRes.error.error.message) {
              case "EMAIL_NOT_FOUND":
              case "INVALID_PASSWORD":
                errorMessage = "Incorrect e-mail and/or password.";
                break;
              case "USER_DISABLED":
                errorMessage =
                  "The user account has been disabled by an administrator.";
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

            return of(new AuthActions.LoginFail(errorMessage));
          })
        );
    })
  );

  @Effect({ dispatch: false })
  authSuccess = this.actions$.pipe(
    ofType(AuthActions.LOGIN_SUCCESS),
    tap(() => {
      this.router.navigate(["/"]);
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router
  ) {}
}
