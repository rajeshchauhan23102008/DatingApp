import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../_models/user';
import { PaginatedResult } from '../_models/pagination';
import { map } from 'rxjs/operators';
import { Message } from '../_models/message';

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

    getUsers(pageNumber?: number, pageSize?: number, userParams?: any, likeParams?: string): Observable<PaginatedResult<User[]>> {
        //return this.http.get<User[]>(this.baseUrl + 'users', httpOptions);

        let httpParams: HttpParams = this.setupHttpParamsForUsers(pageNumber, pageSize, userParams, likeParams);

        return this.http.get<User[]>(this.baseUrl + 'users', {
            params: httpParams,
            observe: 'response'
        }).pipe(map((response) => {
            const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();

            paginatedResult.result = response.body;

            if (response.headers.get('Pagination') != null) {
                paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
            }

            // console.log(paginatedResult);

            return paginatedResult;

        }));
    }

    private setupHttpParamsForUsers(pageNumber: number, pageSize: number, userParams: any, likeParams: string) {
        let httpParams: HttpParams = new HttpParams();
        if (pageNumber) {
            httpParams = httpParams.append('pageNumber', pageNumber.toString());
        }
        if (pageSize) {
            httpParams = httpParams.append('pageSize', pageSize.toString());
        }

        if (userParams) {

            if (userParams.minAge) {
                httpParams = httpParams.append('minAge', userParams.minAge.toString());
            }
            if (userParams.maxAge) {
                httpParams = httpParams.append('maxAge', userParams.maxAge.toString());
            }
            if (userParams.gender) {
                httpParams = httpParams.append('gender', userParams.gender);
            }

            if (userParams.orderBy) {
                httpParams = httpParams.append('orderBy', userParams.orderBy);
            }
        }

        if (likeParams) {
            if (likeParams === 'likers') {
                httpParams = httpParams.append('likers', 'true');
            }

            if (likeParams === 'likees') {
                httpParams = httpParams.append('likees', 'true');
            }
        }

        return httpParams;
    }

    getUser(id: number): Observable<User> {
        //return this.http.get<User>(this.baseUrl + 'users/' + id, httpOptions);
        return this.http.get<User>(this.baseUrl + 'users/' + id);
    }

    updateUser(id: number, user: User) {
        return this.http.put(this.baseUrl + 'users/' + id, user);
    }

    setUserMainPhoto(userid: number, photoid: number) {
        return this.http.post(this.baseUrl + 'users/' + userid + '/photos/' + photoid + '/setMain', {});
    }

    deleteUserPhoto(userid: number, photoid: number) {
        return this.http.delete(this.baseUrl + 'users/' + userid + '/photos/' + photoid);
    }

    sendLike(id: number, recipientid: number) {
        return this.http.post(`${this.baseUrl}users/${id}/like/${recipientid}`, {});
    }
    getMessages(id: number, pageNumber?: number, pageSize?: number, messageType?: string): Observable<PaginatedResult<Message[]>> {

        // Setup HTTP Params.
        const httpParams: HttpParams = this.setupHttpParamsForGetMessages(pageNumber, pageSize, messageType);

        return this.http.get<Message[]>(`${this.baseUrl}users/${id}/messages`
            , { params: httpParams, observe: 'response' }).pipe(
                map(
                    res => {

                        const paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<Message[]>();
                        paginatedResult.result = res.body;

                        if (res.headers.get('Pagination'))
                            paginatedResult.pagination = JSON.parse(res.headers.get('Pagination'));

                        return paginatedResult;
                    }
                )
            );
    }

    private setupHttpParamsForGetMessages(pageNumber: number, pageSize: number, messageType: string) {
        let httpParams: HttpParams = new HttpParams();
        if (pageNumber)
            httpParams = httpParams.append('pagenumber', pageNumber.toString());
        if (pageSize)
            httpParams = httpParams.append('pagesize', pageSize.toString());
        if (messageType)
            httpParams = httpParams.append('messagetype', messageType);
        return httpParams;
    }

    getUserMessageThread(id: number, recipientid: number): Observable<Message[]> {

        return this.http.get<Message[]>(`${this.baseUrl}users/${id}/messages/thread/${recipientid}`);
    }

    sendMessage(id: number, recipientid: number, content: string) {
        return this.http.post(`${this.baseUrl}users/${id}/messages`, { recipientid: recipientid, content: content });
    }

    deleteMessage(id: number, messageId: number) {
        return this.http.delete(`${this.baseUrl}users/${id}/messages/${messageId}`);
    }

    readMessage(id: number, messageId: number) {
        return this.http.post(`${this.baseUrl}users/${id}/messages/${messageId}/read`, {});
    }
}
