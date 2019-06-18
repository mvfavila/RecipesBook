import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";

interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private API_KEY = "AIzaSyCY3Xn4FIlR0Pn2pufF14nktxhErT4uJdA";
  private baseUrl = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${
    this.API_KEY
  }`;

  constructor(private http: HttpClient) {}

  signup(email: string, password: string) {
    const returnSecureToken = true;
    return this.http
      .post<AuthResponseData>(this.baseUrl, {
        email,
        password,
        returnSecureToken
      })
      .pipe(
        catchError(errorRes => {
          console.log(errorRes);
          let errorMessage = "An unknown error occurred!";

          if (!errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage);
          }

          switch (errorRes.error.error.message) {
            case "EMAIL_EXISTS":
              errorMessage = "This e-mail is already registered!";
          }

          return throwError(errorMessage);
        })
      );
  }
}
