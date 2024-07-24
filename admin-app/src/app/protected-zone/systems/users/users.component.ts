import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UsersService, NotificationService } from '../../../shared/services';
import { Pagination, User } from '../../../shared/models';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
    // Default
    public bsModalRef: BsModalRef;
    public blockedPanel = false;
    public blockedPanelRole = false;
    /**
     * Paging
     */
    public pageIndex = 1;
    public pageSize = 10;
    public pageDisplay = 10;
    public totalRecords: number;
    public keyword = '';

    // Users
    public items: any[];
    public selectedItems = [];
    public selectedRoleItems = [];
    // Role
    public userRoles: any[] = [];
    public showRoleAssign = false;
    public totalUserRoleRecords: number;

    constructor(
        private modalService: BsModalService,
        private usersService: UsersService,
        private notificationService: NotificationService
    ) {}

    ngOnInit() {
        this.loadData();
    }

    showHideRoleTable() {
        if (this.showRoleAssign) {
            if (this.selectedItems.length === 1) {
                this.loadUserRoles();
            }
        }
    }

    loadData(selectionId = null) {
        this.blockedPanel = true;
        this.usersService.getAllPaging(this.keyword, this.pageIndex, this.pageSize).subscribe(
            (response: Pagination<User>) => {
                this.items = response.items;
                this.pageIndex = this.pageIndex;
                this.pageSize = this.pageSize;
                this.totalRecords = response.totalRecords;
                if (this.selectedItems.length === 0 && this.items.length > 0) {
                    this.selectedItems.push(this.items[0]);
                }
                // Nếu có là sửa thì chọn selection theo Id
                if (selectionId != null && this.items.length > 0) {
                    this.selectedItems = this.items.filter((x) => x.Id === selectionId);
                }

                // Load data grid 02
                if (this.showRoleAssign) {
                    this.loadUserRoles();
                }

                setTimeout(() => {
                    this.blockedPanel = false;
                }, 1000);
            },
            (error) => {
                setTimeout(() => {
                    this.blockedPanel = false;
                }, 1000);
            }
        );
    }

    pageChanged(event: any): void {
        this.pageIndex = event.page + 1;
        this.pageSize = event.rows;
        this.loadData();
    }

    onRowSelectAll() {
        this.selectedRoleItems = [];
        this.totalUserRoleRecords = 0;
        this.userRoles = [];
    }

    onRowSelect(event) {
        this.selectedRoleItems = [];
        this.totalUserRoleRecords = 0;
        this.userRoles = [];
        if (this.selectedItems.length === 1 && this.showRoleAssign) {
            this.loadUserRoles();
        }
    }

    onRowUnselect(event) {
        this.selectedRoleItems = [];
        this.totalUserRoleRecords = 0;
        this.userRoles = [];
        if (this.selectedItems.length === 1 && this.showRoleAssign) {
            this.loadUserRoles();
        }
    }

    showAddModal() {}
    showEditModal() {}

    deleteItems() {}

    // For user roles
    loadUserRoles() {
        this.blockedPanelRole = true;
        // Nếu tồn tại selection thì thực hiện
        if (this.selectedItems != null && this.selectedItems.length > 0) {
            const userId = this.selectedItems[0].id;
            this.usersService.getUserRoles(userId).subscribe(
                (response: any) => {
                    this.userRoles = response;
                    this.totalUserRoleRecords = response.length;
                    if (this.selectedRoleItems.length === 0 && this.userRoles.length > 0) {
                        this.selectedRoleItems.push(this.userRoles[0]);
                    }
                    setTimeout(() => {
                        this.blockedPanelRole = false;
                    }, 1000);
                },
                (error) => {
                    setTimeout(() => {
                        this.blockedPanelRole = false;
                    }, 1000);
                }
            );
        } else {
            this.selectedRoleItems = [];
            setTimeout(() => {
                this.blockedPanelRole = false;
            }, 1000);
        }
    }
    removeRoles() {}

    addUserRole() {}
}
