import { HttpClient } from '@angular/common/http';
import { Component, input, output, signal } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideTestTransloco } from '@/config/transloco.testing';
import { AppLanguage } from '@/layout/layout-store';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { httpFakeResponse } from '@/models/api';
import { fakeService, render, RenderResult } from '@scb/util/testing';
import LocateUsComponent from './locate-us.component';
import { MapComponent } from './map.component';
import { Branch, LocateUsTypes, searchResponse } from './models/locate-us';

@Component({
  selector: 'scb-map',
  template: `<div id="googleMap"></div>`,
})
class MockMapComponent {
  locations = input<Location[]>();
  userLocation = output<GeolocationPosition>();
  darkMode = signal(true);
  askLocationAPermission = input<boolean>();
  openLocationInfo = jest.fn();
}

const layoutFacadeStub = fakeService(LayoutFacadeService, () => {
  const isDarkTheme = signal(true);
  const language = signal<AppLanguage>('en');
  return {
    isDarkTheme,
    language,
    __: { language, isDarkTheme },
  };
});

const httpStub = fakeService(HttpClient, {
  request: httpFakeResponse({}),
});

describe('LocateUsComponent', () => {
  let view: RenderResult<LocateUsComponent>;
  let component: LocateUsComponent;

  beforeEach(async () => {
    view = await render(
      LocateUsComponent,
      [provideTestTransloco(), provideRouter([]), provideNoopAnimations(), httpStub, layoutFacadeStub],
      { components: [[{ imports: [MapComponent] }, { imports: [MockMapComponent] }]] },
    );
    component = view.host;
    view.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call openLocationInfo when showInfoIcon is invoked', () => {
    const mockBranch: Branch = {
      Id: 1,
      latitude: '30.033333',
      longitude: '31.233334',
      title: 'title branch',
      address: 'address branch',
      zone: 'test',
    };
    view.detectChanges();
    component.showInfoIcon(mockBranch);
    expect(component.mapElement().openLocationInfo).toHaveBeenCalled();
  });

  it('should call currentLocation with the correct event', () => {
    const mockEvent: GeolocationPosition = {
      coords: {
        latitude: 30.033333,
        longitude: 31.233334,
        altitude: 100,
        accuracy: 10,
        altitudeAccuracy: 50,
        heading: 90,
        speed: 0,
        toJSON: jest.fn(),
      },
      toJSON: jest.fn(),
      timestamp: Date.now(),
    };

    const spy = jest.spyOn(component, 'currentLocation');
    component.mapElement().userLocation.emit(mockEvent);

    expect(spy).toHaveBeenCalledWith(mockEvent);
  });

  it('should toggle search type between branch or atm', () => {
    const branchOption = view.$('.test-branchSelect');
    const atmOption = view.$('.test-atmSelect');
    branchOption.click();
    view.detectChanges();
    expect(component.activeTab()).toEqual(LocateUsTypes.BRANCH);
    atmOption.click();
    view.detectChanges();
    expect(component.activeTab()).toEqual(LocateUsTypes.ATM);
  });

  it('should clear governorate and area values and hide clear filters button', () => {
    component.governorValue.set(['Cairo']);
    component.areaValue.set(['Maadi']);
    component.showClearFilters.set(true);

    component.clearFilters();

    expect(component.governorValue()).toEqual([]);
    expect(component.areaValue()).toEqual([]);
    expect(component.showClearFilters()).toBe(false);
  });

  it('should clear search and option signals', () => {
    component.search.set('Test search');
    component.selectedBranch.set('Test option');

    component.clearSearch();

    expect(component.search()).toBe('');
    expect(component.selectedBranch()).toBe('');
  });

  it('should set filters and trigger searchLocateUs', () => {
    jest.spyOn(component.branchLocationsData, 'reload');

    component.showApplyFilters.set(true);
    component.showClearFilters.set(false);
    component.applyFilters();

    expect(component.showApplyFilters()).toBe(false);
    expect(component.showClearFilters()).toBe(true);
    expect(component.branchLocationsData.reload).toHaveBeenCalled();
  });

  it('should set the language when layoutFacadeService language changes', () => {
    layoutFacadeStub._.language.set('ar');
    view.detectChanges();

    expect(component.lang()).toBe('ar');
  });

  it('should toggle filters visibility when governorValue or areaValue change', () => {
    component.governorValue.set(['Cairo']);
    view.detectChanges();

    expect(component.showApplyFilters()).toBe(true);
    expect(component.showClearFilters()).toBe(false);
  });

  it('should clear filters and call searchLocateUs on clearFiltersBtnClick', () => {
    jest.spyOn(component.branchLocationsData, 'reload');

    component.governorValue.set(['Cairo']);
    component.clearFilters();

    expect(component.governorValue()).toEqual([]);
    expect(component.areaValue()).toEqual([]);
    expect(component.showClearFilters()).toBe(false);
    expect(component.branchLocationsData.reload).toHaveBeenCalled();
  });

  it('should call LocateUsService with correct payload when applyFilters is invoked', () => {
    jest.spyOn(component.branchLocationsData, 'reload');

    component.governorValue.set(['Cairo']);
    component.areaValue.set(['Maadi']);
    component.applyFilters();

    expect(component.showApplyFilters()).toBe(false);
    expect(component.showClearFilters()).toBe(true);
    expect(component.branchLocationsData.reload).toHaveBeenCalled();
  });

  it('should update autoCompleteResults on writing search', async () => {
    const branches = [
      { Id: 1, title: 'Maadi', address: 'bar', latitude: '10', longitude: '10', zone: 'cairo', searchData: 'Maadi' },
    ];
    httpStub.v.request = httpFakeResponse({ branches });
    component.branchesData.reload();
    await view.whenStable();
    const searchInput = view.$<HTMLInputElement>('.test-searchInput');
    searchInput.input('Maa');
    expect(component.branchesFiltered()).toEqual(branches);
  });

  it('should update autoCompleteResults on writing search with empty search data', async () => {
    const branches = [
      { Id: 1, title: 'Maadi', address: 'bar', latitude: '10', longitude: '10', zone: 'cairo', searchData: undefined },
    ];
    httpStub.v.request = httpFakeResponse(branches);
    component.branchesData.reload();
    await view.whenStable();
    const searchInput = view.$<HTMLInputElement>('.test-searchInput');
    searchInput.input('Maa');
    expect(component.branchesFiltered()).toEqual([]);
  });

  it('should fetch zones on getZones', async () => {
    const mockZones = {
      governorates: ['Cairo', 'Alexandria'],
      areas: ['Maadi', 'Heliopolis'],
    };
    httpStub.v.request = httpFakeResponse(mockZones);
    component.zones.reload();
    await view.whenStable();
    expect(component.governorList()).toEqual(mockZones.governorates);
    expect(component.areaList()).toEqual(mockZones.areas);
  });

  it('should handle searchLocateUs response correctly', async () => {
    const mockResponse = {
      branches: [
        {
          Id: 1,
          latitude: '30.033333',
          longitude: '31.233334',
          title: 'Branch 1',
          address: 'Address 1',
          zone: 'cairo',
          searchData: 'Maadi',
        },
        {
          Id: 2,
          latitude: '31.033333',
          longitude: '32.233334',
          title: 'Branch 2',
          address: 'Address 2',
          zone: 'cairo',
          searchData: 'Maadi',
        },
      ],
    };

    httpStub.v.request = httpFakeResponse(mockResponse);
    component.branchLocationsData.reload();
    await view.whenStable();
    expect(component.branchLocations()).toEqual(mockResponse.branches);
    expect(component.branchMapLocations()).toEqual(
      mockResponse.branches.map(branch => ({
        lat: parseFloat(branch.latitude),
        lng: parseFloat(branch.longitude),
        name: branch.title,
        address: branch.address,
      })),
    );
    expect(component.branchLocationsData.isLoading()).toBe(false);
  });

  it('should getLocateUsAutoComplete and set branches value successfully', async () => {
    const branches: searchResponse = {
      branches: [
        { Id: 1, title: 'Maadi', address: 'bar', latitude: '10', longitude: '10', zone: 'cairo', searchData: 'Maadi' },
      ],
    };
    httpStub.v.request = httpFakeResponse(branches);
    component.userCurrentLocation.set({ longitude: '1231', latitude: '1231' });
    await view.whenStable();
    expect(component.branchList()).toEqual(branches.branches);
  });

  it('should handel errors on search locate us', async () => {
    // Simulate a 404 error response
    const errorDetail = {
      code: 'Not Fount',
      message: '',
    };
    httpStub.v.request = httpFakeResponse({ message: errorDetail.message, code: 'Not Found' }, true);
    component.userCurrentLocation.set({ longitude: '1231', latitude: '1231' });
    component.governorValue.set(['Cairo']);
    component.areaValue.set(['Maadi']);
    await view.whenStable();
    // component.searchLocateUs(LocateUsTypes.BRANCH, 'Maadi');
    expect(component.branchLocationsData.isLoading()).toBe(false);
    expect(component.branchLocationsData.error()).toBeDefined();
  });

  it('should set autoCompleteResults to be empty on empty text', async () => {
    const branches = [
      { Id: 1, title: 'Maadi', address: 'bar', latitude: '10', longitude: '10', zone: 'cairo', searchData: 'Maadi' },
      { Id: 1, title: 'foo', address: 'bar', latitude: '10', longitude: '10', zone: 'cairo' },
    ];
    httpStub.v.request = httpFakeResponse({ branches });
    await view.whenStable();
    component.search.set('Zamalek');
    expect(component.branchesFiltered()).toEqual([]);
  });

  it('should update scrollPosition when window scroll event is triggered', () => {
    const scrollY = 150;
    Object.defineProperty(window, 'scrollY', { value: scrollY, writable: true });
    Object.defineProperty(document.documentElement, 'scrollTop', { value: scrollY, writable: true });
    const scrollEvent = new Event('scroll');
    component.onScroll(scrollEvent);
    expect(component.scrollPosition()).toBe(scrollY);
  });

  it('should update scrollPosition when window scroll event is triggered and window.scrollY undefined', () => {
    const scrollY = 150;
    Object.defineProperty(window, 'scrollY', { value: undefined, writable: true });
    Object.defineProperty(document.documentElement, 'scrollTop', { value: scrollY, writable: true });
    const scrollEvent = new Event('scroll');
    component.onScroll(scrollEvent);
    expect(component.scrollPosition()).toBe(scrollY);
  });

  it('should scroll right to scrollWidth when language is "en"', () => {
    layoutFacadeStub._.language.set('en');
    const mockNativeElement = {
      scrollWidth: 100,
      scrollLeft: 0,
    };
    jest.spyOn(component, 'filterContainer').mockReturnValue({
      nativeElement: mockNativeElement,
    });
    view.detectChanges();
    component.scrollRight();
    expect(component.filterContainer()?.nativeElement.scrollLeft).toBe(100);
  });

  it('should scroll right to scrollWidth when language is "ar"', () => {
    layoutFacadeStub._.language.set('ar');
    const mockNativeElement = {
      scrollWidth: 100,
      scrollLeft: 0,
    };
    jest.spyOn(component, 'filterContainer').mockReturnValue({
      nativeElement: mockNativeElement,
    });
    view.detectChanges();
    component.scrollRight();
    expect(component.filterContainer()?.nativeElement.scrollLeft).toBe(-100);
  });
});
