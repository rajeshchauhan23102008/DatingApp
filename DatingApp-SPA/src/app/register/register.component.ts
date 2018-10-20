import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html'
})
export class RegisterComponent {
    @Input() valuesFromHome: any;
    @Output() cancelRegistration = new EventEmitter();

    model: any = {};

    constructor(private auth: AuthService) { }

    register() {
        this.auth.register(this.model).subscribe(
            next => {
                console.log('User successfully Register!!!');
            },
            error => {
                console.log(error);
            });

        console.log(this.model);
    }

    cancel() {
        this.cancelRegistration.emit(false);
        console.log('cancelled');
    }
}
