import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { LookupsService } from '../services/lookups.service';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class LookupsController {
  constructor(private readonly lookupsService: LookupsService) {}

  @Get('/lookups/banks/bank-list')
  getBankList() {
    return this.lookupsService.getBankList();
  }
}
