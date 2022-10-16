import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { v4 as uuid } from 'uuid'
import { last } from 'rxjs';

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
  percentage = 0
  showPercentage = false

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
    this.showPercentage = true

    this.inSubmission = true

    // Generate a random unique file name using uuid:
    const clipFileName = uuid()
    // Create a path for the clip:
    const clipPath = `clips/${clipFileName}.mp4`

    // Upload the file to clipPath in Firebase:
    const task = this.storage.upload(clipPath, this.file)
    task.percentageChanges().subscribe(progress => {
      this.percentage = progress as number / 100
    })

    // Subscribe to the last snapshot of the upload progress:
    task.snapshotChanges().pipe(
      // last() will only accept the last event of the whole series of snapshot.
      last()
    ).subscribe({
      next: (snapshot) => {
        // If we can get the last snapshot successfully, then the upload is successful.
        this.alertColor = 'green'
        this.alertMsg = 'Success! Your clip is now ready to share with the world.'
        this.showPercentage = false
      },
      error: (error) => {
        // When the server return an error that means the upload was failed.
        this.alertMsg = 'Upload Failed! Please try again later.'
        this.alertColor = 'red'
        this.inSubmission = false
        this.showPercentage = false
        console.error(error)
      }
    })
  }
}
