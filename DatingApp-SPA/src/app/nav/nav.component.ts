import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { UserService } from '../_services/user.service';
import { User } from '../_models/user';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: [
        './nav.component.css'
    ]
})
export class NavComponent implements OnInit {
    model: any = {};
    photoUrl: string;

    constructor(private authService: AuthService,
        private alertifyService: AlertifyService,
        private router: Router,
        private userService: UserService) { }

    ngOnInit() {

        this.authService.userCurrentPhotoUrl.subscribe(
            (photoUrl) => {
                this.photoUrl = photoUrl;
            }
        );

        // // Call getUser() api and fetch user main photourl property.
        // console.log(this.authService.decodedToken);
        // console.log(this.authService.decodedToken.nameid);
        // this.userService.getUser(this.authService.decodedToken.nameid).subscribe(
        //     (user) => {
        //         this.photoUrl = user.photoUrl;
        //     },
        // );

        // this.userService.onUserMainPhotoChange.subscribe(
        //     (photoUrl) => {
        //         this.photoUrl = photoUrl;
        //     }
        // );
        // // create an event emitter in user service, which will be triggered whenever user main photo changed.

        // // subscribe to UserMainPhotoChange Event and update the photo in the nav component.

    }

    login() {
        this.authService.login(this.model).subscribe(
            next => {
                // this.userService.getUser(this.authService.decodedToken.nameid).subscribe(
                //     (user) => {
                //         this.photoUrl = user.photoUrl;
                //     },
                // );

                this.photoUrl = this.authService.currentUser.photoUrl;

                this.alertifyService.success('User successfully logged in');
            },
            error => {
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
        localStorage.removeItem('currentUser');

        this.authService.decodedToken = null;
        this.authService.currentUser = null;
        this.alertifyService.message('User has been successfully Logged Out!!!');
        this.router.navigate(['']);
    }
}

