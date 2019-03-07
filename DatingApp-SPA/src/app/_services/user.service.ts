import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../_models/user';

// const httpOptions = {
//     headers: new HttpHeaders({
//         'Authorization': 'Bearer ' + localStorage.getItem('token')
//     })
// };

@Injectable({
    providedIn: 'root'
})
export class UserService {

    baseUrl: string = environment.apiBaseUrl;

    constructor(private http: HttpClient) { }

    getUsers(): Observable<User[]> {
        //return this.http.get<User[]>(this.baseUrl + 'users', httpOptions);
        return this.http.get<User[]>(this.baseUrl + 'users');
    }

    getUser(id: number): Observable<User> {
        //return this.http.get<User>(this.baseUrl + 'users/' + id, httpOptions);
        return this.http.get<User>(this.baseUrl + 'users/' + id);
    }

    updateUser(id: number, user: User) {
        return this.http.put(this.baseUrl + 'users/' + id, user);
    }

    setUserMainPhoto(userid: number, photoid: number) { 
        return this.http.post(this.baseUrl + 'users/' + userid + '/photos/' + photoid + '/setMain', { });
    }
}
