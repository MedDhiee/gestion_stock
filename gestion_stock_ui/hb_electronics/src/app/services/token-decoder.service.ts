import { Injectable } from '@angular/core';
import { jwtDecode, JwtPayload } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class TokenDecoderService {
  decodeToken(token: string): JwtPayload {
    return jwtDecode<JwtPayload>(token);
  }
}
