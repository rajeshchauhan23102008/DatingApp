import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private auth: AuthService,
        private alertify: AlertifyService,
        private router: Router) {

    }

    canActivate(): boolean {

        if (this.auth.loggedIn()) {
            return true;
        }

        this.router.navigate(['/home']);
        this.alertify.error('something wrong happend!!!');
        return false;
    }
}
