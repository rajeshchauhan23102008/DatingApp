import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { tap } from 'rxjs/operators';

import { UserService } from '../../_services/user.service';
import { Message } from '../../_models/message';
import { AuthService } from '../../_services/auth.service';
import { AlertifyService } from '../../_services/alertify.service';

@Component({
    selector: 'app-member-messages',
    templateUrl: './member-messages.component.html',
    styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {

    @Input('recipientId') recipientId: number;
    messages: Message[];

    constructor(private userService: UserService, private authService: AuthService, private alertify: AlertifyService) { }

    ngOnInit() {
        this.loadMessages();
    }

    loadMessages() {

        const userid = +this.authService.decodedToken.nameid;

        this.userService.getUserMessageThread(this.authService.decodedToken.nameid, this.recipientId)
            .pipe(
                tap((messages) => {

                    for (let i = 0; i < messages.length; i++) {

                        if (messages[i].isRead === false && messages[i].recipientId === userid) {

                            this.userService.readMessage(userid, messages[i].id).subscribe();
                            messages[i].dateRead = new Date();
                        }
                    }
                })
            )
            .subscribe(
                messages => {
                    this.messages = messages;
                },
                error => {
                    this.alertify.error(error);
                }
            );
    }

    onSubmit(sendMsgForm: NgForm) {
        if (sendMsgForm.valid) {
            this.userService.sendMessage(this.authService.decodedToken.nameid, this.recipientId, sendMsgForm.value.message).subscribe(
                (response: Message) => {
                    // Update Message List.
                    const newMessage = Object.assign({}, response);

                    this.messages.unshift(newMessage);

                    sendMsgForm.reset();
                },
                (error) => {
                    this.alertify.error(`Error sending message : ${error}`);
                }
            );

        }
    }
}
