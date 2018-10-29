import { Component, OnInit } from '@angular/core';
import { logging } from 'protractor';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html'
})
export class NavComponent implements OnInit {
    model: any = {};

    constructor(private authService: AuthService,
        private alertifyService: AlertifyService) { }

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
            }
        );
    }

    loggedIn() {
        const token = localStorage.getItem('token');

        return !!token;
    }

    loggedOut() {
        localStorage.removeItem('token');
        console.log('User has been successfully Logged Out!!!');
        this.alertifyService.message('User has been successfully Logged Out!!!');
    }


}

