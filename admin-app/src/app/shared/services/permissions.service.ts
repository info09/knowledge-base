import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PermissionScreen, PermissionUpdateRequest } from '../models';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class PermissionsService extends BaseService {
    private _sharedHeaders = new HttpHeaders();
    constructor(private http: HttpClient) {
        super();
        this._sharedHeaders = this._sharedHeaders.set('Content-type', 'application/json');
    }

    getFunctionWithCommands() {
        return this.http
            .get<PermissionScreen>(`${environment.apiUrl}/api/permissions`, { headers: this._sharedHeaders })
            .pipe(catchError(this.handlerError));
    }

    save(roleId: string, request: PermissionUpdateRequest) {
        return this.http
            .put(`${environment.apiUrl}/api/roles/${roleId}/permissions`, JSON.stringify(request), {
                headers: this._sharedHeaders
            })
            .pipe(catchError(this.handlerError));
    }
}
