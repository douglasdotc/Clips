import { DatePipe } from '@angular/common';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ViewEncapsulation
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import videojs from 'video.js'
import IClip from '../models/clip.model';

@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrls: ['./clip.component.css'],
  // Disable view encapsulation for CSS because videojs does not provide
  // a CSS that can automatically encapsulated by Angular.
  // View Encapsulation helps to prevent CSS styles leak to another element
  // by encapsulating the CSS code with an ID, so the style is unique to a
  // particular element.
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe]
})
export class ClipComponent implements OnInit {
  // ViewChild() perform a query on the template and select specified elements:
  // When we are selecting an element with ViewChild,
  // the property will be stored as an ElementRef class.
  // ViewChild() normally be called in ngAfterInit() because
  // ngAfterInit() runs after the template is initialized.
  // (e.g. after all the ngFor loops are done)
  // Our videoPlayer is available from the beginning so we can access it
  // from the beginning. By setting static = true, we run ViewChild() before ngOnInit()
  // is called, by which point the data in the component is initialized.
  @ViewChild('videoPlayer', { static: true }) target?: ElementRef

  // Video Player instance:
  player?: videojs.Player

  // The clip we get from Firebase:
  clip?: IClip

  constructor(
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Initialize the videoPlayer,
    // videoPlayer needs direct access to the element (nativeElement):
    this.player = videojs(this.target?.nativeElement)

    // Subscribe to data, get the clip and pass to the videoPlayer:
    this.route.data.subscribe(data => {
      this.clip = data.clip as IClip

      // Provide URL and type for the player:
      this.player?.src({
        src: this.clip.url,
        type: 'video/mp4'
      })
    })
  }
}
