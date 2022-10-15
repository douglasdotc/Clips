import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageComponent } from './manage/manage.component';
import { UploadComponent } from './upload/upload.component';

const routes: Routes = [
  {
    path: 'manage',
    component: ManageComponent,
    // expose data to other areas of the app by the Router service
    data: {
      // To specify that the video managing page will only be visible to authenticated users.
      authOnly: true
    }
  },
  {
    path: 'upload',
    component: UploadComponent,
    data: {
      authOnly: true
    }
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
