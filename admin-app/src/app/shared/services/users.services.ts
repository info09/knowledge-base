import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models';
import { catchError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService extends BaseService {
    constructor(private http: HttpClient) {
        super();
    }

    getAll() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        return this.http.get<User[]>(`${environment.apiUrl}/api/users`, httpOptions).pipe(catchError(this.handleError));
    }
}
