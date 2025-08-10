import { Controller, Get, HttpCode, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ExchangeService } from '../services/exchange.service';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  @Get('exchange-rate/fetch')
  @HttpCode(HttpStatus.OK)
  exchangeRate(@Param('username') username: string) {
    return this.exchangeService.exchangeRate(username);
  }
}
