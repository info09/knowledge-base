import { ActivatedRoute } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { BaseComponent } from '../../../../protected-zone/base/base.component';
import { NotificationService, ReportsService } from '../../../../shared/services';
import { Pagination, Report } from '../../../../shared/models';
import { MessageConstants } from '../../../../shared/constants';

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.css']
})
export class ReportsComponent extends BaseComponent implements OnInit, OnDestroy {
    private subscription = new Subscription();
    // Default
    public bsModalRef: BsModalRef;
    public blockedPanel = false;
    public entityId: number;
    /**
     * Paging
     */
    public pageIndex = 1;
    public pageSize = 10;
    public pageDisplay = 10;
    public totalRecords: number;
    public keyword = '';
    //
    public items: any[];
    public selectedItems = [];
    constructor(
        private reportsService: ReportsService,
        private notificationService: NotificationService,
        private activatedRouteL: ActivatedRoute,
        private modalService: BsModalService
    ) {
        super('CONTENT_REPORT');
    }
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.subscription.add(
            this.activatedRouteL.params.subscribe((params) => {
                this.entityId = params['knowledgeBaseId'];
            })
        );
        this.loadData();
    }

    loadData(selectedId = null) {
        this.blockedPanel = true;
        this.subscription.add(
            this.reportsService.getAllPaging(this.entityId, this.keyword, this.pageIndex, this.pageSize).subscribe(
                (res: Pagination<Report>) => {
                    this.processLoadData(selectedId, res);
                    setTimeout(() => {
                        this.blockedPanel = false;
                    }, 1000);
                },
                (err) => {
                    setTimeout(() => {
                        this.blockedPanel = false;
                    }, 1000);
                }
            )
        );
    }

    private processLoadData(selectedId = null, response: Pagination<Report>) {
        this.items = response.items;
        this.pageIndex = this.pageIndex;
        this.pageSize = this.pageSize;
        this.totalRecords = response.totalRecords;
        if (this.selectedItems.length === 0 && this.items.length > 0) {
            this.selectedItems.push(this.items[0]);
        }
        if (selectedId != null && this.items.length > 0) {
            this.selectedItems = this.items.filter((x) => x.Id === selectedId);
        }
    }

    pageChanged(event: any): void {
        this.pageIndex = event.page + 1;
        this.pageSize = event.rows;
        this.loadData();
    }

    showDetailModel() {}

    deleteItems() {
        const id = this.selectedItems[0].id;
        this.notificationService.showConfirmation(MessageConstants.CONFIRM_DELETE_MSG, () =>
            this.deleteItemsConfirm(id)
        );
    }

    deleteItemsConfirm(id) {
        this.blockedPanel = true;
        this.subscription.add(
            this.reportsService.delete(this.entityId, id).subscribe(
                () => {
                    this.notificationService.showSuccess(MessageConstants.DELETED_OK_MSG);
                    setTimeout(() => {
                        this.blockedPanel = false;
                    }, 1000);
                },
                (err) => {
                    setTimeout(() => {
                        this.blockedPanel = false;
                    }, 1000);
                }
            )
        );
    }
}
