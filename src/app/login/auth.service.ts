import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { catchError, map, take, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';
import { StorageService } from '../shared/storage.service';

interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  signUpUrl: string =
    'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyB4JvcWRDjyDCsJbfJGPhUvG7imYRazjbc';

  logInUrl: string =
    'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyB4JvcWRDjyDCsJbfJGPhUvG7imYRazjbc';

  userUrl =
    'https://join-17ed6-default-rtdb.europe-west1.firebasedatabase.app/user.json?auth=';

  isLoading = false;
  authenticatedUser = new BehaviorSubject<User | null>(null);
  token!: string;
  private tokenExpirationTimer: any;
  avatarColors: string[] = [
    '#FF5733',
    '#33FF57',
    '#3357FF',
    '#F0FF33',
    '#FF33A8',
    '#33FFF0',
    '#8D33FF',
  ];
  users: User[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private storageService: StorageService,
    private ngZone: NgZone
  ) {}
  

  signUp(email: string, password: string, name: string) {
    return this.http
      .post<AuthResponseData>(this.signUpUrl, {
        email,
        password,
        returnSecureToken: true,
      })
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          const avatarColor = this.getRandomAvatarColor();
          this.handleAuthentication(resData, name, avatarColor);
          this.createUser(name, email, password, resData.localId, avatarColor);
        })
      );
  }

  handleAuthentication(
    resData: AuthResponseData,
    name: string,
    avatarColor: string
  ) {
    const expirationDate = new Date(
      new Date().getTime() + +resData.expiresIn * 1000
    );
    const user = new User(
      resData.email,
      resData.localId,
      resData.idToken,
      expirationDate,
      name,
      avatarColor
    );
    this.authenticatedUser.next(user);
    this.autoLogOut(+resData.expiresIn * 1000);
    this.storageService.set('authUser', JSON.stringify(user));
    this.router.navigate(['/summary']);
  }

  getRandomAvatarColor() {
    const randomIndex = Math.floor(Math.random() * this.avatarColors.length);
    return this.avatarColors[randomIndex];
  }

  createUser(
    name: string,
    email: string,
    password: string,
    id: string,
    avatarColor: string
  ) {
    this.authenticatedUser.pipe(take(1)).subscribe((user) => {
      if (!user) {
        throw new Error('No authenticated user available.');
      }
      this.http
        .post<User>(this.userUrl + user.token, {
          name,
          email,
          password,
          id,
          avatarColor,
        })
        .subscribe({
          error: (error) => {
            console.error('Error creating user:', error);
          },
        });
    });
  }

  login(email: string, password: string): Observable<AuthResponseData> {
    return this.http.post<AuthResponseData>(this.logInUrl, {
      email,
      password,
      returnSecureToken: true,
    }).pipe(
      catchError(this.handleError),
      tap((resData) => {
        this.loadUsers(resData.idToken).subscribe({
          next: () => {
            const loggedInUser = this.users.find(
              (user) => user.email === resData.email
            );
            if (loggedInUser) {
              this.handleAuthentication(
                resData,
                loggedInUser.name,
                loggedInUser.avatarColor
              );
            } else {
              console.error('No user found');
            }
          },
          error: () => {},
        });
      })
    );
  }

  loadUsers(authToken: string | null) {
    return this.http.get<User[]>(this.userUrl + authToken).pipe(
      map((users) => {
        this.users = [];
        const userArray = Object.values(users);
        this.users.push(...userArray);
      })
    );
  }


  getUsers() {
    return this.users.slice();
  }

  autoLogin() {
    const userData = this.storageService.get('authUser');
    if (userData) {
      const user: {
        email: string;
        id: string;
        _token: string;
        _tokenExpirationDate: string;
        name: string;
        avatarColor: string;
      } = JSON.parse(userData);

      const loadedUser = new User(
        user.email,
        user.id,
        user._token,
        new Date(user._tokenExpirationDate),
        user.name,
        user.avatarColor
      );

      if (loadedUser.token) {
        this.authenticatedUser.next(loadedUser);
        const expirationDuration =
          new Date(user._tokenExpirationDate).getTime() - new Date().getTime();
        this.ngZone.runOutsideAngular(() => {
          this.autoLogOut(expirationDuration);
        });
      }
    } else {
      return;
    }
  }

  logOut() {
    this.authenticatedUser.next(null);
    this.router.navigate(['/login']);
    this.storageService.remove('authUser');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogOut(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.ngZone.run(() => {
        this.logOut();
      });
    }, expirationDuration);
  }

  private handleError(errorResponse: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorResponse.error || !errorResponse.error.error) {
      return throwError(() => new Error(errorMessage));
    }
    switch (errorResponse.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage =
          'The email address is already in use by another account.';
        break;
      case 'INVALID_LOGIN_CREDENTIALS':
        errorMessage = 'Password or E-mail are incorrect.';
        break;
    }
    return throwError(() => new Error(errorMessage));
  }
}
