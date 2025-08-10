import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import {
  AddBeneficiaryDTO,
  AddBeneficiaryResponse,
  BeneficiaryCreateRequest,
  BeneficiaryUpdateRequest,
} from '../models/beneficiary';
import { BeneficiaryService } from '../services/beneficiary.service';

@Controller('transfer/beneficiary')
@UseGuards(JwtAuthGuard)
export class BeneficiaryController {
  constructor(private readonly beneficiaryService: BeneficiaryService) {}

  // implement beneficiary/bank-list
  @Get('banks')
  @HttpCode(HttpStatus.OK)
  getBankList() {
    return this.beneficiaryService.getBankList();
  }

  // implement beneficiary/inside/validate
  @Post('inside/validate')
  @HttpCode(HttpStatus.OK)
  validateInsideBeneficiary(@Body() body: AddBeneficiaryDTO): AddBeneficiaryResponse {
    return this.beneficiaryService.validateInsideBeneficiary(body);
  }

  // implement beneficiary/inside/add
  @Post('inside/add')
  @HttpCode(HttpStatus.OK)
  addInsideBeneficiary(@Body() body: AddBeneficiaryDTO): AddBeneficiaryResponse {
    return this.beneficiaryService.validateInsideBeneficiary(body);
  }

  // implement beneficiary/outside/validate
  @Post('outside/validate')
  @HttpCode(HttpStatus.OK)
  validateOutsideBeneficiary(@Body() body: AddBeneficiaryDTO): AddBeneficiaryResponse {
    return this.beneficiaryService.validateInsideBeneficiary(body);
  }

  // implement beneficiary/outside/add
  @Post('outside/add')
  @HttpCode(HttpStatus.OK)
  addOutsideBeneficiary(@Body() body: AddBeneficiaryDTO): AddBeneficiaryResponse {
    return this.beneficiaryService.validateInsideBeneficiary(body);
  }

  @Get('list')
  @HttpCode(HttpStatus.OK)
  getBeneficiaryList(
    @Query('beneficiaryType') beneficiaryType?: string,
    @Query('transactionMethod') transactionMethod?: string,
  ) {
    return this.beneficiaryService.getBeneficiaryList(beneficiaryType, transactionMethod);
  }

  @Get(':beneficiaryId')
  @HttpCode(HttpStatus.OK)
  getBeneficiaryById(@Param('beneficiaryId') beneficiaryId: string) {
    const beneficiary = this.beneficiaryService.getBeneficiaryById(beneficiaryId);
    return beneficiary || {};
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createBeneficiary(@Body() createRequest: BeneficiaryCreateRequest) {
    return this.beneficiaryService.createBeneficiary(createRequest);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  updateBeneficiary(@Param('id') id: string, @Body() updateRequest: BeneficiaryUpdateRequest) {
    const updatedBeneficiary = this.beneficiaryService.updateBeneficiary(id, updateRequest);

    if (!updatedBeneficiary) {
      return { error: 'Beneficiary not found' };
    }

    return updatedBeneficiary;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  deleteBeneficiary(@Param('id') id: string) {
    const deleted = this.beneficiaryService.deleteBeneficiary(id);

    if (!deleted) {
      return { error: 'Beneficiary not found' };
    }

    return { success: true, message: 'Beneficiary deleted successfully' };
  }
}
