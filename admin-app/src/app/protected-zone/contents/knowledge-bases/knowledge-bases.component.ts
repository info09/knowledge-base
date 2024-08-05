import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../../shared/services';
import { KnowledgeBasesService } from '../../../shared/services/knowledge-base.service';
import { KnowledgeBase, Pagination } from '../../../shared/models';
import { MessageConstants } from '../../../shared/constants';

@Component({
    selector: 'app-knowledge-bases',
    templateUrl: './knowledge-bases.component.html',
    styleUrls: ['./knowledge-bases.component.css']
})
export class KnowledgeBasesComponent implements OnInit, OnDestroy {
    private subscription = new Subscription();
    //Default
    public blockedPanel = false;
    //Paging
    public pageIndex = 1;
    public pageSize = 10;
    public pageDisplay = 10;
    public totalRecords: number;
    public keyword = '';

    //KnowledgeBase
    public items: any[];
    public selectedItems = [];
    constructor(
        private knowledgeBasesService: KnowledgeBasesService,
        private notificationService: NotificationService,
        private router: Router
    ) {}
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    ngOnInit(): void {
        this.loadData();
    }

    loadData(selectedId = null) {
        this.blockedPanel = true;
        this.subscription.add(
            this.knowledgeBasesService.getAllPaging(this.keyword, this.pageIndex, this.pageSize).subscribe(
                (response: Pagination<KnowledgeBase>) => {
                    this.processLoadData(selectedId, response);
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
    private processLoadData(selectedId = null, response: Pagination<KnowledgeBase>) {
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

    pageChanged(event) {
        this.pageIndex = event.page + 1;
        this.pageSize = event.rows;
        this.loadData();
    }

    showAddModal() {
        this.router.navigateByUrl('/contents/knowledge-bases-detail/');
    }

    deleteItems() {}

    showEditModal() {
        if (this.selectedItems.length === 0) {
            this.notificationService.showError(MessageConstants.NOT_CHOOSE_ANY_RECORD);
            return;
        }
        this.router.navigateByUrl('/contents/knowledge-bases-detail/' + this.selectedItems[0].id);
    }
}
