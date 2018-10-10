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
                console.log('Failed to Login');
            }
        );
    }

}

