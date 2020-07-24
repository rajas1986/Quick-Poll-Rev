import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PollTabComponent } from './poll-tab.component';

describe('PollTabComponent', () => {
  let component: PollTabComponent;
  let fixture: ComponentFixture<PollTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PollTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PollTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
