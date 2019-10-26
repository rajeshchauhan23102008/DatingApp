import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { AlertifyService } from '../_services/alertify.service';
import { Message } from '../_models/message';
import { PaginatedResult } from '../_models/pagination';
import { UserService } from '../_services/user.service';
import { AuthService } from '../_services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MessageListResolver
  implements Resolve<PaginatedResult<Message[]>> {
  pageNumber: number = 1;
  pageSize: number = 10;
  messageType: string = 'unread';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private alertify: AlertifyService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<PaginatedResult<Message[]>> {
    return this.userService
      .getMessages(
        this.authService.decodedToken.nameid,
        this.pageNumber,
        this.pageSize,
        this.messageType
      )
      .pipe(
        catchError(error => {
          this.alertify.error(error);
          this.router.navigate(['/home']);
          return of(null);
        })
      );
  }
}
