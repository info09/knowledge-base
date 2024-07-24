import { Component, OnDestroy, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { NotificationService, RoleService } from '../../../shared/services';
import { Pagination, Role } from '../../../shared/models';

@Component({
    selector: 'app-roles',
    templateUrl: './roles.component.html',
    styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit, OnDestroy {
    private subscription = new Subscription();
    //Default
    public bsModalRef: BsModalRef;
    public blockedPanel = false;
    //Paging
    public pageIndex = 1;
    public pageSize = 10;
    public pageDisplay = 10;
    public totalRecords: number;
    public keyword = '';
    //Role
    public items: any[];
    public selectedItems = [];
    constructor(
        private roleService: RoleService,
        private modalService: BsModalService
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
            this.roleService.getAllPaging(this.keyword, this.pageIndex, this.pageSize).subscribe(
                (response: Pagination<Role>) => {
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

    private processLoadData(selectedId = null, response: Pagination<Role>) {
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

    showAddModal() {}

    pageChanged(event: any): void {
        this.pageIndex = event.page + 1;
        this.pageSize = event.rows;
        this.loadData();
    }
}
