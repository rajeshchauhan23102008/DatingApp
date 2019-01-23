import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { User } from '../_models/user';
import { Observable, of } from 'rxjs';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { catchError } from 'rxjs/operators';
import {Injectable} from '@angular/core';

@Injectable()
export class MemberDetailResolver implements Resolve<User> {

    constructor(private userService: UserService, private alertify: AlertifyService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot): Observable<User> {

        return this.userService.getUser(route.params['id']).pipe(
            catchError(error => {
                this.alertify.error('Error retrieving data from API');
                this.router.navigate(['/members']);
                return of(null);
            })
        );
    }
}
