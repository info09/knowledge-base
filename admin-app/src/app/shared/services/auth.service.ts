import { HttpClient } from '@angular/common/http';
import { User, UserManager, UserManagerSettings } from 'oidc-client';
import { BehaviorSubject } from 'rxjs';
import { BaseService } from './base.service';
import { Injectable } from '@angular/core';
import { Profile } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService {
  private _authNavStatusSource = new BehaviorSubject<boolean>(false);

  authNavStatus$ = this._authNavStatusSource.asObservable();

  private manager = new UserManager(getClientSettings());

  private user: User | null;

  constructor(private http: HttpClient) {
    super();

    this.manager.getUser().then((user) => {
      this.user = user;
      this._authNavStatusSource.next(this.isAuthenticated());
    });
  }

  login() {
    return this.manager.signinRedirect();
  }

  async completeAuthentication() {
    this.user = await this.manager.signinRedirectCallback();
    this._authNavStatusSource.next(this.isAuthenticated());
  }

  isAuthenticated(): boolean {
    return this.user != null && !this.user.expired;
  }

  get authorizationHeaderValue(): string {
    if (this.user) {
      return `${this.user.token_type} ${this.user.access_token}`;
    }
  }

  get name(): string {
    return this.user != null ? this.user.profile.name : '';
  }

  get profile()  {
    return this.user != null ? this.user.profile : null;
  }

  async signout() {
    await this.manager.signoutRedirect();
  }
}

export function getClientSettings(): UserManagerSettings {
  return {
    authority: 'https://localhost:5000',
    client_id: 'angular_admin',
    redirect_uri: 'http://localhost:4200/auth-callback',
    post_logout_redirect_uri: 'http://localhost:4200/',
    response_type: 'code',
    scope: 'api.knowledgespace openid profile',
    filterProtocolClaims: true,
    loadUserInfo: true,
    automaticSilentRenew: true,
    silent_redirect_uri: 'http://localhost:4200/silent-refresh.html'
  };
}
