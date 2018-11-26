import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: [
        './nav.component.css'
    ]
})
export class NavComponent implements OnInit {
    model: any = {};

    constructor(private authService: AuthService,
        private alertifyService: AlertifyService,
        private router: Router) { }

    ngOnInit() { }

    login() {
        this.authService.login(this.model).subscribe(
            next => {
                console.log('User successfully logged in');
                this.alertifyService.success('User successfully logged in');
            },
            error => {
                console.log(error);
                this.alertifyService.error(error);
            },
            () => {
                this.router.navigate(['/members']);
            }
        );
    }

    loggedIn() {
        return this.authService.loggedIn();
    }

    loggedOut() {
        localStorage.removeItem('token');
        console.log('User has been successfully Logged Out!!!');
        this.alertifyService.message('User has been successfully Logged Out!!!');
        this.router.navigate(['']);
    }
}

