import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { v4 as uuid } from 'uuid'

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  title = new FormControl('', {
    validators: [
    Validators.required,
    Validators.minLength(3)
    ],
    // Do not allow the title to be null
    nonNullable: true
  })

  uploadForm  = new FormGroup({
    title: this.title
  })

  // Form submission control:
  inSubmission = false

  // Video upload controls:
  isDragover = false
  videoAccepted = false
  file: File | null = null

  // Alert properties:
  showAlert = false
  alertMsg = 'Please wait! Your clip is being uploaded.'
  alertColor = 'blue'

  constructor(
    private storage: AngularFireStorage
  ) { }

  ngOnInit(): void {
  }

  storeFile($event: Event) {
    this.isDragover = false
    this.videoAccepted = false
    this.showAlert = false

    this.file = ($event as DragEvent).dataTransfer?.files.item(0) ?? null

    // Exit the function if the file is null or it is not mp4
    // Mime Types: type/subtype
    if (!this.file || this.file.type !== 'video/mp4') {
      this.alertMsg = 'We accept mp4 files only.'
      this.showAlert = true
      this.alertColor = 'red'
      return
    }

    // Replace the title with the file name by default
    this.title.setValue(
      // Replace the file extension withm null string with regex
      this.file.name.replace(/\.[^/.]+$/, '')
    )
    this.videoAccepted = true
    console.log(this.file)
  }

  uploadFile() {
    this.showAlert = true
    this.alertMsg = 'Please wait! Your clip is being uploaded.'
    this.alertColor = 'blue'

    this.inSubmission = true

    // Generate a random unique file name using uuid:
    const clipFileName = uuid()
    // Create a path for the clip:
    const clipPath = `clips/${clipFileName}.mp4`

    // upload the file to clipPath in Firebase:
    try {
      this.storage.upload(clipPath, this.file)

    } catch (e) {
      console.log(e)
      var errMsg = (e as Error).message
      this.alertMsg = errMsg
      this.alertColor = 'red'
      this.inSubmission = false
      return
    }
    this.alertMsg = 'Upload successful.'
    this.alertColor = 'green'
  }
}
