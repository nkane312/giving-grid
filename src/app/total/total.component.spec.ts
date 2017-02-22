/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TotalComponent } from './total.component';

describe('TotalComponent', () => {
  let component: TotalComponent;
  let fixture: ComponentFixture<TotalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
