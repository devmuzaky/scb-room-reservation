import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AccountController } from './controllers/account.controller';
import { ApprovalsController } from './controllers/approvals.controller';
import { AuthenticationController } from './controllers/authentication.controller';
import { BeneficiaryController } from './controllers/beneficiary.controller';
import { ChequeBookController } from './controllers/chequebook.controller';
import { ChequesController } from './controllers/cheques.controller';
import { DelegationMatrixController } from './controllers/delegation-matrix.controller';
import { DepositsController } from './controllers/deposits.controller';
import { ExchangeController } from './controllers/exchange.controller';
import { FacilitiesController } from './controllers/facilities.controller';
import { LookupsController } from './controllers/lookups.controller';
import { PaymentsController } from './controllers/payments.controller';
import { ProductController } from './controllers/product.controller';
import { SoftTokenController } from './controllers/soft-token.controller';
import { TransferController } from './controllers/transfer.controller';
import { DelayInterceptor } from './interceptors/delay.interceptor';
import { AccountService } from './services/account.service';
import { ApprovalsService } from './services/approvals.service';
import { BeneficiaryService } from './services/beneficiary.service';
import { ChequeBookService } from './services/chequebook.service';
import { ChequesService } from './services/cheques.service';
import { DelegationMatrixService } from './services/delegation-matrix.service';
import { DepositsService } from './services/deposits.service';
import { ExchangeService } from './services/exchange.service';
import { FacilitiesService } from './services/facilities.service';
import { JwtService } from './services/jwt.service';
import { LookupsService } from './services/lookups.service';
import { PaymentsService } from './services/payments.service';
import { ProductsService } from './services/products.service';
import { TransferService } from './services/transfer.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'your-secret-key', // In production, use environment variable
      signOptions: { expiresIn: '5m' },
    }),
  ],
  controllers: [
    AuthenticationController,
    SoftTokenController,
    AccountController,
    BeneficiaryController,
    ChequesController,
    ApprovalsController,
    FacilitiesController,
    DepositsController,
    ProductController,
    PaymentsController,
    LookupsController,
    ExchangeController,
    TransferController,
    ChequeBookController,
    DelegationMatrixController,
  ],
  providers: [
    AccountService,
    BeneficiaryService,
    ChequesService,
    ApprovalsService,
    FacilitiesService,
    DepositsService,
    ProductsService,
    PaymentsService,
    LookupsService,
    ExchangeService,
    TransferService,
    ChequeBookService,
    DelegationMatrixService,
    {
      provide: APP_INTERCEPTOR,
      useClass: DelayInterceptor,
    },
    JwtService,
  ],
})
export class AppModule {}
