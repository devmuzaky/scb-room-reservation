import { Body, Controller, Get, Headers, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import {
  CharityCategoriesResponseDTO,
  CharityListResponseDTO,
  RecurringTransferRequestDTO,
  RecurringTransferResponseDTO,
  TransferRequestDTO,
  TransferResponseDTO,
} from '../models/transfers.models';
import { TransferService } from '../services/transfer.service';

@Controller('transfer')
@UseGuards(JwtAuthGuard)
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Get('/accounts/from')
  getFromAccountsList(
    @Query('currency') currency: string,
    @Query('pageStart') pageStart = 0,
    @Query('pageSize') pageSize = 10,
  ) {
    return this.transferService.getFromAccountsList(currency, pageStart, pageSize);
  }

  @Get('/accounts/to')
  getToAccountsList(@Query('pageStart') pageStart = 0, @Query('pageSize') pageSize = 10) {
    return this.transferService.getToAccountsList(pageStart, pageSize);
  }

  @Get('/lookup/transfer-data')
  getTransferData(@Headers('Accept-Language') lang: string) {
    return this.transferService.getTransferData(lang);
  }

  @Post('/fees/calculate')
  feesCalculate(@Body() body: { transferAmount: number }) {
    return { fees: body.transferAmount * 0.01 };
  }

  @Get('/reason/list')
  getReasons() {
    return this.transferService.getReasons();
  }

  @Post('/recurring/calculate')
  calculateRecurringTransfer(@Body() body: RecurringTransferRequestDTO): RecurringTransferResponseDTO {
    return this.transferService.calculateRecurringTransfer(body);
  }

  @Post('/transfers/create')
  createTransfer(@Body() body: TransferRequestDTO): TransferResponseDTO {
    return this.transferService.createTransfer(body);
  }

  @Post('/beneficiary/list')
  beneficiaryList() {
    return this.transferService.getBeneficiaryList();
  }

  @Get('/transfers/history')
  getTransferHistory(
    @Query('transferType') transferType: string,
    @Query('transferStatus') transferStatus: string,
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
    @Query('pageStart') pageStart = 0,
    @Query('pageSize') pageSize = 10,
    @Headers('Accept-Language') lang: string,
  ) {
    return this.transferService.getTransferHistory({
      transferType,
      transferStatus,
      fromDate,
      toDate,
      pageStart: Number(pageStart),
      pageSize: Number(pageSize),
      lang,
    });
  }

  @Get('/transfers/recurring/list')
  getOneTimeTransferList(
    @Query('transferType') transferType: string,
    @Query('transferStatus') transferStatus: string,
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
    @Query('pageStart') pageStart = 0,
    @Query('pageSize') pageSize = 100,
  ) {
    return this.transferService.getScheduledTransfersList({
      transferType,
      transferStatus,
      fromDate,
      toDate,
      pageStart: Number(pageStart),
      pageSize: Number(pageSize),
    });
  }

  @Get('/transfers/details/:transferId')
  getTransferDetails() {
    return this.transferService.getTransferDetails();
  }

  @Put('transfers/schedule/:scheduleId/cancel-all')
  getCancelAllTransfer() {
    return true;
  }

  @Put('transfers/cancel/:transferId')
  getCancelTransfer() {
    return true;
  }

  @Get('transfers/recurring/details/:scheduleId')
  getRecurringDetails() {
    return this.transferService.getRecurringDetails();
  }

  @Get(`/transfers/schedule/:scheduleId/upcoming`)
  getUpcomingTransfers() {
    return this.transferService.getUpcomingTransfers();
  }

  @Get('/charity/list')
  getCharityList(): CharityListResponseDTO {
    return this.transferService.getCharityList();
  }

  @Get('/charity/categories/:customerId')
  getCharityCategories(@Param('customerId') customerId: string): CharityCategoriesResponseDTO {
    return this.transferService.getCharityCategories(customerId);
  }
}
