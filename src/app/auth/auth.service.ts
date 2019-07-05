import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { catchError, tap } from "rxjs/operators";
import { throwError, BehaviorSubject, from } from "rxjs";
import { Store } from "@ngrx/store";

import { environment } from "src/environments/environment";
import { User } from "./user.model";
import * as fromApp from "../store/app.reducer";
import * as AuthActions from "./store/auth.actions";

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: "root"
})
export class AuthService {
  // user = new BehaviorSubject<User>(null);

  private tokenExpirationTimer: any;
  private readonly returnSecureToken = true;
  private signupBaseUrl = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${
    environment.firebaseApiKey
  }`;
  private loginBaseUrl = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${
    environment.firebaseApiKey
  }`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(this.signupBaseUrl, {
        email,
        password,
        returnSecureToken: this.returnSecureToken
      })
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(this.loginBaseUrl, {
        email,
        password,
        returnSecureToken: this.returnSecureToken
      })
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  logout() {
    this.store.dispatch(new AuthActions.Logout());
    localStorage.removeItem("userData");
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
    this.router.navigate(["/auth"]);
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem("userData"));

    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.store.dispatch(
        new AuthActions.Login({
          email: loadedUser.email,
          userId: loadedUser.id,
          token: loadedUser.token,
          expirationDate: new Date(userData._tokenExpirationDate)
        })
      );
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleError(errorRes: HttpErrorResponse) {
    console.log(errorRes);
    let errorMessage = "An unknown error occurred!";

    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
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

    return throwError(errorMessage);
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.store.dispatch(
      new AuthActions.Login({ email, userId, token, expirationDate })
    );
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem("userData", JSON.stringify(user));
  }
}
