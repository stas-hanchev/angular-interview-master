import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAnswerModalComponent } from './show-answer-modal.component';

describe('ShowAnswerModalComponent', () => {
  let component: ShowAnswerModalComponent;
  let fixture: ComponentFixture<ShowAnswerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowAnswerModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowAnswerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
