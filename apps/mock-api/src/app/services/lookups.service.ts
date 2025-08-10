import { Injectable } from '@nestjs/common';
import { BANK_LIST } from '../models/dashboard';

@Injectable()
export class LookupsService {
  getBankList() {
    return BANK_LIST;
  }
}
