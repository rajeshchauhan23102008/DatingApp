import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { User } from '../_models/user';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';

@Injectable()
export class ListResolver implements Resolve<User[]> {

    constructor(private userService: UserService, private alertify: AlertifyService, private route: Router) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User[]> {

        const pageNumber: number = 1;
        const pageSize: number = 5;
        const likeParams: string = 'likers';


        return this.userService.getUsers(pageNumber, pageSize, null, likeParams)
            .pipe(catchError(
                (error) => {
                    this.alertify.error('Unable to fetch data from server!!!');
                    this.route.navigate(['/home']);
                    return of(null);
                }
            ));

    }
}