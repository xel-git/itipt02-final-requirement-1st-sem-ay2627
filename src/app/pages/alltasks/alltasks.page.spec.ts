import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlltasksPage } from './alltasks.page';

describe('AlltasksPage', () => {
  let component: AlltasksPage;
  let fixture: ComponentFixture<AlltasksPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AlltasksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
