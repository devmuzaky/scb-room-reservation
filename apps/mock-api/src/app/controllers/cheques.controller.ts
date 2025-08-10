import { Controller, Get, HttpCode, HttpStatus, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ChequesService } from '../services/cheques.service';

@Controller('dashboard/cheques')
@UseGuards(JwtAuthGuard)
export class ChequesController {
  constructor(private readonly chequesService: ChequesService) {}

  @Get('cheques-out/user')
  @HttpCode(HttpStatus.OK)
  getChequeOutList(
    @Param('username') username: string,
    @Query('status') status: string,
    @Query('settlementDate') settlementDate: string,
    @Query('page') page: string,
    @Query('size') size: string,
  ) {
    return this.chequesService.getChequeOutList(username, status, settlementDate, page, size);
  }

  @Get('overview/cheques-out')
  @HttpCode(HttpStatus.OK)
  getChequeOut(@Param('username') username: string) {
    return this.chequesService.getChequeOut(username);
  }

  @Get('overview/cheques-In')
  @HttpCode(HttpStatus.OK)
  getChequeIn(
    @Query('username') username: string,
    @Query('status') status: string,
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
    @Query('page') page: string,
    @Query('size') size: string,
  ) {
    return this.chequesService.getChequeIn(username, status, fromDate, toDate, page, size);
  }
}
