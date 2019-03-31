import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from './_services/auth.service';
import { User } from './_models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  helper = new JwtHelperService();

  constructor(private authService: AuthService) { }

  ngOnInit() {
    // console.log('app component initialized!!!');
    const token = localStorage.getItem('token');
    const currentUser: User = JSON.parse(localStorage.getItem('currentUser'));
    // console.log(token);

    if (token) {
      this.authService.decodedToken = this.helper.decodeToken(token);
      // console.log(this.authService.decodedToken);
    }

    if (currentUser) {
      this.authService.currentUser = currentUser;
      this.authService.photoUrl.next(currentUser.photoUrl);
    }
  }

}
