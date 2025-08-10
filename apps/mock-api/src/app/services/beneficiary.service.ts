import { Injectable } from '@nestjs/common';
import { BENEFICIARY_BANK_LIST } from '../constants/benef.constants';
import { beneficiaryMock } from '../mocks/benef.mock';
import {
  AddBeneficiaryDTO,
  AddBeneficiaryResponse,
  BeneficiaryAccount,
  BeneficiaryCreateRequest,
  BeneficiaryListResponse,
  BeneficiaryUpdateRequest,
  TransactionMethod,
} from '../models/beneficiary';

@Injectable()
export class BeneficiaryService {
  getBankList() {
    return BENEFICIARY_BANK_LIST;
  }

  validateInsideBeneficiary(body: AddBeneficiaryDTO): AddBeneficiaryResponse {
    // return BENEFICIARY_NAME_TOO_LONG_ERROR_RESPONSE;
    // return BENEFICIARY_NICKNAME_TOO_LONG_ERROR_RESPONSE;
    // return BENEFICIARY_NICKNAME_EXISTS_ERROR_RESPONSE;
    // return INVALID_TRANSACTION_METHOD_ERROR_RESPONSE;
    // return INVALID_BENEFICIARY_NUMBER_ACCOUNT_ERROR_RESPONSE;
    // return INVALID_BENEFICIARY_NUMBER_CARD_ERROR_RESPONSE;
    // return INVALID_BENEFICIARY_NUMBER_MOBILE_ERROR_RESPONSE;

    // return MISSING_FIELD_ERROR_RESPONSE;

    // return INVALID_ACCOUNT_NUMBER_ERROR_RESPONSE;
    // return INVALID_MOBILE_NUMBER_ERROR_RESPONSE;
    // return INVALID_WALLET_NUMBER_ERROR_RESPONSE;
    // return INVALID_CARD_NUMBER_ERROR_RESPONSE;
    // return INVALID_PAYMENT_ADDRESS_ERROR_RESPONSE;
    // return NO_BENEFICIARY_FOUND_ERROR_RESPONSE;

    // return INVALID_BANK_NAME_ERROR_RESPONSE;

    // return INVALID_BENEFICIARY_NUMBER_BANK_ACCOUNT_OUTSIDE_ERROR_RESPONSE;
    // return INVALID_BENEFICIARY_NUMBER_IBAN_ERROR_RESPONSE;
    // return INVALID_IBAN_PREFIX_ERROR_RESPONSE;
    // return INVALID_IBAN_CODE_ERROR_RESPONSE;

    return {
      status: 'success',
      beneficiaryName: body.beneficiaryName,
      bankName: 'AGRICULTURAL_EGYPTIAN_BANK',
    };
  }

  // Mock user validation - in a real app this would check against a user database
  private beneficiaries: BeneficiaryAccount[] = beneficiaryMock;

  private mapToResponse(beneficiary: BeneficiaryAccount): BeneficiaryAccount {
    let transactionMethod = TransactionMethod.BANK_ACCOUNT;
    let beneficiaryNumber = '';

    if (beneficiary.transactionMethod === TransactionMethod.BANK_ACCOUNT) {
      transactionMethod = TransactionMethod.BANK_ACCOUNT;
      beneficiaryNumber = beneficiary.beneficiaryNumber;
    } else if (beneficiary.transactionMethod === TransactionMethod.CARD) {
      transactionMethod = TransactionMethod.CARD;
      beneficiaryNumber = beneficiary.beneficiaryNumber;
    } else if (beneficiary.transactionMethod === TransactionMethod.MOBILE_NUMBER) {
      transactionMethod = TransactionMethod.MOBILE_NUMBER;
      beneficiaryNumber = beneficiary.beneficiaryNumber;
    } else if (beneficiary.transactionMethod === TransactionMethod.PAYMENT_ADDRESS) {
      transactionMethod = TransactionMethod.PAYMENT_ADDRESS;
      beneficiaryNumber = beneficiary.beneficiaryNumber;
    } else if (beneficiary.transactionMethod === TransactionMethod.WALLET) {
      transactionMethod = TransactionMethod.WALLET;
      beneficiaryNumber = beneficiary.beneficiaryNumber;
    }

    return {
      beneficiaryId: beneficiary.beneficiaryId,
      beneficiaryName: beneficiary.beneficiaryName,
      beneficiaryNickname: beneficiary.beneficiaryNickname,
      beneficiaryType: beneficiary.beneficiaryType,
      bankName: beneficiary.bankName || null,
      transactionMethod,
      beneficiaryNumber,
    };
  }

