import {Injectable}     from '@angular/core';
import {Credentials} from '../models/Credentials'

@Injectable()
export class AuthService {
  storeCredentials(credentials: Credentials) {
    localStorage.setItem('nlm:credentials', JSON.stringify(credentials))
  }

  get isAuthenticated() {
    return !!localStorage.getItem('nlm:credentials')
  }

  removeCredentials() {
    localStorage.removeItem('nlm:credentials')
  }

  getCredentials(): Credentials {
    return this.isAuthenticated && JSON.parse(localStorage.getItem('nlm:credentials'))
  }
}
