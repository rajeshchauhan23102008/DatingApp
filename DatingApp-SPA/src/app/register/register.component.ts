import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html'
})
export class RegisterComponent {
    @Input() valuesFromHome: any;
    @Output() cancelRegistration = new EventEmitter();

    model: any = {};

    constructor(private auth: AuthService,
        private alertifyService: AlertifyService) { }

    register() {
        this.auth.register(this.model).subscribe(
            next => {
                console.log('User successfully Register!!!');
                this.alertifyService.success('User successfully Register!!!');
            },
            error => {
                console.log(error);
                this.alertifyService.error(error);
            });

        console.log(this.model);
    }

    cancel() {
        this.cancelRegistration.emit(false);
        console.log('cancelled');
        this.alertifyService.message('cancelled');
    }
}
