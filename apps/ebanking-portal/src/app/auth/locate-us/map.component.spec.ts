import { signal } from '@angular/core';
import { AppConfigService } from '@/config/app-config.service';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { fakeService, render, RenderResult } from '@scb/util/testing';
import { MapComponent } from './map.component';

declare let google: any;
const googleMock = {
  maps: {
    Map: jest.fn().mockImplementation(() => ({
      setOptions: jest.fn().mockImplementation(() => true),
      setCenter: jest.fn(),
      setZoom: jest.fn(),
    })),
    Marker: jest.fn().mockImplementation(() => ({
      setMap: jest.fn(),
      addListener: jest.fn().mockImplementation((event, callback) => {
        if (event === 'click') {
          callback();
        }
      }),
      dispatchEvent: jest.fn().mockImplementation(event => {
        if (event.type === 'click') {
          return;
        }
      }),
      getPosition: jest.fn().mockReturnValue({
        lat: jest.fn().mockReturnValue(30.1),
        lng: jest.fn().mockReturnValue(31.2),
      }),
    })),
    InfoWindow: jest.fn().mockImplementation(() => ({
      open: jest.fn(),
      close: jest.fn(),
    })),
    event: {
      addListener: jest.fn().mockImplementation((_, __, callback) => callback()),
    },
  },
};

const layoutFacadeStub = fakeService(LayoutFacadeService, () => {
  const isDarkTheme = signal(true);
  return {
    isDarkTheme,
    __: { isDarkTheme },
  };
});

const mockConfigService = fakeService(AppConfigService, {
  config: {
    mapAPIKey: 'dummy-api-key',
    apiUrl: 'http://dev-url.com',
    featureFlag: false,
    siteKey: 'test-site-key',
    idle: 1800,
    timeout: 30,
    keepalive: 900,
  },
});

