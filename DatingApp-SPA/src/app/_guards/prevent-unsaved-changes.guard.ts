import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot } from '@angular/router';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';

@Injectable()
export class PreventUnsavedChangesGuard implements CanDeactivate<MemberEditComponent> {

    canDeactivate(component: MemberEditComponent): boolean {

        if (component.editForm.dirty) {
            return confirm('You have unsaved changes, click CANCEL if you want to save those changes.');
        }

        return true;
    }
}