  getBeneficiaryList(
    beneficiaryType?: string,
    transactionMethod?: string,
    page = 1,
    pageSize = 10,
  ): BeneficiaryListResponse {
    // In a real app, we would filter by username to only show beneficiaries for this user
    let filteredBeneficiaries = [...this.beneficiaries];

    if (beneficiaryType) {
      const beneficiaryTypes = beneficiaryType.split(',');
      filteredBeneficiaries = filteredBeneficiaries.filter(ben => beneficiaryTypes.includes(ben.beneficiaryType));
    }

    if (transactionMethod) {
      filteredBeneficiaries = filteredBeneficiaries.filter(ben => {
        if (
          transactionMethod === TransactionMethod.BANK_ACCOUNT &&
          ben.transactionMethod === TransactionMethod.BANK_ACCOUNT
        )
          return true;
        if (transactionMethod === TransactionMethod.CARD && ben.transactionMethod === TransactionMethod.CARD)
          return true;
        if (
          transactionMethod === TransactionMethod.MOBILE_NUMBER &&
          ben.transactionMethod === TransactionMethod.MOBILE_NUMBER
        )
          return true;
        if (
          transactionMethod === TransactionMethod.PAYMENT_ADDRESS &&
          ben.transactionMethod === TransactionMethod.PAYMENT_ADDRESS
        )
          return true;
        if (transactionMethod === TransactionMethod.WALLET && ben.transactionMethod === TransactionMethod.WALLET)
          return true;
        return false;
      });
    }

    // Calculate pagination values
    const totalItems = filteredBeneficiaries.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const safeCurrentPage = Math.min(Math.max(1, page), Math.max(1, totalPages));

    // Apply pagination
    const startIndex = (safeCurrentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);
    const paginatedBeneficiaries = filteredBeneficiaries.slice(startIndex, endIndex);

    return {
      data: paginatedBeneficiaries.map(ben => this.mapToResponse(ben)),
      pagination: {
        totalSize: totalItems,
        totalPages,
        pageStart: safeCurrentPage,
        pageSize,
      },
    };
  }

  getBeneficiaryById(id: string): BeneficiaryAccount | undefined {
    // In a real app, we would check if this beneficiary belongs to the specified user
    const beneficiary = this.beneficiaries.find(ben => ben.beneficiaryId === id);

    if (!beneficiary) {
      return undefined;
    }

    return this.mapToResponse(beneficiary);
  }
  createBeneficiary(createRequest: BeneficiaryCreateRequest): BeneficiaryAccount {
    const newBeneficiary: BeneficiaryAccount = {
      beneficiaryId: Math.random().toString(36).substring(2, 15),
      beneficiaryName: createRequest.name,
      beneficiaryNickname: createRequest.nickname,
      beneficiaryType: createRequest.type,
      beneficiaryNumber:
        createRequest.accountNumber ||
        createRequest.cardNumber ||
        createRequest.walletId ||
        createRequest.mobileNumber ||
        createRequest.paymentAddress,
      transactionMethod: createRequest.accountNumber
        ? TransactionMethod.BANK_ACCOUNT
        : createRequest.cardNumber
          ? TransactionMethod.CARD
          : createRequest.walletId
            ? TransactionMethod.WALLET
            : createRequest.mobileNumber
              ? TransactionMethod.MOBILE_NUMBER
              : TransactionMethod.PAYMENT_ADDRESS,
      bankName: createRequest.bankName,

      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.beneficiaries.push(newBeneficiary);
    return newBeneficiary;
  }

  updateBeneficiary(id: string, updateRequest: BeneficiaryUpdateRequest): BeneficiaryAccount | undefined {
    const beneficiaryIndex = this.beneficiaries.findIndex(ben => ben.beneficiaryId === id);

    if (beneficiaryIndex === -1) {
      return undefined;
    }

    const updatedBeneficiary = {
      ...this.beneficiaries[beneficiaryIndex],
      ...updateRequest,
      updatedAt: new Date().toISOString(),
    };

    this.beneficiaries[beneficiaryIndex] = updatedBeneficiary;
    return updatedBeneficiary;
  }

  deleteBeneficiary(id: string): boolean {
    const initialLength = this.beneficiaries.length;
    this.beneficiaries = this.beneficiaries.filter(ben => ben.beneficiaryId !== id);

    return this.beneficiaries.length < initialLength;
  }
}
