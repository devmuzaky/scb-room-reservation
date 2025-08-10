import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ChequebookApiResponse } from '../models/chequebook.model';
import { ChequeBookService } from '../services/chequebook.service';

@Controller('product')
@UseGuards(JwtAuthGuard)
export class ChequeBookController {
  constructor(private readonly chequeBookService: ChequeBookService) {}

  @Get('/chequebooks/list')
  getChequeBookRequests(
    @Query('status') status: string[] = [],
    @Query('pageStart') pageStart = 0,
    @Query('pageSize') pageSize = 10,
  ): ChequebookApiResponse {
    return this.chequeBookService.getChequeBookRequestsList({
      status,
      pageStart: Number(pageStart),
      pageSize: Number(pageSize),
    });
  }

  @Get('/chequebooks/detail')
  getAccount(@Query('accountId') accountId: string) {
    return this.chequeBookService.getChequeBookDetails();
  }

  @Get('chequebooks/accounts')
  getToAccountsList(@Query('pageStart') pageStart = 0, @Query('pageSize') pageSize = 10) {
    return this.chequeBookService.getLinkedAccountsList(pageStart, pageSize);
  }

  @Get('/tandc')
  getTermsAndConditions(@Query('lang') lang: string) {
    return this.chequeBookService.getTermsAndConditions(lang);
  }

  @Post('chequebooks/fee')
  getChequeBookFee(@Body() body: { numberOfChequebooks: number; numberOfLeaves: number }) {
    const { numberOfChequebooks, numberOfLeaves } = body;

    return this.chequeBookService.calculateFee(numberOfChequebooks, numberOfLeaves);
  }

  @Post('chequebooks/issue')
  saveChequeBookRequest(@Body() body: { numberOfChequebooks: number; numberOfLeaves: number }) {
    const { numberOfChequebooks, numberOfLeaves } = body;

    return this.chequeBookService.calculateFee(numberOfChequebooks, numberOfLeaves);
  }

  @Get('chequebooks/branch-info')
  getBranchInfo(@Query('accountNumber') accountNumber: number) {
    return this.chequeBookService.getBranchInfo(accountNumber);
  }
  // @Get('chequebooks/fee')
  // getChequeBookFee(
  //   @Query('numberOfChequebooks') numberOfChequebooks: string,
  //   @Query('numberOfLeaves') numberOfLeaves: string,
  // ) {
  //   const books = Number(numberOfChequebooks);
  //   const leaves = Number(numberOfLeaves);

  //   return this.chequeBookService.calculateFee(books, leaves);
  // }
}
