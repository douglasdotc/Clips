import { Component, OnInit } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

// Modal class responsible for the view of the modal
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  constructor(public modal: ModalService) {
    console.log(this.modal.visible)
  }

  ngOnInit(): void {
  }

}
