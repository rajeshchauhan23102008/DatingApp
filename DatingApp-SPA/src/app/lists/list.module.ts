import { NgModule } from '@angular/core';
import { ListsComponent } from './lists.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { ListResolver } from '../_resolvers/lists.resolver';
import { AuthGuard } from '../_guards/auth.guard';

@NgModule({
  declarations: [ListsComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        // path: 'lists',
        path: '',
        component: ListsComponent,
        resolve: { users: ListResolver },
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ListModule {}
