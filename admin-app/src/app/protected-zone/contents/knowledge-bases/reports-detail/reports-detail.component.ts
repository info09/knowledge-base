import { Component, OnDestroy, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { ReportsService } from '../../../../shared/services';
import { Report } from '../../../../shared/models';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-reports-detail',
    templateUrl: './reports-detail.component.html',
    styleUrls: ['./reports-detail.component.scss']
})
export class ReportsDetailComponent implements OnInit, OnDestroy {
    constructor(public bsModalRef: BsModalRef, private reportServices: ReportsService) {}

    private subscription = new Subscription();
    public dialogTitle: string;
    public knowledgeBaseId: number;
    public commentId: number;
    public btnDisabled = false;
    public blockedPanel = false;
    public entityForm: FormGroup;
    public report: Report;

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
    ngOnInit(): void {
        if (this.commentId) {
            this.loadFormDetails(this.commentId, this.knowledgeBaseId);
        }
    }

    private loadFormDetails(commentId, knowledgeBaseId) {
        this.blockedPanel = true;
        this.subscription.add(
            this.reportServices.getDetail(knowledgeBaseId, commentId).subscribe(
                (response: Report) => {
                    this.report = response;
                    setTimeout(() => {
                        this.blockedPanel = false;
                        this.btnDisabled = false;
                    }, 1000);
                },
                (error) => {
                    setTimeout(() => {
                        this.blockedPanel = false;
                        this.btnDisabled = false;
                    }, 1000);
                }
            )
        );
    }
}
