import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FunctionsComponent } from './functions/functions.component';
import { UsersComponent } from './users/users.component';
import { RolesComponent } from './roles/roles.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { SystemsRoutingModule } from './systems-routing.module';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { NotificationService } from '../../shared/services';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { InputTextModule } from 'primeng/inputtext';
import { ValidationMessageModule } from '../../shared/modules/validation-message/validation-message.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [FunctionsComponent, UsersComponent, RolesComponent, PermissionsComponent],
    imports: [
        CommonModule,
        SystemsRoutingModule,
        PanelModule,
        ButtonModule,
        TableModule,
        PaginatorModule,
        BlockUIModule,
        FormsModule,
        ReactiveFormsModule,
        ProgressSpinnerModule,
        ValidationMessageModule,
        InputTextModule,
        ModalModule.forRoot()
    ],
    providers: [NotificationService, BsModalService]
})
export class SystemsModule {}
