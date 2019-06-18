import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Message } from '../_models/message';
import { Pagination } from '../_models/pagination';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';

@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

    messages: Message[];
    pagination: Pagination;
    messageType: string = 'unread';

    constructor(private userService: UserService, private activatedRoute: ActivatedRoute,
        private alertify: AlertifyService, private authService: AuthService) {

    }

    ngOnInit() {

        this.activatedRoute.data.subscribe(
            data => {
                this.messages = data['paginatedData'].result;
                this.pagination = data['paginatedData'].pagination;
            }
        );

    }

    loadMessages() {

        this.userService.getMessages(this.authService.decodedToken.nameid, this.pagination.pageNumber,
            this.pagination.pageSize, this.messageType).subscribe(
                response => {
                    this.messages = response.result;
                    this.pagination = response.pagination;
                },
                error => {
                    this.alertify.error(error);
                }
            );
    }

    pageChanged(event: any): void {
        this.pagination.pageNumber = event.page;

        this.loadMessages();
    }

}
