import { Component, OnInit } from '@angular/core';
import { UserService } from '../../_services/user.service';
import { User } from '../../_models/user';
import { AlertifyService } from '../../_services/alertify.service';

@Component({
    selector: 'app-memberlist',
    templateUrl: './member-list.component.html'
})
export class MemberListComponent implements OnInit {

    users: User[];

    constructor(private userService: UserService, private alertify: AlertifyService) {
     }

    ngOnInit() {
        this.loadUsers();
    }

    loadUsers() {
        this.userService.getUsers().subscribe(
            users => {
                this.users = users;
            },
            error => {
                this.alertify.error(error);
            }
        );
    }

}
