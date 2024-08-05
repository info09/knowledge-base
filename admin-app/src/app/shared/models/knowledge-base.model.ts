import { AttachmentVm } from './attachment.model';

export class KnowledgeBase {
    id: number;
    categoryId: number;
    categoryName: string;
    title: string;
    seoAlias: string;
    description: string;
    environment: string;
    problem: string;
    stepToReproduce: string;
    errorMessage: string;
    workaround: string;
    note: string;
    ownerUserId: string;
    labels: string[];
    createDate: string;
    lastModifiedDate: string | null;
    numberOfComments: number | null;
    numberOfVotes: number | null;
    numberOfReports: number | null;
    attachments: AttachmentVm[];
}
