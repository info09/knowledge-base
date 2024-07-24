import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseService } from './base.service';
import { catchError, map } from 'rxjs/operators';
import { Function, Pagination, User } from '../models';
import { environment } from '../../../environments/environment';
import { UtilitiesService } from '.';

@Injectable({ providedIn: 'root' })
export class UsersService extends BaseService {
    private _sharedHeader = new HttpHeaders();
    constructor(private http: HttpClient, private utilitiesService: UtilitiesService) {
        super();
        this._sharedHeader = this._sharedHeader.set('Content-Type', 'application/json');
    }
    getAll() {
        return this.http
            .get<User[]>(`${environment.apiUrl}/api/users`, { headers: this._sharedHeader })
            .pipe(catchError(this.handlerError));
    }

    getMenuByUser(userId: string) {
        return this.http
            .get<Function[]>(`${environment.apiUrl}/api/users/${userId}/menu`, { headers: this._sharedHeader })
            .pipe(
                map((response) => {
                    var functions = this.utilitiesService.UnflatteringForLeftMenu(response);
                    return functions;
                }),
                catchError(this.handlerError)
            );
    }

    add(entity: User) {
        return this.http
            .post(`${environment.apiUrl}/api/users`, JSON.stringify(entity), { headers: this._sharedHeader })
            .pipe(catchError(this.handlerError));
    }

    update(userId: string, entity: User) {
        return this.http
            .put(`${environment.apiUrl}/api/users/${userId}`, JSON.stringify(entity), { headers: this._sharedHeader })
            .pipe(catchError(this.handlerError));
    }

    getDetails(userId: string) {
        return this.http
            .get<User>(`${environment.apiUrl}/api/users/${userId}`, { headers: this._sharedHeader })
            .pipe(catchError(this.handlerError));
    }

    getAllPaging(filter: string, pageIndex: number, pageSize: number) {
        return this.http
            .get<Pagination<User>>(
                `${environment.apiUrl}/api/users/filter?filter=${filter}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
                { headers: this._sharedHeader }
            )
            .pipe(
                map((response: Pagination<User>) => {
                    return response;
                }),
                catchError(this.handlerError)
            );
    }

    delete(userId: string) {
        return this.http
            .delete(`${environment.apiUrl}/api/users/${userId}`, { headers: this._sharedHeader })
            .pipe(catchError(this.handlerError));
    }

    getUserRoles(userId: string) {
        return this.http
            .get<string[]>(`${environment.apiUrl}/api/users/${userId}/roles`, { headers: this._sharedHeader })
            .pipe(catchError(this.handlerError));
    }

    assignRolesToUser(userId: string, assignRoleToUser: any) {
        return this.http
            .post(`${environment.apiUrl}/api/users/${userId}/roles`, JSON.stringify(assignRoleToUser), {
                headers: this._sharedHeader
            })
            .pipe(catchError(this.handlerError));
    }

    removeRolesFromUser(userId: string, roleNames: string[]) {
        let roleQuery = '';
        roleNames.forEach((roleName) => {
            roleQuery += `roleNames=${roleName}&`;
        });
        return this.http
            .delete(`${environment.apiUrl}/api/users/${userId}/roles?${roleQuery}`, { headers: this._sharedHeader })
            .pipe(catchError(this.handlerError));
    }
}
