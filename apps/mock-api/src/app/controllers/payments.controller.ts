import { Controller, Get, HttpCode, HttpStatus, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PaymentsService } from '../services/payments.service';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('overdrafts/upcomingDues/accountNumber/:accountNumber')
  getUpcoming(
    @Param('accountNumber') accountNumber: string,
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
    @Query('pageStart') pageStart: string,
    @Query('pageSize') pageSize: string,
  ) {
    return this.paymentsService.paginateUpcomingList(accountNumber, fromDate, toDate, pageStart, pageSize);
  }

  @Get('loans/schedule/:account')
  @HttpCode(HttpStatus.OK)
  getLoansRepaymentList(
    @Param('account') account: string,
    @Query('status') status: string,
    @Query('pageStart') pageStart: string,
    @Query('pageSize') pageSize: string,
  ) {
    return this.paymentsService.paginateRepaymentsList(account, status, pageStart, pageSize);
  }

  @Get('files/export/overdrafts/upcomingDues/accountNumber/:accountNumber/format/:format')
  @HttpCode(HttpStatus.OK)
  downloadFileUpcomingList(@Param('accountNumber') accountNumber: string, @Param('format') format: string) {
    return this.paymentsService.downloadFileUpcomingList(accountNumber, format);
  }
}
