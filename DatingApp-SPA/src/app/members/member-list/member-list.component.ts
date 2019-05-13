import { Component, OnInit } from '@angular/core';
import { UserService } from '../../_services/user.service';
import { User } from '../../_models/user';
import { AlertifyService } from '../../_services/alertify.service';
import { Pagination, PaginatedResult } from '../../_models/pagination';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-memberlist',
    templateUrl: './member-list.component.html'
})
export class MemberListComponent implements OnInit {

    users: User[];
    pagination: Pagination;
    userParams: any = {};
    user: User;
    genderList: any = [
        { value: 'male', display: 'Males' },
        { value: 'female', display: 'Females' }
    ];

    pageNumber: number = 1;
    pageSize: number = 5;

    constructor(private activatedRoute: ActivatedRoute, private alertify: AlertifyService, private userService: UserService) {
    }

    resetFilters() {
        this.resetFormControls();
        this.loadUsers();
    }

    private resetFormControls() {

        this.userParams.minAge = 18;
        this.userParams.maxAge = 99;
        this.userParams.gender = this.user.gender === 'male' ? 'female' : 'male';
        this.userParams.orderBy = 'lastActive';
    }

    ngOnInit() {
        this.activatedRoute.data.subscribe(
            (data) => {
                this.users = data['users'].result;
                this.pagination = data['users'].pagination;

            }
        );

        // get user from localStorage.
        this.user = JSON.parse(localStorage.getItem('currentUser'));

        this.resetFormControls();
    }

    pageChanged(event: any): void {
        this.pagination.pageNumber = event.page;
        this.loadUsers();
    }

    loadUsers() {

        this.userService.getUsers(this.pagination.pageNumber, this.pagination.pageSize, this.userParams).subscribe(
            res => {
                this.users = res.result;
                this.pagination = res.pagination;

            },
            error => {
                this.alertify.error(error);
            }
        );
    }

    // loadUsers() {

    //     this.userService.getUsers(this.pageNumber, this.pageSize).subscribe(
    //         res => {
    //             this.users = res.result;
    //             this.pagination = res.pagination;

    //         },
    //         error => {
    //             this.alertify.error(error);
    //         }
    //     );
    // }

}
