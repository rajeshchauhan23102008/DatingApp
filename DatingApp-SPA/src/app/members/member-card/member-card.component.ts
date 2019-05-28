import { Component, Input } from '@angular/core';
import { User } from '../../_models/user';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';
import { AuthService } from '../../_services/auth.service';

@Component({
    selector: 'app-membercard',
    templateUrl: './member-card.component.html',
    styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent {
    @Input() user: User;

    defaultPhoto: string = '../../../assets/user.png';

    constructor(private userService: UserService, private alertify: AlertifyService, private authService: AuthService) { }

    like(recepientid: number) {

        this.userService.sendLike(this.authService.decodedToken.nameid, recepientid).subscribe(
            (response) => { this.alertify.success('User successfully liked'); },
            (error) => { this.alertify.error(error); }
        );
    }
}
