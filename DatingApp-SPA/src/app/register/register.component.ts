import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { User } from '../_models/user';


@Component({
    selector: 'app-register',
    templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
    @Input() valuesFromHome: any;
    @Output() cancelRegistration = new EventEmitter();

    // model: any = {};
    user: User;

    registerForm: FormGroup;

    bsConfig: Partial<BsDatepickerConfig>;

    constructor(private auth: AuthService,
        private alertifyService: AlertifyService, private fb: FormBuilder, private router: Router) { }

    ngOnInit() {
        this.createRegisterForm();

        this.bsConfig = { containerClass: 'theme-red' };
    }

    createRegisterForm() {

        this.registerForm = this.fb.group({
            'username': ['', Validators.required],
            'knownAs': ['', Validators.required],
            'gender': ['male'],
            'dateOfBirth': [null, Validators.required],
            'city': ['', Validators.required],
            'country': ['', Validators.required],
            'password': ['', [Validators.required, Validators.minLength(5), Validators.maxLength(8)]],
            'confirmPassword': ['', Validators.required]
        }, {
                'validator': [this.passwordMismatchValidator]
            });

        // this.registerForm = new FormGroup({
        //     'username': new FormControl('', Validators.required),
        //     'password': new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(8)]),
        //     'confirmPassword': new FormControl('', Validators.required)
        // }, {
        //         validators: this.passwordMismatchValidator
        //     });

    }

    passwordMismatchValidator(fg: FormGroup) {
        return fg.get('password').value === fg.get('confirmPassword').value ? null : { 'mismatch': true };
    }

    register() {

        if (this.registerForm.valid) {

            this.user = Object.assign({}, this.registerForm.value);

            this.auth.register(this.user).subscribe(
                next => {
                    this.alertifyService.success('User successfully Registered!!!');
                },
                error => {
                    this.alertifyService.error(error);
                },
                () => {
                    this.auth.login(this.user).subscribe(
                        next => {
                            this.router.navigate(['/members']);
                        }
                    );
                }
            );

        }
        // this.auth.register(this.model).subscribe(
        //     next => {
        //         this.alertifyService.success('User successfully Register!!!');
        //     },
        //     error => {
        //         this.alertifyService.error(error);
        //     });

        // console.log(this.model);
    }

    cancel() {
        this.cancelRegistration.emit(false);
        this.alertifyService.message('cancelled');
    }
}
