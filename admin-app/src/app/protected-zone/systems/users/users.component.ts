import { User } from './../../../shared/models/user.model';
import { UserService } from '../../../../app/shared/services/users.services';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
    public users$: Observable<User[]>;
    constructor(private userService: UserService) {}

    ngOnInit(): void {
        this.users$ = this.userService.getAll();
    }
}
