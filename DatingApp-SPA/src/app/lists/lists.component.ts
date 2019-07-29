import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UserService } from '../_services/user.service';
import { User } from '../_models/user';
import { PaginatedResult } from '../_models/pagination';
import { Pagination } from '../_models/pagination';
import { AlertifyService } from '../_services/alertify.service';

@Component({
    selector: 'app-list',
    templateUrl: 'lists.component.html'
})
export class ListsComponent implements OnInit {

    pagination: Pagination;
    users: User[];
    likeParams: string = 'likers';

    constructor(private userService: UserService, private activatedRoute: ActivatedRoute, private route: Router, private alertify: AlertifyService) { }

    ngOnInit() {

        // load users from list resolver data.

        this.activatedRoute.data.subscribe(
            (data) => {
                // console.log(data);
                this.pagination = data['users'].pagination as Pagination;
                this.users = data['users'].result as User[];
            },
            (error) => {
                this.route.navigate(['./home']);
            }
        );

    }

    loadUsers() {
        this.userService.getUsers(this.pagination.pageNumber, this.pagination.pageSize, null, this.likeParams)
            .subscribe(
                (response: PaginatedResult<User[]>) => {
                    this.pagination = response.pagination;
                    this.users = response.result;
                },
                (error) => {
                    this.alertify.error(error);
                }
            );
    }

    pageChanged(event: any): void {
        this.pagination.pageNumber = event.page;
        this.loadUsers();
    }


}
