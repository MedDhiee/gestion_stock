import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { UserService } from '../user/user.service';
import { JwtPayload } from 'jwt-decode';
import { TokenDecoderService } from '../token-decoder.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationGuardService implements CanActivate{

  constructor(
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly tokenDecoder: TokenDecoderService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = localStorage.getItem('accessToken');
  
    if (!token) {
      this.router.navigate(['']);
      return false;
    }
  
    let tokenPayload: JwtPayload;
  
    try {
      tokenPayload = this.tokenDecoder.decodeToken(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      localStorage.removeItem('accessToken');
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
