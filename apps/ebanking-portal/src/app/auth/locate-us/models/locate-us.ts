export interface searchPayloadRequest {
  searchFilters?: string[];
  searchText?: string;
  branchType: LocateUsTypes.BRANCH | LocateUsTypes.ATM;
  longitude?: string;
  latitude?: string;
}

export interface searchResponse {
  branches: Branch[];
}

export interface Branch {
  Id: number;
  title: string;
  zone: string;
  address: string;
  searchData?: string;
  latitude: string;
  longitude: string;
  openHours?: string;
  atmServices?: string[];
  atmType?: string;
  distanceInKm?: string;
}

export enum LocateUsTypes {
  BRANCH = 'BRANCH',
  ATM = 'ATM',
}

export interface LocateUsLocation {
  latitude: string;
  longitude: string;
}

export interface ZonesGovernoratesResponse {
  governorates: string[];
  areas: string[];
}
