import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FunctionsComponent } from './functions/functions.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { RolesComponent } from './roles/roles.component';
import { UsersComponent } from './users/users.component';
import { AuthGuard } from '../../shared';

const routes: Routes = [
    {
        path: '',
        component: UsersComponent,
        data: { functionCode: 'SYSTEM_USER' },
        canActivate: [AuthGuard]
    },
    {
        path: 'users',
        component: UsersComponent,
        data: { functionCode: 'SYSTEM_USER' },
        canActivate: [AuthGuard]
    },
    {
        path: 'functions',
        component: FunctionsComponent,
        data: { functionCode: 'SYSTEM_FUNCTION' },
        canActivate: [AuthGuard]
    },
    {
        path: 'roles',
        component: RolesComponent,
        data: { functionCode: 'SYSTEM_ROLE' },
        canActivate: [AuthGuard]
    },
    {
        path: 'permissions',
        component: PermissionsComponent,
        data: { functionCode: 'SYSTEM_PERMISSION' },
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SystemsRoutingModule {}
