import { NgModule } from '@angular/core';
import { MemberListComponent } from './member-list/member-list.component';
import { MemberDetailComponent } from './member-detail/member-detail.component';
import { MemberEditComponent } from './member-edit/member-edit.component';
import { MemberMessagesComponent } from './member-messages/member-messages.component';
import { PhotoEditorComponent } from './photo-editor/photo-editor.component';
import { SharedModule } from '../shared/shared.module';
import { MemberRoutingModule } from './member-routing.module';

@NgModule({
  declarations: [
    MemberListComponent,
    MemberDetailComponent,
    MemberEditComponent,
    MemberMessagesComponent,
    PhotoEditorComponent
  ],
  imports: [SharedModule, MemberRoutingModule]
})
export class MemberModule {}
