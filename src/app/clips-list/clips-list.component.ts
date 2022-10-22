import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-clips-list',
  templateUrl: './clips-list.component.html',
  styleUrls: ['./clips-list.component.css']
})
export class ClipsListComponent implements OnInit, OnDestroy {

  constructor() { }

  ngOnInit(): void {
    // Listen to scroll event:
    window.addEventListener('scroll', this.handleScroll)
  }

  ngOnDestroy(): void {
    // Destroy event listener to scroll event when user navigate away from the page:
    window.removeEventListener('scroll', this.handleScroll)
  }

  // This function checks the current scroll posiition of the page:
  // We need an arrow function here to access the component injected
  // services. A regular function will not be able to access the services.
  handleScroll = () => {
    // A web page:
    //             -+------------------------------+-
    //             ^|                              |^
    //              |                              |
    //              |                              | scrollTop
    //              |                              |
    //              |                              |v
    // offsetHeight +------------------------------+-
    //              |                              |^
    //              |                              | innerHeight
    //              |                              |v
    //              +------------------------------+-
    const { scrollTop, offsetHeight } = document.documentElement
    const { innerHeight } = window

    // Check if scrollTop + innerHeight = offsetHeight,
    // if yes, that means the user scrolled to the end of the page:
    const bottomOfWindow = Math.round(scrollTop + innerHeight) === offsetHeight
    if(bottomOfWindow) {
      console.log('Bottom of window')
    }
  }
}
