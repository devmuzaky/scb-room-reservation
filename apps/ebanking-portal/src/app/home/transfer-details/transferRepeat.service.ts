import { Injectable, signal } from '@angular/core';
import { TransferDetailsDTO } from './Model/transfer-details.model';

@Injectable({
  providedIn: 'root',
})
export class TransferRepeatService {
  readonly repeatTransferData = signal<TransferDetailsDTO | null>(null);

  set(data: TransferDetailsDTO) {
    this.repeatTransferData.set(data);
  }

  clear() {
    this.repeatTransferData.set(null);
  }
}
