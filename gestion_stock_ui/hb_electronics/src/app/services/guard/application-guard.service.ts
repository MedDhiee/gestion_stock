import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { UserService } from '../user/user.service';
import { Observable } from 'rxjs';
import { JwtPayload } from 'jwt-decode';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class ApplicationGuardService implements CanActivate{

  constructor(
    private userService: UserService,
     private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      this.router.navigate(['']);
      return false;
    }

    let tokenPayload: JwtPayload;

    try {
      tokenPayload = jwtDecode<JwtPayload>(token);
    } catch (error) {
      localStorage.removeItem('token');
      this.router.navigate(['']);
      return false;
    }


    if (this.userService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/unauthorized']);
      return false;
    }
  }
}
