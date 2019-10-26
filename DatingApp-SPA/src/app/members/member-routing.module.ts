import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../_guards/auth.guard';
import { MemberListComponent } from './member-list/member-list.component';
import { MemberListResolver } from '../_resolvers/member-list.resolver';
import { MemberDetailComponent } from './member-detail/member-detail.component';
import { MemberDetailResolver } from '../_resolvers/member-detail.resolver';
import { MemberEditComponent } from './member-edit/member-edit.component';
import { MemberEditResolver } from '../_resolvers/member-edit.resolver';
import { PreventUnsavedChangesGuard } from '../_guards/prevent-unsaved-changes.guard';

const memberRoutes: Routes = [
  // {
  //   // path: 'member/edit',
  //   path: 'edit',
  //   component: MemberEditComponent,
  //   resolve: { user: MemberEditResolver },
  //   canDeactivate: [PreventUnsavedChangesGuard],
  //   runGuardsAndResolvers: 'always',
  //   canActivate: [AuthGuard]
  // },
  {
    // path: 'members',
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      {
        // path: 'members/edit',
        path: 'edit', // IMP NOTE: This path need to be come before this '' route in order to successfully work.
        component: MemberEditComponent,
        resolve: { user: MemberEditResolver },
        canDeactivate: [PreventUnsavedChangesGuard]
      },
      {
        // path: 'members',
        path: '',
        component: MemberListComponent,
        resolve: {
          users: MemberListResolver
        }
      },
      {
        // path: 'members/:id',
        path: ':id',
        component: MemberDetailComponent,
        resolve: {
          user: MemberDetailResolver
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(memberRoutes)],
  exports: [RouterModule]
})
export class MemberRoutingModule {}
