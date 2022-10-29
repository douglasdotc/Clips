import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageComponent } from './manage/manage.component';
import { UploadComponent } from './upload/upload.component';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard'

const redirectUnauthorizedToHome = () => redirectUnauthorizedTo('/')

const routes: Routes = [
  {
    path: 'manage',
    component: ManageComponent,
    // expose data to other areas of the app by the Router service
    data: {
      // To specify that the video managing page will only be
      // visible to authenticated users.
      authOnly: true,
      // Customize the behavior of AngularFireAuthGuard class
      // by passing an rxjs pipe through the authGuardPipe key.
      authGuardPipe: redirectUnauthorizedToHome
    },
    // canActivate accepts an array of Guards
    canActivate: [AngularFireAuthGuard]
  },
  {
    path: 'upload',
    component: UploadComponent,
    data: {
      authOnly: true,
      authGuardPipe: redirectUnauthorizedToHome
    },
    canActivate: [AngularFireAuthGuard]
  },
  {
    // If user enter this:
    path: 'manage-clips',
    // Redirect user to this:
    redirectTo: 'manage'
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
