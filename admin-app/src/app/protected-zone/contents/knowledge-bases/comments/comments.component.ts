import { MessageConstants } from './../../../../shared/constants/message.constant';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { CommentsService, NotificationService } from '../../../../shared/services';
import { Comment, Pagination } from '../../../../shared/models';
import { CommentsDetailComponent } from '../comments-detail/comments-detail.component';

@Component({
    selector: 'app-comments',
    templateUrl: './comments.component.html',
    styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit, OnDestroy {
    private subscription = new Subscription();
    //Default
    public bsModalRef: BsModalRef;
    public blockedPanel = false;
    public entityId: number;
    //Paging
    public pageIndex = 1;
    public pageSize = 10;
    public pageDisplay = 10;
    public totalRecords: number;
    public keyword: string = '';
    public items: any[];
    public selectedItems = [];

    constructor(
        private commentsService: CommentsService,
        private notificationService: NotificationService,
        private activatedRoute: ActivatedRoute,
        private modalService: BsModalService
    ) {}

    ngOnInit(): void {
        this.subscription.add(
            this.activatedRoute.params.subscribe((params) => {
                this.entityId = params['knowledgeBaseId'];
            })
        );
        this.loadData();
    }
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    loadData(selectedId = null) {
        this.blockedPanel = true;
        this.subscription.add(
            this.commentsService.getAllPaging(this.entityId, this.keyword, this.pageIndex, this.pageSize).subscribe(
                (response: Pagination<Comment>) => {
                    this.processLoadData(selectedId, response);
                    setTimeout(() => {
                        this.blockedPanel = false;
                    }, 1000);
                },
                (error) => {
                    setTimeout(() => {
                        this.blockedPanel = false;
                    }, 1000);
                }
            )
        );
    }

    private processLoadData(selectedId = null, response: Pagination<Comment>) {
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

    showDetailModel() {
        if (this.selectedItems.length === 0) {
            this.notificationService.showError(MessageConstants.NOT_CHOOSE_ANY_RECORD);
            return;
        }
        const initialState = {
            entityId: this.selectedItems[0].id
        };
        this.bsModalRef = this.modalService.show(CommentsDetailComponent, {
            initialState: initialState,
            class: 'modal-lg',
            backdrop: 'static'
        });
    }

    deleteItems() {}

    pageChanged(event) {
        this.pageIndex = event.page + 1;
        this.pageSize = event.rows;
        this.loadData();
    }
}
