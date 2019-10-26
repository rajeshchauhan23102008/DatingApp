import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { PaginatedResult } from '../_models/pagination';
import { User } from '../_models/user';
import { AlertifyService } from '../_services/alertify.service';
import { UserService } from '../_services/user.service';

@Injectable({
  providedIn: 'root'
})
export class MemberListResolver implements Resolve<User[]> {
  constructor(
    private alertify: AlertifyService,
    private userService: UserService,
    private router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<User[]> {
    let pageNumber: number = 1;
    let pageSize: number = 5;

    // pageNumber = route.params['pageNumber'];
    // pageSize = route.params['pageSize'];

    return this.userService.getUsers(pageNumber, pageSize).pipe(
      catchError(error => {
        this.alertify.error('Unable to fetch users from server!!!');
        this.router.navigate(['/home']);
        return of(null);
      })
    );
  }
}
