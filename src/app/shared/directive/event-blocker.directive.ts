import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[app-event-blocker]'
})
export class EventBlockerDirective {
  // HostListener select host event and listen to the 'drop' and 'dragover' event
  // This decorator will invoke the handleEvent method when the host
  // emits the drop event and pass the argument $event to the function.
  @HostListener('drop', ['$event'])
  @HostListener('dragover', ['$event'])
  public handleEvent(event: Event) {
    // Prevent default behavior of host element events
    event.preventDefault()
  }
}
