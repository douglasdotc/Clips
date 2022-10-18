import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clipService: ClipService,
    private modal: ModalService
  ) { }

  ngOnInit(): void {
    // Subscribe to changes from the route parameters
    // when the component is initialized. No need to unsubscribe
    // the Observable since Angular will automatically unsubscribe from the
    // Observable when the component is destroyed, which happens when ther user
    // navigate to a different page.
    this.route.queryParamMap.subscribe((params: Params) => {
      this.videoOrder = params.get('sort') === '2' ? params.get('sort') : '1'
    })

    // getUserClips() return a list of QuerySnapshot<IClip>.docs
    this.clipService.getUserClips().subscribe(docs => {
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
}
