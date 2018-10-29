import { Injectable } from '@angular/core';
declare let alertify: any;

@Injectable({
    providedIn: 'root'
})
export class AlertifyService {

    confirm(message: string, okCallback: () => any) {
        alertify.confirm(message, function (e) {
            if (e) {
                okCallback();
            } else { }
        });
    }

    success(message) {
        alertify.success(message);
    }

    error(message) {
        alertify.error(message);
    }

    warning(message) {
        alertify.warning(message);
    }

    message(message) {
        alertify.message(message);
    }

}
