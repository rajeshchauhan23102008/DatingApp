import { Component, OnInit } from '@angular/core';
import { logging } from 'protractor';
import { AuthService } from '../_services/auth.service';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html'
})
export class NavComponent implements OnInit {
    model: any = {};

    constructor(private authService: AuthService) { }

    ngOnInit() { }

    login() {
        this.authService.login(this.model).subscribe(
            next => {
                console.log('User successfully logged in');
            },
            error => {
                console.log(error);
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
    }


}
