import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Pagination, Role } from '../models';
import { environment } from '../../../environments/environment';
import { catchError, map } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RoleService extends BaseService {
    private _sharedHeaders = new HttpHeaders();
    constructor(private http: HttpClient) {
        super();
        this._sharedHeaders = this._sharedHeaders.set('Content-Type', 'application/json');
    }

    add(entity: Role) {
        return this.http
            .post(`${environment.apiUrl}/api/roles`, JSON.stringify(entity), { headers: this._sharedHeaders })
            .pipe(catchError(this.handleError));
    }

    update(id: string, entity: Role) {
        return this.http
            .put(`${environment.apiUrl}/api/roles/${id}`, JSON.stringify(entity), { headers: this._sharedHeaders })
            .pipe(catchError(this.handleError));
    }

    getDetails(id: string) {
        return this.http
            .get<Role>(`${environment.apiUrl}/api/roles/${id}`, { headers: this._sharedHeaders })
            .pipe(catchError(this.handleError));
    }

    getAllPaging(filter: string, pageIndex: number, pageSize: number) {
        return this.http
            .get<Pagination<Role>>(
                `${environment.apiUrl}/api/roles/filter?filter=${filter}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
                { headers: this._sharedHeaders }
            )
            .pipe(
                map((response: Pagination<Role>) => {
                    return response;
                }),
                catchError(this.handleError)
            );
    }

    delete(id: string) {
        return this.http
            .delete(`${environment.apiUrl}/api/roles/${id}`, { headers: this._sharedHeaders })
            .pipe(catchError(this.handleError));
    }
}
