import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { NotificationService, UtilitiesService } from '../../../../shared/services';
import { CategoriesService } from '../../../../shared/services/category.service';
import { MessageConstants } from '../../../../shared/constants';
import { Category } from '../../../../shared/models';
import { SelectItem } from 'primeng/api/selectitem';

@Component({
    selector: 'app-categories-detail',
    templateUrl: './categories-detail.component.html',
    styleUrls: ['./categories-detail.component.css']
})
export class CategoriesDetailComponent implements OnInit, OnDestroy {
    constructor(
        public bsModalRef: BsModalRef,
        private categoriesService: CategoriesService,
        private notificationService: NotificationService,
        private utilitiesService: UtilitiesService,
        private fb: FormBuilder
    ) {}

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
    ngOnInit(): void {
        this.entityForm = this.fb.group({
            name: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(50)])),
            seoAlias: new FormControl('', Validators.compose([Validators.required])),
            seoDescription: new FormControl(''),
            sortOrder: new FormControl(),
            parentId: new FormControl('')
        });
        this.subscription.add(
            this.categoriesService.getAll().subscribe((response: Category[]) => {
                response.forEach((element) => {
                    this.categories.push({ label: element.name, value: element.id });
                });

                if (this.entityId) {
                    this.dialogTitle = 'Cập nhật';
                    this.loadFormDetails(this.entityId);
                } else {
                    this.dialogTitle = 'Thêm mới';
                }
            })
        );
    }

    private subscription = new Subscription();
    public entityForm: FormGroup;
    public dialogTitle: string;
    private savedEvent: EventEmitter<any> = new EventEmitter();
    public entityId: string;
    public btnDisabled = false;

    public blockedPanel = false;

    public categories: SelectItem[] = [];

    // Validate
    validation_messages = {
        id: [
            { type: 'required', message: 'Trường này bắt buộc' },
            { type: 'maxlength', message: 'Bạn không được nhập quá 25 kí tự' }
        ],
        name: [
            { type: 'required', message: 'Trường này bắt buộc' },
            { type: 'maxlength', message: 'Bạn không được nhập quá 30 kí tự' }
        ]
    };

    private loadFormDetails(id: any) {
        this.blockedPanel = true;
        this.categoriesService.getDetail(id).subscribe(
            (res: any) => {
                this.entityForm.setValue({
                    name: res.name,
                    seoAlias: res.seoAlias,
                    seoDescription: res.seoDescription,
                    sortOrder: res.sortOrder,
                    parentId: res.parentId
                });
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
    saveChange() {
        this.btnDisabled = true;
        this.blockedPanel = true;
        if (this.entityId) {
            let data = this.entityForm.getRawValue();
            data.parentId = data.parentId !== '' ? data.parentId.id : null;
            this.subscription.add(
                this.categoriesService.update(this.entityId, data).subscribe(
                    () => {
                        this.savedEvent.emit(this.entityForm.value);
                        this.notificationService.showSuccess(MessageConstants.UPDATED_OK_MSG);
                        this.btnDisabled = false;
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
        } else {
            let data = this.entityForm.getRawValue();
            data.parentId = data.parentId !== '' ? data.parentId.id : null;
            this.subscription.add(
                this.categoriesService.add(data).subscribe(
                    () => {
                        this.savedEvent.emit(this.entityForm.value);
                        this.notificationService.showSuccess(MessageConstants.CREATED_OK_MSG);
                        this.btnDisabled = false;
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

    generateSeoAlias() {
        const seoAlias = this.utilitiesService.MakeSeoTitle(this.entityForm.controls['name'].value);
        this.entityForm.controls['seoAlias'].setValue(seoAlias);
    }
}
