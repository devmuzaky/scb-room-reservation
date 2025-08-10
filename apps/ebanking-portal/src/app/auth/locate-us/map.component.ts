import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { AppConfigService } from '@/config/app-config.service';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { darkModeStyles } from './dark-mode-map-styles';

// eslint-disable-next-line no-var
declare var google: any;

export interface Location {
  lat: number;
  lng: number;
  name: string;
  address: string;
}

@Component({
  selector: 'scb-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      id="googleMap"
      class="h-full max-h-[628px] min-h-[628px] rounded-2xl"></div>
  `,
})
export class MapComponent implements AfterViewInit {
  readonly locations = input<Location[]>([]);
  readonly askLocationAPermission = input<boolean>(false);
  readonly layoutFacade = inject(LayoutFacadeService);
  readonly userLocation = output<GeolocationPosition>();
  private readonly darkMode = computed(() => this.layoutFacade.isDarkTheme());
  private redirectImg = computed(() => (this.layoutFacade.isDarkTheme() ? 'redirect.svg' : 'redirect_black.svg'));
  private readonly configService = inject(AppConfigService);
  private readonly document = inject(DOCUMENT);
  map: any;
  markers: any[] = [];
  infoWindows: any[] = [];

  constructor() {
    effect(() => {
      const theme = this.darkMode() && this.map ? darkModeStyles : [];
      this.map?.setOptions({ styles: theme });
      if (this.locations()) {
        this.updateMarkers(this.locations());
      }
    });
  }

  ngAfterViewInit(): void {
    this.loadGoogleMapsApi();
    if (this.askLocationAPermission()) {
      this.getUserLocation();
    }
  }

  loadGoogleMapsApi() {
    const scriptEl = this.document.createElement('script');
    scriptEl.src = `https://maps.googleapis.com/maps/api/js?key=${this.configService.config.mapAPIKey}&libraries=marker`;
    scriptEl.async = true;
    scriptEl.defer = true;
    scriptEl.type = 'text/javascript';
    this.document.getElementById('googleMap')?.append(scriptEl);
    scriptEl.onload = load => {
      this.initMap();
    };
  }

  initMap(): void {
    const mapOptions = {
      center: { lat: 30.033333, lng: 31.233334 },
      zoom: 12,
      styles: this.darkMode() ? darkModeStyles : [],
      disableDefaultUI: true,
    };
    this.map = new google.maps.Map(document.getElementById('googleMap') as HTMLElement, mapOptions);

    this.locations().forEach((location: Location) => {
      this.createMarker(location);
    });
  }

  createMarker(location: Location): void {
    const marker = new google.maps.Marker({
      position: { lat: location.lat, lng: location.lng },
      map: this.map,
    });

    const infoWindowContent = this.createInfoWindowContent(location);

    const infoWindow = new google.maps.InfoWindow({
      content: infoWindowContent,
      disableAutoPan: true,
      headerDisabled: true,
    });

    marker.addListener('click', () => {
      infoWindow.open({
        anchor: marker,
      });
    });

    this.infoWindows.push({ marker, infoWindow });

    google.maps.event.addListener(infoWindow, 'domready', () => {
      const infoWindowElement = document.querySelector('.gm-style-iw') as HTMLElement;
      if (infoWindowElement) {
        infoWindowElement.addEventListener('mouseleave', () => {
          infoWindow.close();
        });
      }
    });
    this.markers.push(marker);
  }

  clearMarkers(): void {
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];
    this.infoWindows.forEach(infoWindowObj => infoWindowObj.infoWindow.close());
    this.infoWindows = [];
  }

  createInfoWindowContent(location: Location): string {
    return `
      <div class="bg-background">
        <div class="flex items-center text-text-primary text-base font-semibold font-['noto'] mb-2">
          <span>${location.name}</span>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}" target="_blank" class="ml-2">
            <img src="${this.redirectImg()}" alt="export" class=" mx-sm info-window-image w-[16px] h-[16px] cursor-pointer">
          </a>
        </div>
        <div class="text-sm text-text-secondary font-['noto']">${location.address || 'No address available'}</div>
      </div>
    `;
  }

  openLocationInfo(location: Location): void {
    this.infoWindows.forEach(infoWindowObj => infoWindowObj.infoWindow.close());
    const targetInfoWindow = this.infoWindows.find(infoWindowObj => {
      return (
        infoWindowObj.marker.getPosition().lat() === location.lat &&
        infoWindowObj.marker.getPosition().lng() === location.lng
      );
    });

    if (targetInfoWindow) {
      this.map.setOptions({ center: { lat: location.lat, lng: location.lng }, zoom: 16 });
      targetInfoWindow.infoWindow.open(this.map, targetInfoWindow.marker);
    } else {
      console.warn('Location not found on the map');
    }
  }

  updateMarkers(locations: Location[]): void {
    if (this.map) {
      this.clearMarkers();
      locations.forEach((location: Location) => {
        this.createMarker(location);
      });
    }
  }

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
        if (this.map) {
          this.map.setOptions({
            center: { lat: position.coords.latitude, lng: position.coords.longitude, zoom: 16 },
          });
        }
        this.userLocation.emit(position);
      });
    } else {
      console.log('Geolocation not supported');
    }
  }
}
