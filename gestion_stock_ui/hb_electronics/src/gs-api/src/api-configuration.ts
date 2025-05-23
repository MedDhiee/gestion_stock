import { Injectable } from '@angular/core';

/**
 * Global configuration for Api services
 */
@Injectable({
  providedIn: 'root',
})
export class ApiConfiguration {
  rootUrl = '//localhost:8081';
}

export interface ApiConfigurationInterface {
  rootUrl?: string;
}
