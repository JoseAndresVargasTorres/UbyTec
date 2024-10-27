import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HeaderAdminComponent } from './admin/components/header-admin/header-admin.component';

export const routes: Routes = [

  {path: "", component:LoginComponent},
  {path: "header",component:HeaderAdminComponent}

];
