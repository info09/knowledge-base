import { NgModule } from '@angular/core';
import { CategoriesComponent } from './categories/categories.component';
import { KnowledgeBasesComponent } from './knowledge-bases/knowledge-bases.component';
import { CommentsComponent } from './comments/comments.component';
import { ReportsComponent } from './reports/reports.component';
import { CommonModule } from '@angular/common';
import { ContentsRoutingModule } from './contents-routing.module';

@NgModule({
    declarations: [CategoriesComponent, KnowledgeBasesComponent, CommentsComponent, ReportsComponent],
    imports: [CommonModule, ContentsRoutingModule]
})
export class ContentsModule {}
