import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import IClip from 'src/app/models/clip.model';
import { ClipService } from 'src/app/services/clip.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {
  // To store the sorting order
  // 1: decending order (new upload first)
  // 2: ascending order
  videoOrder = '1'
  clips: IClip[] = []
  activeClip: IClip | null = null
  // BehaviorSubject is an Observable that can acts like
  // a observable and observer at the same time,
  // meaning that an observer can also push value to the observer.
  sort$: BehaviorSubject<string>

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clipService: ClipService,
    private modal: ModalService
  ) {
    // Initialize with videoOrder:
    this.sort$ = new BehaviorSubject(this.videoOrder)
  }

  ngOnInit(): void {
    // Subscribe to changes from the route parameters
    // when the component is initialized. No need to unsubscribe
    // the Observable since Angular will automatically unsubscribe from the
    // Observable when the component is destroyed, which happens when ther user
    // navigate to a different page.
    this.route.queryParamMap.subscribe((params: Params) => {
      // Listen to the videoOrder from the user:
      this.videoOrder = params.get('sort') === '2' ? params.get('sort') : '1'
      // Push the latest sort order to the BehaviorSubject Observable:
      this.sort$.next(this.videoOrder)
    })

    // getUserClips() return a list of QuerySnapshot<IClip>.docs
    this.clipService.getUserClips(this.sort$).subscribe(docs => {
      // Reset
      this.clips = []

      docs.forEach(doc => {
        this.clips.push({
          // ID of the document doc
          docID: doc.id,
          // Spread operator will merge the data with the object.
          ...doc.data()
        })
      })
    })
  }

  sort(event: Event) {
    // Get the value from event target in the selected element
    const { value } = (event.target as HTMLSelectElement)

    // Place the value in the url route as a query parameter:
    // --> /manage?sort=${value}
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: value
      }
    })
  }

  openModal($event: Event, clip: IClip) {
    $event.preventDefault()

    this.activeClip = clip
    this.modal.toggleModal('editClip')
  }

  // Upon an update event, the edit form will return an event which is of type IClip
  // Update the list of clips showing to the user.
  update($event: IClip) {
    this.clips.forEach((element, index) => {
      // Identify the clip and update the title.
      if (element.docID == $event.docID) {
        this.clips[index].title = $event.title
      }
    })
  }

  deleteClip($event: Event, clip: IClip) {
    $event.preventDefault()

    // Delete the clip in Firebase:
    this.clipService.deleteClip(clip)

    // remove the clip from array:
    this.clips.forEach((element, index) => {
      if (element.docID == clip.docID) {
        this.clips.splice(index, 1)
      }
    })
  }

  // Clipboard API is asynchronous
  async copyToClipboard($event: MouseEvent, docID: string | undefined) {
    // Prevent default behavior of the browser on click:
    $event.preventDefault()

    // Guarding from empty docID:
    if (!docID) {
      return
    }

    // Form URL:
    const url = `${location.origin}/clip/${docID}`
    // Write the url to the user's clipboard:
    await navigator.clipboard.writeText(url)
    // Alert the user that the link is copied:
    alert('Link Copied!')
  }
}