describe('MapComponent', () => {
  let component: MapComponent;
  let view: RenderResult<MapComponent>;
  let mockDocument: Document;

  beforeEach(async () => {
    mockDocument = document.implementation.createHTMLDocument();
    view = await render(MapComponent, [
      { provide: Document, useValue: mockDocument },
      layoutFacadeStub,
      mockConfigService,
    ]);

    component = view.host;
    view.detectChanges();
  });

  beforeAll(() => {
    global.google = googleMock;
    Object.defineProperty(global.navigator, 'geolocation', {
      value: {
        getCurrentPosition: jest.fn(),
      },
      writable: true,
    });
  });

  it('should create the MapComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should set redirectImg to "redirect.svg" ', () => {
    layoutFacadeStub._.isDarkTheme.set(true);
    expect(component['redirectImg']()).toBe('redirect.svg');
  });

  it('should set redirectImg to "redirect_black.svg" ', () => {
    layoutFacadeStub._.isDarkTheme.set(false);
    expect(component['redirectImg']()).toBe('redirect_black.svg');
  });

  it('should call getUserLocation after ngAfterViewInit', () => {
    const getUserLocationSpy = jest.spyOn(component, 'getUserLocation');
    const loadGoogleMapsApiSpy = jest.spyOn(component, 'loadGoogleMapsApi');

    view.setInput('askLocationAPermission', true);
    view.detectChanges();

    component.ngAfterViewInit();

    expect(getUserLocationSpy).toHaveBeenCalled();
    expect(loadGoogleMapsApiSpy).toHaveBeenCalled();
  });

  it('should not call getUserLocation after ngAfterViewInit', () => {
    const getUserLocationSpy = jest.spyOn(component, 'getUserLocation');
    const loadGoogleMapsApiSpy = jest.spyOn(component, 'loadGoogleMapsApi');

    view.setInput('askLocationAPermission', false);
    view.detectChanges();

    component.ngAfterViewInit();

    expect(getUserLocationSpy).not.toHaveBeenCalled();
    expect(loadGoogleMapsApiSpy).toHaveBeenCalled();
  });

  it('should initialize the map with correct options', () => {
    component.initMap();
    layoutFacadeStub._.isDarkTheme.set(false);

    view.detectChanges();
    view.whenStable();

    layoutFacadeStub._.isDarkTheme.set(true);

    view.detectChanges();
    view.whenStable();

    expect(googleMock.maps.Map).toHaveBeenCalledWith(
      expect.any(HTMLElement),
      expect.objectContaining({
        center: expect.objectContaining({ lat: 30.033333, lng: 31.233334 }),
        zoom: 12,
      }),
    );
  });

  it('should create a marker on the map for each location', () => {
    const locations = [{ lat: 30.1, lng: 31.2, name: 'Test Location', address: 'Test Address' }];

    view.setInput('locations', locations);
    component.initMap();

    expect(googleMock.maps.Marker).toHaveBeenCalled();
    expect(googleMock.maps.Marker).toHaveBeenCalledWith(
      expect.objectContaining({
        position: { lat: 30.1, lng: 31.2 },
        map: component.map,
      }),
    );
  });

  it('should open the info window when a marker is clicked', () => {
    const locations = [{ lat: 30.1, lng: 31.2, name: 'Test Location', address: 'Test Address' }];

    view.setInput('locations', locations);
    component.initMap();

    const marker = component.infoWindows[0].marker;
    const infoWindow = component.infoWindows[0].infoWindow;
    marker.dispatchEvent({ tyep: 'click' });

    expect(infoWindow.open).toHaveBeenCalled();
  });

  it('should clear markers from the map', () => {
    const locations = [{ lat: 30.1, lng: 31.2, name: 'Test Location', address: 'Test Address' }];

    view.setInput('locations', locations);

    component.updateMarkers(locations);
    component.clearMarkers();

    expect(component.markers.length).toBe(0);
  });

  it('should create info window content with the correct location details', () => {
    const location = { lat: 30.033333, lng: 31.233334, name: 'Location', address: '123 Main St' };
    const infoWindowContent = component.createInfoWindowContent(location);

    expect(infoWindowContent).toContain(location.name);
    expect(infoWindowContent).toContain(location.address);
  });

  it('should create info window content with the No address available', () => {
    const location = { lat: 30.033333, lng: 31.233334, name: 'Location', address: '' };
    const infoWindowContent = component.createInfoWindowContent(location);

    expect(infoWindowContent).toContain(location.name);
    expect(infoWindowContent).toContain('No address available');
  });

  it('should open a location info window by location coordinates', () => {
    const location = { lat: 30.1, lng: 31.2, name: 'Test Location', address: 'Test Address' };
    component.initMap();

    view.setInput('locations', [location]);
    view.detectChanges();

    const targetInfoWindow = component.infoWindows[0];
    const marker = targetInfoWindow.marker;
    component.openLocationInfo(location);

    expect(marker.getPosition).toHaveBeenCalled();
    expect(targetInfoWindow.infoWindow.open).toHaveBeenCalled();
  });

  it('should log a warning when location is not found in the map', () => {
    const location = { lat: 40.7128, lng: -74.006, name: 'Nonexistent Location', address: 'Some Address' };

    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    component.infoWindows = [];
    component.openLocationInfo(location);

    expect(consoleWarnSpy).toHaveBeenCalledWith('Location not found on the map');
  });

  it('should update marker on the map', () => {
    const clearMarkerSpy = jest.spyOn(component, 'clearMarkers');
    const createMarkerSpy = jest.spyOn(component, 'createMarker');
    const locations = [{ lat: 30.1, lng: 31.2, name: 'Test Location', address: 'Test Address' }];
    const newLocations = [{ lat: 20.1, lng: 21.2, name: 'Test new Location', address: 'Test new Address' }];

    view.setInput('locations', locations);
    component.initMap();

    component.updateMarkers(newLocations);

    expect(clearMarkerSpy).toHaveBeenCalled();
    expect(createMarkerSpy).toHaveBeenCalledWith(
      expect.objectContaining({ lat: 20.1, lng: 21.2, name: 'Test new Location', address: 'Test new Address' }),
    );
  });

  it('should add a mouseleave event listener to the infoWindow element when it exists', () => {
    const location = { lat: 30.1, lng: 31.2, name: 'Test Location', address: 'Test Address' };

    const mockInfoWindowElement = document.createElement('div');
    mockInfoWindowElement.classList.add('gm-style-iw');
    jest.spyOn(document, 'querySelector').mockReturnValue(mockInfoWindowElement);
    const addListenerMock = jest
      .spyOn(google.maps.event, 'addListener')
      .mockImplementation((element, event, callback: any) => {
        if (event === 'domready') {
          callback();
        }
      });

    component.createMarker(location);

    expect(addListenerMock).toHaveBeenCalledWith(expect.any(Object), 'domready', expect.any(Function));

    const mouseleaveEvent = new Event('mouseleave');
    mockInfoWindowElement.dispatchEvent(mouseleaveEvent);

    expect(document.querySelector).toHaveBeenCalledWith('.gm-style-iw');
  });

  it('should handle geolocation success', () => {
    const mockPosition = {
      coords: { latitude: 30.033333, longitude: 31.233334 },
    };

    (navigator.geolocation.getCurrentPosition as jest.Mock).mockImplementationOnce(successCallback =>
      successCallback(mockPosition),
    );

    const userLocationEmitSpy = jest.spyOn(component.userLocation, 'emit');
    component.initMap();
    component.getUserLocation();

    expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
    expect(userLocationEmitSpy).toHaveBeenCalledWith(mockPosition);
  });

  it('should log "Geolocation not supported" if geolocation is not available', () => {
    Object.defineProperty(global.navigator, 'geolocation', {
      value: undefined,
      writable: true,
    });

    const consoleSpy = jest.spyOn(console, 'log');
    component.getUserLocation();

    expect(consoleSpy).toHaveBeenCalledWith('Geolocation not supported');
  });

  it('should handle script load success (onload)', () => {
    const initMapSpy = jest.spyOn(component, 'initMap').mockImplementation(jest.fn());
    jest.spyOn(component, 'askLocationAPermission').mockReturnValue(true);

    const mockEvent = {} as Event;

    const scriptElement = document.createElement('script');
    scriptElement.onload = jest.fn();
    scriptElement.onerror = jest.fn();

    const mockElement = { append: jest.fn() };
    jest.spyOn(document, 'getElementById').mockReturnValue(mockElement as any);

    document.createElement = jest.fn().mockReturnValue(scriptElement);

    component.loadGoogleMapsApi();

    expect(document.createElement).toHaveBeenCalledWith('script');
    expect(mockElement.append).toHaveBeenCalledWith(scriptElement);

    scriptElement.onload(mockEvent);

    expect(initMapSpy).toHaveBeenCalled();
  });
});
