import { Component, OnInit } from '@angular/core';
import { logging } from 'protractor';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html'
})
export class NavComponent implements OnInit {
    model: any = {};

    constructor() { }

    ngOnInit() { }

    login() {
        console.log(this.model);
    }

}

