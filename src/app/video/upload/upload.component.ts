import { SessionStorageService } from 'src/app/services/session-storage.service';
import IUser from 'src/app/models/user.model';
import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { v4 as uuid } from 'uuid'
import { combineLatest, forkJoin, switchMap, Observable, filter, BehaviorSubject } from 'rxjs';
import { ClipService } from 'src/app/services/clip.service';
import { Router } from '@angular/router';
import { FfmpegService } from 'src/app/services/ffmpeg.service';
import { HttpEvent, HttpEventType, HttpProgressEvent } from '@angular/common/http';
import Response from '../../models/response.model';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnDestroy {
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
  task?: Observable<HttpEvent<Response>>
  screenshots: string[] = []
  selectedScreenshot = ''
  screenshotTask?: Observable<HttpEvent<Response>>

  // user:
  user: IUser | null

  // Alert properties:
  showAlert = false
  alertMsg = 'Please wait! Your clip is being uploaded.'
  alertColor = 'blue'

  constructor(
    private router: Router,
    public  ffmpegService: FfmpegService,
    private clipsService: ClipService,
    private sessionStorageService: SessionStorageService
  ) {
    // user will not be able to access this page if he is not authenticated.
    // the user subscribed will always received a non-null value.
    this.user = sessionStorageService.getUser()
    this.ffmpegService.init()
  }

  ngOnDestroy(): void {
    // Cancel the upload process if the user navigate to a different page
    // in which case angular will destroy the component.
    // this.task?.cancel()
  }

  async storeFile($event: Event) {
    // Prevent user from uploading another file while getting screenshots:
    if (this.ffmpegService.isRunning) {
      return
    }

    this.isDragover = false
    this.videoAccepted = false
    this.showAlert = false

    // Some browsers do not support drag and drop events
    // in which case we do not have a dataTransfer property.
    // We implements a fallback upload method using input and
    // that will be a HTMLInputElement.
    this.file = ($event as DragEvent).dataTransfer ?
      ($event as DragEvent).dataTransfer?.files.item(0) ?? null :
      ($event.target as HTMLInputElement).files?.item(0) ?? null

    // Exit the function if the file is null or it is not mp4
    // Mime Types: type/subtype
    if (!this.file || this.file.type !== 'video/mp4') {
      this.alertMsg = 'We accept mp4 files only.'
      this.showAlert = true
      this.alertColor = 'red'
      return
    }

    // Get screenshots using ffmpeg:
    this.screenshots = await this.ffmpegService.getScreenshots(this.file)

    // Initialize selectedScreenshot:
    this.selectedScreenshot = this.screenshots[0]

    // Replace the title with the file name by default
    this.title.setValue(
      // Replace the file extension withm null string with regex
      this.file.name.replace(/\.[^/.]+$/, '')
    )
    this.videoAccepted = true
    console.log(this.file)
  }

  async uploadFile() {
    // Disable the form so that the user cannot edit the form.
    this.uploadForm.disable()

    this.showAlert = true
    this.alertMsg = 'Please wait! Your clip is being uploaded.'
    this.alertColor = 'blue'
    this.showPercentage = true

    this.inSubmission = true

    // Generate a random unique file name using uuid:
    const clipFileName = uuid()

    // Create a path for the clip:
    const clipPath = `clips/${clipFileName}.mp4`

    // Get blob from selectedScreenshot URL:
    const screenshotBlob = await this.ffmpegService.blobFromURL(
      this.selectedScreenshot
    )

    // Create a path for the screenshot:
    const screenshotPath = `screenshots/${clipFileName}.png`

    // Upload the file to clipPath in Firebase:
    this.task = this.clipsService.upload(clipPath, this.file as File)

    // Upload the screenshot as Blob:
    this.screenshotTask = this.clipsService.upload(screenshotPath, screenshotBlob as File)

    combineLatest([
      this.task.pipe(
        filter(event => event.type === HttpEventType.UploadProgress)
      ),
      this.screenshotTask.pipe(
        filter(event => event.type === HttpEventType.UploadProgress)
      )
    ]).subscribe((events) => {
      const [clipEvent, screenshotEvent] = (events as HttpProgressEvent[])

      if (!clipEvent.total || !clipEvent.loaded ||
        !screenshotEvent.total || !screenshotEvent.loaded) {
        return
      }
      this.percentage = (clipEvent.loaded/clipEvent.total + screenshotEvent.loaded/screenshotEvent.total) / 2
    })

    // Subscribe to the upload progress of the video (task) and the screenshot:
    // ForkJoin waits until all the Observables are completed and then push
    // the latest values of the observables to the subscriber as a stream.
    forkJoin([
      this.task,
      this.screenshotTask
    ]).pipe(
      // ForkJoin the download URL of the video and the screenshot:
      // We are waiting for Firebase to give us the URLs for the video
      // and the screenshot:
      switchMap(() => forkJoin([
        this.clipsService.getDownloadURL(clipPath),
        this.clipsService.getDownloadURL(screenshotPath)
      ]))
    ).subscribe({
      next: async (responses) => {

        const [clipResponse, screenshotResponse] = responses
        const clipURL = clipResponse.data.downloadURL
        const screenshotURL = screenshotResponse.data.downloadURL
        const user = this.sessionStorageService.getUser()

        // Storing the file data:
        const clip = {
          uid: user?.uid as string,
          displayName: user?.name as string,
          title: this.title.value,
          fileName: `${clipFileName}.mp4`,
          url: clipURL,
          screenshotURL,
          screenshotFileName: `${clipFileName}.png`,
          // timestamp: set directly in backend (server timezone)
        }

        // Add clip info to database, createClip() returns a Promise from the server
        // which is asynchronous:
        const clipDocRef = await this.clipsService.createClip(clip)
        console.log(clip)

        // If we can get the last snapshot successfully, then the upload is successful.
        this.alertColor = 'green'
        this.alertMsg = 'Success! Your clip is now ready to share with the world.'
        this.showPercentage = false

        // Navigate user to the clip page after 1000ms.
        setTimeout(() => {
          this.router.navigate([
            // Absolute path: clip/:id
            'clip', clipDocRef.docID
          ])
        }, 1000)
      },
      error: (error) => {
        //Enable the form again to let the user to correct the form.
        this.uploadForm.enable()

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
