import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  OnChanges,
  Output,
  EventEmitter
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import IClip from 'src/app/models/clip.model';
import { ModalService } from 'src/app/services/modal.service';
import { ClipService } from 'src/app/services/clip.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
  // Get the active clip from parent component (manage).
  @Input() activeClip: IClip | null = null
  // Emit an update to the parent component (manage) when the update is a success.
  @Output() update = new EventEmitter()

  clipID = new FormControl('', {
    nonNullable: true
  })
  title = new FormControl('', {
    validators: [
    Validators.required,
    Validators.minLength(3)
    ],
    // Do not allow the title to be null
    nonNullable: true
  })

  editForm  = new FormGroup({
    title: this.title,
    id: this.clipID
  })

  // Submission control:
  inSubmission = false

  // Alert properties:
  showAlert = false
  alertColor = 'blue'
  alertMsg = 'Please wait! Updating clip.'

  constructor(
    private modal: ModalService,
    private clipService: ClipService
  ) { }

  ngOnInit(): void {
    this.modal.register('editClip')
  }

  ngOnDestroy(): void {
    this.modal.unregister('editClip');
  }

  // will be called whenever a component's property is updated by a parent component.
  ngOnChanges(): void {
    // activeClip can be empty:
    if (!this.activeClip || !this.activeClip.docID) {
      return
    }
    // Change edit form state:
    this.inSubmission = false
    this.showAlert = false

    // Update form control values:
    this.clipID.setValue(this.activeClip.docID)
    this.title.setValue(this.activeClip.title)
  }

  async submit() {
    // Check if the activeClip is empty:
    if (!this.activeClip) {
      return
    }

    this.inSubmission = true
    this.showAlert = true
    this.alertColor = 'blue'
    this.alertMsg = 'Please wait! Updating clip.'

    try {
      // Update the clip on firebase:
      await this.clipService.updateClip(
        this.clipID.value,
        this.title.value
      )

    } catch (e) {
      this.inSubmission = false
      this.alertColor = 'red'
      this.alertMsg = 'Something went wrong. Try again later.'
      return
    }

    // Update success
    // Change the title in activeClip:
    this.activeClip.title = this.title.value

    // Emit the update to parent component (manage).
    this.update.emit(this.activeClip)

    this.inSubmission = false
    this.alertColor = 'green'
    this.alertMsg = 'Success!'
  }
}
