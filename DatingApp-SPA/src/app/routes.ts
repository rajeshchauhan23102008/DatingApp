import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ListsComponent } from './lists/lists.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { MemberDetailComponent } from '../app/members/member-detail/member-detail.component';
import { MemberEditComponent } from './members/member-edit/member-edit.component';

import { AuthGuard } from './_guards/auth.guard';
import { MemberDetailResolver } from './_resolvers/member-detail.resolver';
import { MemberListResolver } from './_resolvers/member-list.resolver';
import { MemberEditResolver } from './_resolvers/member-edit.resolver';
import { PreventUnsavedChangesGuard } from './_guards/prevent-unsaved-changes.guard';
import { ListResolver } from './_resolvers/lists.resolver';
import { MessageListResolver } from './_resolvers/message-list.resolver';

export const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        children: [
            { path: 'lists', component: ListsComponent, resolve: { users: ListResolver } },
            {
                path: 'members', component: MemberListComponent, resolve: {
                    users: MemberListResolver
                }
            },
            {
                path: 'members/:id', component: MemberDetailComponent, resolve: {
                    user: MemberDetailResolver
                }
            },
            {
                path: 'member/edit', component: MemberEditComponent, resolve: { user: MemberEditResolver },
                canDeactivate: [PreventUnsavedChangesGuard]
            },
            { path: 'messages', component: MessagesComponent, resolve: { paginatedData: MessageListResolver } },
        ]
    },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
