import { Controller, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ProductsService } from '../services/products.service';

@Controller('product')
@UseGuards(JwtAuthGuard)
export class ProductController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('deposits/create/cd')
  @HttpCode(HttpStatus.OK)
  submitProductCD() {
    return {
      success: true,
      message: 'Submitted successfully',
    };
  }

  @Get('list/cd-list')
  @HttpCode(HttpStatus.OK)
  getProductCD() {
    return this.productsService.getCdList();
  }

  @Get('list/td-list')
  @HttpCode(HttpStatus.OK)
  getProductTD() {
    return this.productsService.getTDList();
  }

  @Get('list/account-list')
  @HttpCode(HttpStatus.OK)
  getAllAccounts() {
    return this.productsService.getAllAccounts();
  }

  @Get('list/cd/:id')
  @HttpCode(HttpStatus.OK)
  getCd() {
    return this.productsService.getCd();
  }

  @Get('list/td/:id')
  @HttpCode(HttpStatus.OK)
  getTd() {
    return this.productsService.getTd();
  }

  @Get('list/account-list/:id')
  @HttpCode(HttpStatus.OK)
  getAccount() {
    return this.productsService.getAccount();
  }
}
