import { Injectable } from '@nestjs/common';
import { CHEQUES_IN, CHEQUES_OUT, CHEQUES_OUT_TRACKER } from '../models/dashboard';

@Injectable()
export class ChequesService {
  getChequeOutList(username: string, status?: string, settlementDate?: string, page?: string, size?: string) {
    return CHEQUES_OUT_TRACKER;
  }

  getChequeOut(username: string) {
    return CHEQUES_OUT;
  }

  getChequeIn(username: string, status?: string, fromDate?: string, toDate?: string, page?: string, size?: string) {
    return CHEQUES_IN;
  }
}
