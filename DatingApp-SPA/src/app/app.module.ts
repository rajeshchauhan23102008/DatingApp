import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { JwtModule } from '@auth0/angular-jwt';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';

import { ErrorInterceptorProvider } from './_services/error.interceptor';

import { DatingAppUIConfig } from '../assets/config';
import { AppRoutingModule } from './app-routing.module';

import { SharedModule } from './shared/shared.module';

// export function tokenGetter(): string {
//   return localStorage.getItem('token');
// }

export function tokenGetter(): string {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [AppComponent, NavComponent],
  imports: [
    BrowserModule,
    SharedModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        // tokenGetter: () => {
        //   return localStorage.getItem('token');
        // },
        whitelistedDomains: DatingAppUIConfig.whitelistedDomainsName,
        blacklistedRoutes: DatingAppUIConfig.blacklistedRoutesName
      }
    }),
    AppRoutingModule
  ],
  providers: [ErrorInterceptorProvider],
  bootstrap: [AppComponent]
})
export class AppModule {}
