import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Comment } from '../../../../shared/models';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommentsService } from '../../../../shared/services';

@Component({
    selector: 'app-comments-detail',
    templateUrl: './comments-detail.component.html',
    styleUrls: ['./comments-detail.component.scss']
})
export class CommentsDetailComponent implements OnInit, OnDestroy {
    private subscription = new Subscription();
    public dialogTitle: string;
    public knowledgeBaseId: number;
    public entityId: number;
    public btnDisabled = false;
    public blockedPanel = false;
    public comment: Comment;
    constructor(public bsModalRef: BsModalRef, private commentsService: CommentsService) {}
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
    ngOnInit(): void {
        if (this.entityId) {
            this.loadFormDetails(this.entityId, this.knowledgeBaseId);
        }
    }

    private loadFormDetails(commentId, knowledgeBaseId) {
        this.blockedPanel = true;
        this.subscription.add(
            this.commentsService.getDetail(knowledgeBaseId, commentId).subscribe(
                (res: Comment) => {
                    this.comment = res;
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
