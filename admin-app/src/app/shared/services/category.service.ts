import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Category, Pagination } from '../models';
import { environment } from '../../../environments/environment';
import { catchError, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CategoriesService extends BaseService {
    private _sharedHeaders = new HttpHeaders();
    constructor(private http: HttpClient) {
        super();
        this._sharedHeaders = this._sharedHeaders.set('Content-type', 'application/json');
    }

    add(entity: Category) {
        return this.http
            .post(`${environment.apiUrl}/api/categories`, JSON.stringify(entity), { headers: this._sharedHeaders })
            .pipe(catchError(this.handlerError));
    }

    update(id, entity: Category) {
        return this.http
            .put(`${environment.apiUrl}/api/categories/${id}`, JSON.stringify(entity), { headers: this._sharedHeaders })
            .pipe(catchError(this.handlerError));
    }

    getDetail(id) {
        return this.http
            .get<Category>(`${environment.apiUrl}/api/categories/${id}`, {
                headers: this._sharedHeaders
            })
            .pipe(catchError(this.handlerError));
    }

    getAllPaging(filter, pageIndex, pageSize) {
        return this.http
            .get<Pagination<Category>>(
                `${environment.apiUrl}/api/categories/filter?filte=${filter}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
                { headers: this._sharedHeaders }
            )
            .pipe(
                map((res: Pagination<Category>) => {
                    return res;
                }),
                catchError(this.handlerError)
            );
    }

    delete(id) {
        return this.http
            .delete(`${environment.apiUrl}/api/categories/${id}`, {
                headers: this._sharedHeaders
            })
            .pipe(catchError(this.handlerError));
    }

    getAll() {
        return this.http
            .get<Category[]>(`${environment.apiUrl}/api/categories`, {
                headers: this._sharedHeaders
            })
            .pipe(catchError(this.handlerError));
    }
}
