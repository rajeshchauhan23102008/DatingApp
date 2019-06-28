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

    // markMsgAsRead(message: Message) {

    //     if ((this.messageType === 'unread' || this.messageType === 'inbox') && message.isRead === false) {
    //         this.userService.readMessage(this.authService.decodedToken.nameid, message.id).subscribe();

    //     }
    // }

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

    deleteMessage(messageId: number) {

        this.alertify.confirm('Are you sure you really want to delete this message?', () => {

            this.userService.deleteMessage(this.authService.decodedToken.nameid, messageId).subscribe(
                () => {

                    // Remove message from the message[].
                    const indexId = this.messages.findIndex((value) => value.id === messageId);
                    this.messages.splice(indexId, 1);

                    this.alertify.success('Message successfully deleted!!!');

                },
                (error) => {
                    this.alertify.error(error);
                });
        });

    }

}
