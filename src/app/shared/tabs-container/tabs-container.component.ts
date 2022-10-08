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
    const activeTabs = this.tabs?.filter(
      tab => tab.active
    )

    if (!activeTabs || activeTabs.length === 0) {
      // "!" --> bang operator: tell the compiler to
      // relax because we are sure that tabs will
      // at least have one tab
      this.selectTab(this.tabs!.first)
    }
  }

  selectTab(tab: TabComponent) {
    // Prevent the case where more than 1 tabs are active
    this.tabs?.forEach(tab => {
      tab.active = false
    })

    tab.active = true

    // let Angular to prevent default behavior by returning false
    return false
  }
}
