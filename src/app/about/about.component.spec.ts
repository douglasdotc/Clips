import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutComponent } from './about.component';

describe('AboutComponent', () => {
  // A fixture is a wrapper to access the properties and elements of the component:
  // Each test should have a unique instance of the component.
  let fixture: ComponentFixture<AboutComponent>;

  // Unique instance of the component:
  let component: AboutComponent;

  // Before running each tests:
  beforeEach(async () => {
    // Initialize and compile a module to load both the class and template:
    await TestBed.configureTestingModule({
      declarations: [ AboutComponent ]
    })
    .compileComponents();

    // create the fixture of the component:
    fixture = TestBed.createComponent(AboutComponent);
    // Get an unique instance of the component:
    component = fixture.componentInstance;
    // Synchronize component properties and template
    fixture.detectChanges();
  });

  // Sanity test that the component is created:
  it('should create', () => {
    expect(component).toBeTruthy();
  })
});
