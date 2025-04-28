import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardService implements CanActivate {

  constructor(
    private readonly userService: UserService,
    private readonly router: Router
  ) { }

  canActivate(): boolean {
    if (this.userService.isUserLoggedAndAccessTokenValid()) {
      // If the user is authenticated, redirect to the dashboard
      this.router.navigate(['/statistiques']);
      return false;
    }
    return true;
  }
}
