import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class FunctionService extends BaseService {
    constructor(private http: HttpClient) {
        super();
    }
}
