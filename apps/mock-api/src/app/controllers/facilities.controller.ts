import { Controller, Get, HttpCode, HttpStatus, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { FacilitiesService } from '../services/facilities.service';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class FacilitiesController {
  constructor(private readonly facilitiesService: FacilitiesService) {}

  @Get('facilities-overview')
  @HttpCode(HttpStatus.OK)
  getFacilitiesOverview() {
    return this.facilitiesService.getFacilitiesOverview();
  }

  @Get('loans/user')
  getLoans(@Query('pageStart') page: string, @Query('pageSize') size: string) {
    return this.facilitiesService.getLoans(page, size);
  }

  @Get('loans/details')
  @HttpCode(HttpStatus.OK)
  getLoanDetails(@Query('loanId') loanId: string) {
    return this.facilitiesService.getLoanDetails(loanId);
  }

  @Get('overdrafts/user')
  getOverdraftsList(@Query('pageStart') page: string, @Query('pageSize') size: string) {
    return this.facilitiesService.getOverdraftsList(page, size);
  }

  @Get('facilities-overview/lc')
  getLcs(@Query('lcType') lcType: string, @Query('pageStart') page: number, @Query('pageSize') size: number) {
    return this.facilitiesService.getLcs(lcType, page, size);
  }

  @Get('facilities-overview/overdraft-summary')
  getOverdraftDetails(@Query('accountNumber') accountNumber: string) {
    return this.facilitiesService.getOverdraftDetails(accountNumber);
  }

  @Get('facilities-overview/lgList')
  getLgs(@Query('lgType') lgType: string, @Query('pageStart') page: number, @Query('pageSize') size: number) {
    return this.facilitiesService.getLgs(lgType, page, size);
  }

  @Get('facilities-overview/idc')
  getIDC(
    @Query('idcType') idcType: string,
    @Query('status') status: string,
    @Query('pageStart') page: number,
    @Query('pageSize') size: number,
  ) {
    return this.facilitiesService.getIDC(idcType, status, page, size);
  }

  @Get('facilities-overview/CcList')
  getCreditCard(@Query('pageStart') page: number, @Query('pageSize') size: number) {
    return this.facilitiesService.getCreditCard(+page, +size);
  }

  @Get('credit-cards/:cardNumber/details')
  getCreditCardDetails(@Param('cardNumber') cardNumber: string) {
    return this.facilitiesService.getCreditCardDetails(cardNumber);
  }

  @Get('credit-cards/:cardNumber/transactions')
  getCreditCardTransactions(
    @Query('status') status: string,
    @Query('pageStart') page: number,
    @Query('pageSize') size: number,
  ) {
    return this.facilitiesService.getCreditCardTransactions(+page, +size);
  }

  @Get('lookup/static-data')
  getLcTypes(@Query('listId') listId: string) {
    return this.facilitiesService.getLookupTypes(listId);
  }

  @Get('facilities-overview/lc/:lcNumber/details')
  @HttpCode(HttpStatus.OK)
  getLCsDetails(@Query('lcNumber') lcNumber: string) {
    return this.facilitiesService.getLCsDetails(lcNumber);
  }

  @Get('facilities-overview/lg/:lgNumber')
  @HttpCode(HttpStatus.OK)
  getLGsDetails(@Query('lgNumber') lgNumber: string) {
    return this.facilitiesService.getLGsDetails(lgNumber);
  }

  @Get('facilities-overview/idc/:idcNumber/details')
  @HttpCode(HttpStatus.OK)
  getIDCDetails(@Query('idcNumber') idcNumber: string) {
    return this.facilitiesService.getIDCDetails(idcNumber);
  }
}
