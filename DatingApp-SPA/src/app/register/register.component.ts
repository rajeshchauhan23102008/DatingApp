import { Component } from '@angular/core';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html'
})
export class RegisterComponent {
    model: any = {};

    register() {
        console.log(this.model);
    }
}
