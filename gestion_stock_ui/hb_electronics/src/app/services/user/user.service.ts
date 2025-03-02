import { Injectable } from '@angular/core';
import { AuthenticationService } from '../../../gs-api/src/services/authentication-controller.service';
import { AuthenticationRequest } from '../../../gs-api/src/models/authentication-request';
import { Observable, of } from 'rxjs';
import { AuthenticationResponse } from '../../../gs-api/src/models/authentication-response';
import { Router } from '@angular/router';
import { UtilisateursService } from '../../../gs-api/src/services/utilisateur-controller.service';
import { UtilisateurDto } from '../../../gs-api/src/models/utilisateur-dto';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private authenticationService: AuthenticationService,
    private utilisateurService: UtilisateursService,
    private router: Router
  ) { }

  login(authenticationRequest: AuthenticationRequest): Observable<AuthenticationResponse> {
    return this.authenticationService.authenticate(authenticationRequest);
  }

  getUserByEmail(email?: string): Observable<UtilisateurDto> {
    if (email !== undefined) {
      return this.utilisateurService.findByEmail(email);
    }
    return of();
  }


  setConnectedUser(utilisateur: UtilisateurDto): void {
    localStorage.setItem('connectedUser', JSON.stringify(utilisateur));
  }

  getConnectedUser(): UtilisateurDto {
    const user = localStorage.getItem('connectedUser');
    if (user) {
      return JSON.parse(user) as UtilisateurDto;
    }
    return {};
  }

  setAccessToken(authenticationResponse: AuthenticationResponse): void {
    localStorage.setItem('accessToken', JSON.stringify(authenticationResponse));
  }
  isUserLoggedAndAccessTokenValid(): boolean {
    const token = localStorage.getItem('accessToken');
    if (token && this.isTokenValid(token)) {
      return true;
    }

    localStorage.removeItem('accessToken');
    this.router.navigate(['']);
    return false;
  }

  setToken(token: string): void {
    localStorage.setItem('accessToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (token) {
      const tokenPayload = this.decodeToken(token);
      return tokenPayload && tokenPayload.exp > Date.now() / 1000;
    }
    return false;
  }

  decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (error) {
      this.logout();
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('connectedUser');
    this.router.navigate(['']);
  }

  private isTokenValid(token: string): boolean {
    const tokenPayload = this.decodeToken(token);
    return tokenPayload && tokenPayload.exp > Date.now() / 1000;
  }
}
