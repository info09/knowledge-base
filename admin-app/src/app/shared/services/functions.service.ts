import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseService } from './base.service';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CommandAssign, Function } from '../models';

@Injectable({ providedIn: 'root' })
export class FunctionsService extends BaseService {
    private _sharedHeaders = new HttpHeaders();
    constructor(private http: HttpClient) {
        super();
        this._sharedHeaders = this._sharedHeaders.set('Content-type', 'application/json');
    }

    add(entity: Function) {
        return this.http
            .post(`${environment.apiUrl}/api/functions`, JSON.stringify(entity), { headers: this._sharedHeaders })
            .pipe(catchError(this.handlerError));
    }

    update(id: string, entity: Function) {
        return this.http
            .put(`${environment.apiUrl}/api/functions/${id}`, JSON.stringify(entity), { headers: this._sharedHeaders })
            .pipe(catchError(this.handlerError));
    }

    getDetails(id: string) {
        return this.http
            .get<Function>(`${environment.apiUrl}/api/functions/${id}`, { headers: this._sharedHeaders })
            .pipe(catchError(this.handlerError));
    }

    delete(id: string) {
        return this.http
            .delete(`${environment.apiUrl}/api/functions/${id}`, { headers: this._sharedHeaders })
            .pipe(catchError(this.handlerError));
    }

    getAll() {
        return this.http
            .get<Function[]>(`${environment.apiUrl}/api/functions`, { headers: this._sharedHeaders })
            .pipe(
                map((response: Function[]) => {
                    return response;
                }),
                catchError(this.handlerError)
            );
    }

    getAllByParentId(parentId) {
        let url = '';
        if (parentId) {
            url = `${environment.apiUrl}/api/functions/${parentId}/parents`;
        } else {
            url = `${environment.apiUrl}/api/functions`;
        }

        return this.http
            .get<Function[]>(url, { headers: this._sharedHeaders })
            .pipe(
                map((response: Function[]) => {
                    return response;
                }),
                catchError(this.handlerError)
            );
    }

    getAllCommandsByFunctionId(functionId: string) {
        return this.http
            .get<Function[]>(`${environment.apiUrl}/api/functions/${functionId}/commands`, {
                headers: this._sharedHeaders
            })
            .pipe(
                map((response: Function[]) => {
                    return response;
                }),
                catchError(this.handlerError)
            );
    }
    addCommandsToFunction(functionId, commandAssign: CommandAssign) {
        return this.http
            .post(`${environment.apiUrl}/api/functions/${functionId}/commands/`, JSON.stringify(commandAssign), {
                headers: this._sharedHeaders
            })
            .pipe(catchError(this.handlerError));
    }
    deleteCommandsFromFunction(functionId, commandAssign: CommandAssign) {
        let query = '';
        for (const commandId of commandAssign.commandIds) {
            query += 'commandIds' + '=' + commandId + '&';
        }
        return this.http
            .delete(
                `${environment.apiUrl}/api/functions/${functionId}/commands?${query}addToAllFunction=${commandAssign.addToAllFunctions}`,
                { headers: this._sharedHeaders }
            )
            .pipe(catchError(this.handlerError));
    }
}
