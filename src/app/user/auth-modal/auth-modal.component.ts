import { ModalService } from 'src/app/services/modal.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

// AuthModal class is responsible for the data of the user in the modal
@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.css']
})
export class AuthModalComponent implements OnInit, OnDestroy {

  constructor(public modal: ModalService) { }

  ngOnInit(): void {
    this.modal.register('auth')
  }

  ngOnDestroy(): void {
    this.modal.unregister('auth')
  }
}
