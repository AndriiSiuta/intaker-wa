import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavouritesCityComponent } from './favourites-city.component';

describe('FavouritesCityComponent', () => {
  let component: FavouritesCityComponent;
  let fixture: ComponentFixture<FavouritesCityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavouritesCityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FavouritesCityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
