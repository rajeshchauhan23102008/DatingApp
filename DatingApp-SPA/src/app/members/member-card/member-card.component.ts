import { Component, Input } from '@angular/core';
import { User } from '../../_models/user';

@Component({
    selector: 'app-membercard',
    templateUrl: './member-card.component.html',
    styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent {
    @Input() user: User;

    defaultPhoto: string = '../../../assets/user.png';

}
