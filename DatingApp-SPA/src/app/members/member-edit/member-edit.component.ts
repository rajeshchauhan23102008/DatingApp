import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { User } from '../../_models/user';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';
import { AuthService } from '../../_services/auth.service';
import { NgForm } from '@angular/forms';

import { CanComponentDeactivate } from '../../_guards/prevent-unsaved-changes.guard';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-member-edit',
    templateUrl: './member-edit.component.html',
    styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit, CanComponentDeactivate {

    @ViewChild('editForm', { static: true }) editForm: NgForm;
    user: User;
    @HostListener('window:beforeunload', ['$event']) OnBrowserClose($event: any) {
        if (this.editForm.dirty) {
            $event.returnValue = true;
        }
    }

    constructor(private activatedRoute: ActivatedRoute, private userService: UserService, private alertifyService: AlertifyService, private authService: AuthService) { }

    ngOnInit() {

        this.activatedRoute.data.subscribe(
            data => { this.user = data['user']; }
        );

        this.authService.userCurrentPhotoUrl.subscribe(
            (photoUrl) => {
                this.user.photoUrl = photoUrl;
            }
        );

    }

    canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
        if (this.editForm.dirty) {
            return confirm('You have unsaved changes, click CANCEL if you want to save those changes.');
        }

        return true;
    }

    updateUser() {
        // console.log(this.user);

        this.userService.updateUser(this.authService.decodedToken.nameid, this.user).subscribe(
            next => {
                this.alertifyService.success('Profile successfully Edited!!!');
                this.editForm.reset(this.user);
            },
            error => {
                this.alertifyService.error(error);
            }
        );
    }

    // onMainPhotoChanged(eventData: string) {
    //     this.user.photoUrl = eventData;
    // }

}
