import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { AuthenticationRequest } from 'src/gs-api/src/models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  
  authenticationRequest: AuthenticationRequest = {};
  errorMessage = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) { }


  ngOnInit(): void {
   
      this.userService.logout();
    
  }
  // tslint:disable-next-line:typedef
  login() {
    this.userService.login(this.authenticationRequest).subscribe((data) => {
      console.log(data);
      this.userService.setAccessToken(data);
      this.getUserByEmail();
      this.router.navigate(['/statistiques']);
    }, error => {
      this.errorMessage = 'Login et / ou mot de passe incorrecte';
    });
  }

  getUserByEmail(): void {
    this.userService.getUserByEmail(this.authenticationRequest.login)
    .subscribe(user => {
      this.userService.setConnectedUser(user);
    });
  }

}


