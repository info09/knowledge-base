import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CategoriesComponent } from './categories/categories.component';
import { KnowledgeBasesComponent } from './knowledge-bases/knowledge-bases.component';
import { ReportsComponent } from './reports/reports.component';
import { ContentsRoutingModule } from './contents-routing.module';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { BlockUIModule } from 'primeng/blockui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ValidationMessageModule } from '../../shared/modules/validation-message/validation-message.module';
import { KeyFilterModule } from 'primeng/keyfilter';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { TreeTableModule } from 'primeng/treetable';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ChipsModule } from 'primeng/chips';
import { FileUploadModule } from 'primeng/fileupload';
import { EditorModule } from 'primeng/editor';
import { SharedDirectivesModule } from '../../shared/directives/shared-directives.module';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { NotificationService } from '../../shared/services';
import { CategoriesDetailComponent } from './categories/categories-detail/categories-detail.component';
import { KnowledgeBasesDetailComponent } from './knowledge-bases/knowledge-bases-detail/knowledge-bases-detail.component';
import { CommentsComponent } from './knowledge-bases/comments/comments.component';
import { CommentsDetailComponent } from './knowledge-bases/comments-detail/comments-detail.component';

@NgModule({
    declarations: [
        CategoriesComponent,
        KnowledgeBasesComponent,
        ReportsComponent,
        CategoriesDetailComponent,
        KnowledgeBasesDetailComponent,
        CommentsComponent,
        CommentsDetailComponent
    ],
    imports: [
        CommonModule,
        ContentsRoutingModule,
        PanelModule,
        ButtonModule,
        TableModule,
        PaginatorModule,
        BlockUIModule,
        FormsModule,
        InputTextModule,
        ReactiveFormsModule,
        ProgressSpinnerModule,
        ValidationMessageModule,
        KeyFilterModule,
        CalendarModule,
        CheckboxModule,
        TreeTableModule,
        DropdownModule,
        InputTextareaModule,
        ChipsModule,
        FileUploadModule,
        EditorModule,
        SharedDirectivesModule,
        ModalModule.forRoot()
    ],
    providers: [NotificationService, BsModalService, DatePipe]
})
export class ContentsModule {}
