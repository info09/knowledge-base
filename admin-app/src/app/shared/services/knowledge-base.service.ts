import { Pagination } from './../models/pagination.model';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';
import { KnowledgeBase } from '../models';

@Injectable({ providedIn: 'root' })
export class KnowledgeBasesService extends BaseService {
    private _sharedHeaders = new HttpHeaders();
    constructor(private http: HttpClient) {
        super();
        this._sharedHeaders = this._sharedHeaders.set('Content-type', 'application/json');
    }

    add(formData: FormData) {
        return this.http
            .post(`${environment.apiUrl}/api/knowledgeBases`, formData, {
                reportProgress: true,
                observe: 'events'
            })
            .pipe(catchError(this.handlerError));
    }

    update(id, formData: FormData) {
        return this.http
            .put(`${environment.apiUrl}/api/knowledgeBases/${id}`, formData, {
                reportProgress: true,
                observe: 'events'
            })
            .pipe(catchError(this.handlerError));
    }

    getDetail(id) {
        return this.http
            .get<KnowledgeBase>(`${environment.apiUrl}/api/knowledgeBases/${id}`, { headers: this._sharedHeaders })
            .pipe(catchError(this.handlerError));
    }

    getAllPaging(filter, pageIndex, pageSize) {
        return this.http
            .get<Pagination<KnowledgeBase>>(
                `${environment.apiUrl}/api/knowledgeBases/filter?filter=${filter}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
                { headers: this._sharedHeaders }
            )
            .pipe(
                map((res: Pagination<KnowledgeBase>) => {
                    return res;
                }),
                catchError(this.handlerError)
            );
    }

    delete(id) {
        return this.http
            .delete(`${environment.apiUrl}/api/knowledgeBases/${id}`, { headers: this._sharedHeaders })
            .pipe(catchError(this.handlerError));
    }

    deleteAttachment(knowledgeBaseId, attachmentId) {
        return this.http
            .delete(`${environment.apiUrl}/api/knowledgeBases/${knowledgeBaseId}/attachments/${attachmentId}`, {
                headers: this._sharedHeaders
            })
            .pipe(catchError(this.handlerError));
    }
}
