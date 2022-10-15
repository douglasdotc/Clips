import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageComponent } from './manage/manage.component';

const routes: Routes = [
  {
    path: 'manage',
    component: ManageComponent
  }
];

@NgModule({
  // forRoot() will register a service caller Router while
  // forChild() will not. There is no point registering
  // the service twice.
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideoRoutingModule { }
