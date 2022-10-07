import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal/modal.component';
// import { ModalService } from '../services/modal.service';

// shared module to control the shared component under the shared file
@NgModule({
  declarations: [
    ModalComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ModalComponent // export ModalComponent so that it is visible in the parent module
  ],
  // providers: [
  //   ModalService, // ModalService is required here only, we can add it here (1)
  // ]
})
export class SharedModule { }
