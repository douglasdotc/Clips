import { Injectable } from '@angular/core';

// ModalService manages the Modal including any data and display
@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private visible = false

  constructor() { }

  isModalOpen() {
    return this.visible
  }

  toggleModal() {
    this.visible = !this.visible
  }
}
