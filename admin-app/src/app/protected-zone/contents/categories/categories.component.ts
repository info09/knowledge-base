import { Component, OnDestroy, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { CategoriesService } from '../../../shared/services/category.service';
import { Category, Pagination } from '../../../shared/models';
import { NotificationService } from '../../../shared/services';
import { MessageConstants } from '../../../shared/constants';
import { CategoriesDetailComponent } from './categories-detail/categories-detail.component';

@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit, OnDestroy {
    public subscription = new Subscription();
    //Default
    public blockedPanel = false;
    public bsModalRef: BsModalRef;
    //Paging
    public pageIndex = 1;
    public pageSize = 10;
    public pageDisplay = 10;
    public totalRecords: number;
    public keyword = '';
    //Category
    public items: any[];
    public selectedItems = [];
    constructor(
        private categoriesService: CategoriesService,
        private modalService: BsModalService,
        private notificationService: NotificationService
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
            this.categoriesService.getAllPaging(this.keyword, this.pageIndex, this.pageSize).subscribe(
                (res: Pagination<Category>) => {
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

    private processLoadData(selectedId = null, response: Pagination<Category>) {
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

    showAddModal() {
        this.bsModalRef = this.modalService.show(CategoriesDetailComponent, {
            class: 'modal-lg',
            backdrop: 'static'
        });
        this.bsModalRef.content.savedEvent.subscribe((response) => {
            this.bsModalRef.hide();
            this.loadData();
            this.selectedItems = [];
        });
    }

    showEditModal() {
        if (this.selectedItems.length === 0) {
            this.notificationService.showError(MessageConstants.NOT_CHOOSE_ANY_RECORD);
            return;
        }

        const initialState = {
            entityId: this.selectedItems[0].id
        };
        this.bsModalRef = this.modalService.show(CategoriesDetailComponent, {
            initialState: initialState,
            class: 'modal-lg',
            backdrop: 'static'
        });
        this.subscription.add(
            this.bsModalRef.content.savedEvent.subscribe((response) => {
                this.bsModalRef.hide();
                this.loadData(response.id);
            })
        );
    }

    deleteItems() {
        const id = this.selectedItems[0].id;
        this.notificationService.showConfirmation(MessageConstants.CONFIRM_DELETE_MSG, () =>
            this.deleteItemsConfirm(id)
        );
    }

    deleteItemsConfirm(id) {
        this.blockedPanel = true;
        this.categoriesService.delete(id).subscribe(
            () => {
                this.notificationService.showSuccess(MessageConstants.DELETED_OK_MSG);
                this.loadData();
                setTimeout(() => {
                    this.blockedPanel = false;
                }, 1000);
            },
            (err) => {
                setTimeout(() => {
                    this.blockedPanel = false;
                }, 1000);
            }
        );
    }

    pageChanged(event) {
        this.pageIndex = event.page + 1;
        this.pageSize = event.rows;
        this.loadData();
    }
}
