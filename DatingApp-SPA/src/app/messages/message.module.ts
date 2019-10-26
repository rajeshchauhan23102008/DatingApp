import { NgModule } from '@angular/core';
import { MessagesComponent } from './messages.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { MessageListResolver } from '../_resolvers/message-list.resolver';
import { AuthGuard } from '../_guards/auth.guard';

@NgModule({
  declarations: [MessagesComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        // path: 'messages',
        path: '',
        component: MessagesComponent,
        resolve: { paginatedData: MessageListResolver },
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class MessageModule {}
