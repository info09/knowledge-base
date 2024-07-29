import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Command } from '../models';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CommandsService extends BaseService {
    private _sharedHeaders = new HttpHeaders();
    constructor(private http: HttpClient) {
        super();
        this._sharedHeaders = this._sharedHeaders.set('Content-Type', 'application/json');
    }

    getAll() {
        return this.http
            .get<Command[]>(`${environment.apiUrl}/api/commands`, { headers: this._sharedHeaders })
            .pipe(catchError(this.handlerError));
    }
}
