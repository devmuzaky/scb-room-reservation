import { Injectable } from '@nestjs/common';
import { EXCHANGE_RATE } from '../models/dashboard';

@Injectable()
export class ExchangeService {
  exchangeRate(username: string) {
    return EXCHANGE_RATE;
  }
}
