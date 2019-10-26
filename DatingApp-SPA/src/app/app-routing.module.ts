import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

const appRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () =>
      import('../app/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'lists',
    loadChildren: () =>
      import('../app/lists/list.module').then(m => m.ListModule)
  },
  {
    path: 'messages',
    loadChildren: () =>
      import('../app/messages/message.module').then(m => m.MessageModule)
  },
  {
    path: 'members',
    loadChildren: () =>
      import('../app/members/member.module').then(m => m.MemberModule)
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
