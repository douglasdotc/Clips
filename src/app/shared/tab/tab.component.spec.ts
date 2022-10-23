import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TabComponent } from './tab.component';

describe('TabComponent', () => {
  let component: TabComponent;
  let fixture: ComponentFixture<TabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have .hidden class', () => {
    // debugElement is a representation of the template as a object,
    // can be used without a browser:
    const element = fixture.debugElement.query(
      By.css('.hidden')
    );

    expect(element).toBeTruthy();
  });

  it('should not have .hidden class', () => {
    // Toggle the hidden element:
    component.active = true;
    // Detect property change:
    fixture.detectChanges();

    const element = fixture.debugElement.query(
      By.css('.hidden')
    );

    // Expect the element is not hidden:
    expect(element).not.toBeTruthy();
  });
});
