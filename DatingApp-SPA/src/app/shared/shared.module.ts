import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  BsDropdownModule,
  BsDatepickerModule,
  PaginationModule,
  ButtonsModule,
  TabsModule
} from 'ngx-bootstrap';
import { NgxGalleryModule } from 'ngx-gallery';
import { FileUploadModule } from 'ng2-file-upload';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TimeAgoPipe } from 'time-ago-pipe';
import { MemberCardComponent } from '../members/member-card/member-card.component';

@NgModule({
  declarations: [TimeAgoPipe, MemberCardComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
    ButtonsModule.forRoot(),
    TabsModule.forRoot(),
    NgxGalleryModule,
    FileUploadModule,
    RouterModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule,
    BsDatepickerModule,
    PaginationModule,
    ButtonsModule,
    TabsModule,
    NgxGalleryModule,
    FileUploadModule,
    RouterModule,
    TimeAgoPipe,
    MemberCardComponent
  ]
})
export class SharedModule {}
