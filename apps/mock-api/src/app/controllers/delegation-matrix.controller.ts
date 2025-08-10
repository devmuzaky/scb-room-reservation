import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { DelegationResponse } from '../models/delegation-matrix.model';
import { DelegationMatrixService } from '../services/delegation-matrix.service';

@Controller('delegation')
@UseGuards(JwtAuthGuard)
export class DelegationMatrixController {
  constructor(private readonly dService: DelegationMatrixService) {}

  @Get('/list')
  @HttpCode(HttpStatus.OK)
  getChequeBookRequests(@Query('pageStart') pageStart = 0, @Query('pageSize') pageSize = 10): DelegationResponse {
    return this.dService.getDelegationList({
      pageStart: Number(pageStart),
      pageSize: Number(pageSize),
    });
  }

  @Post('/withdraw')
  @HttpCode(HttpStatus.OK)
  withdraw(@Body('transactionId') transactionId: string) {
    return { message: 'withdraw successfully' };
  }
}
