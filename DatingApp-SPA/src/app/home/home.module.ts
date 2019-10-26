import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home.component';
import { RegisterComponent } from '../register/register.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [HomeComponent, RegisterComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        // path: 'home',
        path: '',
        component: HomeComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class HomeModule {}
