import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal/modal.component';
import { TabsContainerComponent } from './tabs-container/tabs-container.component';
import { TabComponent } from './tab/tab.component';
// import { ModalService } from '../services/modal.service';

// shared module to control the shared component under the shared file
@NgModule({
  declarations: [
    ModalComponent,
    TabsContainerComponent,
    TabComponent
  ],
  imports: [
    CommonModule
  ],
  // export components so that it is visible in the parent module
  exports: [
    ModalComponent,
    TabsContainerComponent,
    TabComponent
  ],
  // providers: [
  //   ModalService, // ModalService is required here only, we can add it here (1)
  // ]
})
export class SharedModule { }
