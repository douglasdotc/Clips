import { Component, Input, OnInit, ElementRef, OnDestroy } from '@angular/core';
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
export class ModalComponent implements OnInit, OnDestroy {
  @Input() modalID = ''

  constructor(
    public modal: ModalService,
    public el: ElementRef
  ) { }

  // Make modal independent of CSS style changes in nested HTML structure
  // by moving its host element (nativeElement) to the <body> using ElementRef
  ngOnInit(): void {
    document.body.appendChild(this.el.nativeElement)
  }

  ngOnDestroy(): void {
    document.body.removeChild(this.el.nativeElement)
  }

  closeModal() {
    this.modal.toggleModal(this.modalID)
  }
}
