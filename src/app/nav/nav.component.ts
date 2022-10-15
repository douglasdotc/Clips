import { Component, OnInit } from '@angular/core';
import { ModalService } from '../services/modal.service';
import { AuthService } from '../services/auth.service';

// Class for the nav bar
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(
    public modal: ModalService,
    public auth: AuthService
  ) { }

  ngOnInit(): void {
  }

  openModal($event: Event) {
    // prevent default behaviour of the browser
    // user will not unexpectedly be redirected to
    // a different page.
    $event.preventDefault()

    // set the visible flag to true
    this.modal.toggleModal('auth')
  }
}
