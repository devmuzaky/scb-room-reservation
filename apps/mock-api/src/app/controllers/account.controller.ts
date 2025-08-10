import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CSVResponse, PDFResponse } from '../models/accounts-list';
import { ACCOUNT_DETAILS, AD_ALL_LIST } from '../models/dashboard';
import { AccountService } from '../services/account.service';

@Controller('dashboard/accounts')
@UseGuards(JwtAuthGuard)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('overview/user')
  @HttpCode(HttpStatus.OK)
  getAccountOverview() {
    return this.accountService.getAccountOverview();
  }

  @Get('list/user')
  @HttpCode(HttpStatus.OK)
  getAccountsList(
    @Param('username') username: string,
    @Query('currency') currency: string,
    @Query('page') page: string,
    @Query('size') size: string,
  ) {
    const pageNumber = parseInt(page, 10);
    const pageSizeNumber = parseInt(size, 10);

    if (isNaN(pageNumber) || isNaN(pageSizeNumber)) {
      return { error: 'Invalid page or pageSize' };
    }

    return this.accountService.paginateAccounts(pageNumber, pageSizeNumber, currency);
  }

  @Get('all')
  @HttpCode(HttpStatus.OK)
  getAllAccountsAndDeposits(
    @Param('username') username: string,
    @Query('page') page: string,
    @Query('size') size: string,
  ) {
    return AD_ALL_LIST;
  }

  @Get('files/export/user/format/:format')
  @HttpCode(HttpStatus.OK)
  downloadFileAccountList(
    @Param('username') username: string,
    @Param('format') format: string,
    @Query('currency') currency: string,
    @Query('page') page: string,
    @Query('size') size: string,
  ) {
    if (format === 'pdf') return { file: PDFResponse };
    else return { file: CSVResponse };
  }

  @Post('account-details/pdf')
  @HttpCode(HttpStatus.OK)
  getAccountDetailsPDF(@Body('accountNumber') accountNumber: string) {
    return { pdfBase64: PDFResponse };
  }

  @Get(':accountnumber/details')
  @HttpCode(HttpStatus.OK)
  getAccountDetails(@Param('accountnumber') accountnumber: string) {
    return ACCOUNT_DETAILS;
  }

  @Get(':accountId/transactions')
  @HttpCode(HttpStatus.OK)
  getTransactions(
    @Param('accountId') accountId: string,
    @Query('pageNo') pageNo: string,
    @Query('pageSize') pageSize: string,
    @Query('transactionTypes') transactionTypes?: string,
    @Query('type') type?: string,
    @Query('status') status?: string,
  ) {
    const pageNumber = parseInt(pageNo, 10);
    const pageSizeNumber = parseInt(pageSize, 10);

    if (isNaN(pageNumber) || isNaN(pageSizeNumber)) {
      return { error: 'Invalid page or pageSize' };
    }

    const transactionType = Array.isArray(transactionTypes) ? transactionTypes.join(',') : transactionTypes;

    return this.accountService.paginateTransactions(
      pageNumber,
      pageSizeNumber,
      accountId,
      transactionType,
      type,
      status,
    );
  }
}
