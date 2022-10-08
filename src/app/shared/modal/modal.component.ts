import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

// Modal class responsible for the view of the modal
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  // providers: [
  //   ModalService // ModalService is required here only, we can add it here (2)
  // ]
})
export class ModalComponent implements OnInit {
  @Input() modalID = ''

  constructor(
    public modal: ModalService,
    public el:ElementRef
  ) {

  }

  ngOnInit(): void {
    document.body.appendChild(this.el.nativeElement)
  }

  closeModal() {
    this.modal.toggleModal(this.modalID)
  }
}
