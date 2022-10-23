import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TabComponent } from '../tab/tab.component';

import { TabsContainerComponent } from './tabs-container.component';

// Create a dummy component to load nested component with projected content.
// TestBed will not automatically project the tabComponent into
// tabsContainerComponent. It is a nested component in tabsContainerComponent:
@Component({
  template: `<app-tabs-container>
    <app-tab tabTitle="Tab 1">Tab 1</app-tab>
    <app-tab tabTitle="Tab 2">Tab 1</app-tab>
  </app-tabs-container>`
})
class TestHostComponent { }

describe('TabsContainerComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        TestHostComponent,
        TabComponent,
        TabsContainerComponent
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have two tabs', () => {
    // Method 1: directly select list components:
    const tabs = fixture.debugElement.queryAll(By.css('li'));
    expect(tabs.length)
    .withContext("[FAIL] Tabs did not render")
    .toBe(2);

    // Method 2: Use directive:
    const containerComponent = fixture.debugElement.query(
      // Use directive to select specified component instances from the template
      By.directive(TabsContainerComponent)
    );
    // Grab the tabs Properties:
    const tabsProp = containerComponent.componentInstance.tabs;
    expect(tabsProp.length)
    .withContext("[FAIL] Could not grab component properties")
    .toBe(2);
  });
});
