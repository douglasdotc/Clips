import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { ClipComponent } from './clip/clip.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '', // when the user call this path
    component: HomeComponent // route to this component
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    // :id is a placeholder for the id of the clip
    path: 'clip/:id',
    component: ClipComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
