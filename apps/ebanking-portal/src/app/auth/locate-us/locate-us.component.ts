import { NgClass } from '@angular/common';
import { httpResource } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  linkedSignal,
  signal,
  viewChild,
} from '@angular/core';
import { HeaderAuthComponent } from '@/layout/components';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { TranslocoDirective } from '@jsverse/transloco';
import { Autocomplete, AutocompleteInput } from '@scb/ui/autocomplete';
import { Badge } from '@scb/ui/badge';
import { Button } from '@scb/ui/button';
import { Card } from '@scb/ui/card';
import { FormField } from '@scb/ui/form-field';
import { Icon } from '@scb/ui/icon';
import { Option, Select, SelectTrigger } from '@scb/ui/select';
import { Selectable, SelectableItem } from '@scb/ui/selectable';
import { Spinner } from '@scb/ui/spinner';
import { Location, MapComponent } from './map.component';
import { Branch, LocateUsLocation, LocateUsTypes, searchResponse, ZonesGovernoratesResponse } from './models/locate-us';

@Component({
  selector: 'app-locate-us',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Icon,
    Card,
    Button,
    FormField,
    Select,
    SelectTrigger,
    Option,
    HeaderAuthComponent,
    Selectable,
    SelectableItem,
    AutocompleteInput,
    Autocomplete,
    Badge,
    TranslocoDirective,
    MapComponent,
    NgClass,
    Spinner,
  ],
  templateUrl: './locate-us.component.html',
})
export default class LocateUsComponent {
  // Dependencies
  readonly layoutFacade = inject(LayoutFacadeService);

  // ViewChild
  readonly mapElement = viewChild.required<MapComponent>('map');

  // State
  readonly lang = computed(() => this.layoutFacade.language());
  readonly selectedItem = signal<Branch | null>(null);
  readonly branchesData = httpResource<searchResponse>(() => {
    // this is required to call the api
    const [lang, option] = [this.lang(), this.selectedBranch()];
    return { url: '/api/dashboard/locate-us', params: { type: this.activeTab(), ...this.userCurrentLocation() } };
  });
  readonly branchList = computed<Branch[]>(() => this.branchesData.value()?.branches ?? []);
  readonly search = linkedSignal({ source: this.lang, computation: () => '' });
  readonly selectedBranch = linkedSignal({ source: this.lang, computation: () => '' });
  readonly branchesFiltered = computed(() => {
    const searchTerm = this.search().trim().toLowerCase();
    const list = this.branchList();
    const res = list.filter(item => item.searchData?.toLowerCase().includes(searchTerm));
    return res;
  });

  readonly zones = httpResource<ZonesGovernoratesResponse>(() => {
    const _ = this.lang();
    return '/api/dashboard/locate-us/zones';
  });

  readonly governorList = computed<string[]>(() => this.zones.value()?.governorates ?? []);
  readonly governorValue = linkedSignal({ source: this.lang, computation: () => [] as string[] });

  readonly areaList = computed<string[]>(() => this.zones.value()?.areas ?? []);
  readonly areaValue = linkedSignal({ source: this.lang, computation: () => [] as string[] });

  readonly activeTab = signal<LocateUsTypes.BRANCH | LocateUsTypes.ATM>(LocateUsTypes.BRANCH);
  readonly LocateUsTypesEnum = LocateUsTypes;
  readonly userCurrentLocation = signal<LocateUsLocation>({ latitude: '', longitude: '' });

  readonly showApplyFilters = linkedSignal(() => {
    const gValuesLen = this.governorValue().length;
    const aValuesLen = this.areaValue().length;
    return !!gValuesLen || !!aValuesLen;
  });
  readonly showClearFilters = linkedSignal({ source: this.lang, computation: () => false as boolean });

  readonly branchLocationsData = httpResource<searchResponse>(() => {
    return {
      url: '/api/dashboard/locate-us/search',
      method: 'POST',
      body: {
        branchType: this.activeTab(),
        searchText: this.selectedBranch(),
        ...this.userCurrentLocation(),
        searchFilters: [...this.governorValue(), ...this.areaValue()],
      },
    };
  });

  readonly branchLocations = computed(() => this.branchLocationsData.value()?.branches ?? []);
  readonly branchMapLocations = computed<Location[]>(() => {
    return this.branchLocations().map(item => ({
      lat: parseFloat(item.latitude),
      lng: parseFloat(item.longitude),
      name: item.title,
      address: item.address,
    }));
  });
  readonly locationPermission = true;

  readonly darkMode = signal(this.layoutFacade.isDarkTheme());
  readonly scrollPosition = signal(0);
  readonly filterContainer = viewChild.required<ElementRef>('filterContainer');
  readonly applyBtnElement = viewChild<ElementRef>('applyBtn');
  readonly scrollAtApplyBtn = computed(() => {
    this.applyBtnElement();
    this.governorValue();
    this.areaValue();
    this.scrollRight();
    return;
  });

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event): void {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    this.scrollPosition.set(scrollPosition);
  }

  scrollRight() {
    if (this.filterContainer()) {
      const container = this.filterContainer().nativeElement;
      if (this.lang() === 'en') {
        container.scrollLeft = container.scrollWidth;
      } else {
        container.scrollLeft = -container.scrollWidth;
      }
    }
  }

  clearFilters() {
    this.governorValue.set([]);
    this.areaValue.set([]);
    this.showClearFilters.set(false);
    this.branchLocationsData.reload();
  }

  clearSearch() {
    this.selectedBranch.set('');
    this.search.set('');
  }

  showInfoIcon(item: Branch) {
    this.selectedItem.set(item);
    const location: Location = {
      lat: parseFloat(item.latitude),
      lng: parseFloat(item.longitude),
      name: item.title,
      address: item.address,
    };
    if (this.mapElement()) {
      this.mapElement().openLocationInfo(location);
    }
  }

  applyFilters() {
    this.showClearFilters.set(true);
    this.showApplyFilters.set(false);
    this.branchLocationsData.reload();
  }

  currentLocation(position: GeolocationPosition) {
    const { latitude, longitude } = position.coords;
    this.userCurrentLocation.set({ latitude: latitude.toString(), longitude: longitude.toString() });
  }
}
