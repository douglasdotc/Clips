import { Component, AfterContentInit, ContentChildren, QueryList } from '@angular/core';
import { TabComponent } from '../tab/tab.component';

// Class that manage a group of tabs and
// allow the user the switch between them
@Component({
  selector: 'app-tabs-container',
  templateUrl: './tabs-container.component.html',
  styleUrls: ['./tabs-container.component.css']
})
export class TabsContainerComponent implements AfterContentInit {

  // ContentChildren allow us to select elements from projected content
  // We select TabComponents here
  @ContentChildren(TabComponent) tabs?: QueryList<TabComponent>

  constructor() { }

  ngAfterContentInit(): void {
    console.log(this.tabs)
  }
}
