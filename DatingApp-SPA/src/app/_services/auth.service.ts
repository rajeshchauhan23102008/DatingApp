import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../_models/user';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    // baseUrl = 'http://localhost:8000/api/auth/';
    baseUrl = environment.apiBaseUrl;

    helper = new JwtHelperService();
    decodedToken: any;
    currentUser: User;
    photoUrl = new BehaviorSubject<string>('../../assets/user.png');
    userCurrentPhotoUrl = this.photoUrl.asObservable();

    constructor(private http: HttpClient) { }

    login(model: any) {
        return this.http.post(this.baseUrl + 'login', model)
            .pipe(
                map((response: any) => {
                    const user = response;

                    if (user) {
                        localStorage.setItem('token', user.token);
                        localStorage.setItem('currentUser', JSON.stringify(user.currentUser));
                        this.decodedToken = this.helper.decodeToken(user.token);
                        this.currentUser = user.currentUser;
                        this.photoUrl.next(this.currentUser.photoUrl);
                    }

                }));
    }

    register(user: User) {
        return this.http.post(this.baseUrl + 'register', user);
    }

    loggedIn() {
        const token = localStorage.getItem('token');
        return !this.helper.isTokenExpired(token);
    }


}
