import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Pagination } from '../models';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CommentsService extends BaseService {
    private _sharedHeaders = new HttpHeaders();
    constructor(private http: HttpClient) {
        super();
        this._sharedHeaders = this._sharedHeaders.set('Content-type', 'application/json');
    }

    getAllPaging(knowledgeBaseId, filter, pageIndex, pageSize) {
        return this.http
            .get<Pagination<Comment>>(
                `${environment.apiUrl}/api/knowledgeBases/${knowledgeBaseId}/comments/filter?filter=${filter}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
                { headers: this._sharedHeaders }
            )
            .pipe(catchError(this.handlerError));
    }

    getDetail(knowledgeBaseId, commentId) {
        this.http
            .get<Comment>(`${environment.apiUrl}/api/knowledgeBases/${knowledgeBaseId}/comments/${commentId}`, {
                headers: this._sharedHeaders
            })
            .pipe(catchError(this.handlerError));
    }

    delete(knowledgeBaseId, commentId) {
        return this.http
            .delete(`${environment.apiUrl}/api/knowledgeBases/${knowledgeBaseId}/comments/${commentId}`, {
                headers: this._sharedHeaders
            })
            .pipe(catchError(this.handlerError));
    }
}
