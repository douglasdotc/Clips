import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { ClipComponent } from './clip/clip.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ClipService } from './services/clip.service';

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
    component: ClipComponent,
    // Register the resultant data of the resolver from ClipService as clip.
    // Angular will search for a function name resolve()
    // in ClipService. If exist, The router will use it
    // before loading the component.
    resolve: {
      clip: ClipService
    }
  },
  {
    // '**' wildcard to capture unknown paths
    // Wildcard route should always at the end of this array.
    // The Routing module check the routes in the order of this array.
    // If this is at the top then the app will always route to 404 not found.
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
