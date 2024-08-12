import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Pagination, Report } from '../models';
import { environment } from '../../../environments/environment';
import { catchError, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ReportsService extends BaseService {
    private _sharedHeaders = new HttpHeaders();
    constructor(private http: HttpClient) {
        super();
        this._sharedHeaders = this._sharedHeaders.set('Content-type', 'application/json');
    }

    getAllPaging(knowledgeBaseId, filter, pageIndex, pageSize) {
        return this.http
            .get<Pagination<Report>>(
                `${environment.apiUrl}/api/knowledgeBases/${knowledgeBaseId}/reports/filter?filter=${filter}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
                { headers: this._sharedHeaders }
            )
            .pipe(
                map((response: Pagination<Report>) => {
                    return response;
                }),
                catchError(this.handlerError)
            );
    }

    getDetail(knowledgeBaseId, reportId) {
        return this.http
            .get<Report>(`${environment.apiUrl}/api/knowledgeBases/${knowledgeBaseId}/reports/${reportId}`, {
                headers: this._sharedHeaders
            })
            .pipe(catchError(this.handlerError));
    }

    delete(knowledgeBaseId, reportId) {
        return this.http
            .delete(`${environment.apiUrl}/api/knowledgeBases/${knowledgeBaseId}/reports/${reportId}`, {
                headers: this._sharedHeaders
            })
            .pipe(catchError(this.handlerError));
    }
}
