import { Controller, Get, HttpCode, HttpStatus, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { DepositsService } from '../services/deposits.service';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DepositsController {
  constructor(private readonly depositsService: DepositsService) {}

  @Get('deposits/certificates-list/user')
  @HttpCode(HttpStatus.OK)
  getCertificates(
    @Param('username') username: string,
    @Query('currency') currency: string,
    @Query('page') page: string,
    @Query('size') size: string,
  ) {
    return this.depositsService.getCertificates(username, currency, page, size);
  }

  @Get('accounts/tdoverview')
  @HttpCode(HttpStatus.OK)
  getTimeDeposits(
    @Query('username') username: string,
    @Query('currency') currency: string,
    @Query('page') page: number,
    @Query('size') size: number,
  ) {
    return this.depositsService.getTimeDeposits(username, currency, page, size);
  }

  @Get('account/certificates/:tdNumber')
  @HttpCode(HttpStatus.OK)
  getTimeDepositsDetails(
    @Param('tdNumber') tdNumber: string,
    @Query('username') username: string,
    @Query('currency') currency: string,
    @Query('page') page: string,
    @Query('size') size: string,
  ) {
    return this.depositsService.getTimeDepositsDetails(tdNumber, username, currency, page, size);
  }

  @Get('files/export/td/user/format/:format')
  @HttpCode(HttpStatus.OK)
  getTimeDepositsPDF(
    @Param('username') username: string,
    @Param('format') format: string,
    @Query('currency') currency: string,
    @Query('page') page: string,
    @Query('size') size: string,
  ) {
    return this.depositsService.getTimeDepositsPDF(username, format, currency, page, size);
  }

  @Get('lookup/tnc')
  @HttpCode(HttpStatus.OK)
  getTnc() {
    return this.depositsService.tnc();
  }
}
