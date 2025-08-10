import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AddBeneficiaryFormData, AddBeneficiaryResponse, Beneficiary } from './models/models';

@Injectable()
export class BeneficiaryData {
  private readonly http = inject(HttpClient);

  validateAndAddBeneficiary(
    {
      beneficiaryNumber,
      transactionMethod,
      bankName,
      beneficiaryName,
      beneficiaryNickname,
      isActive,
    }: AddBeneficiaryFormData,
    { outside, validate }: ValidateAndAddBeneficiaryParams,
  ) {
    return this.http.post<AddBeneficiaryResponse>(
      `/api/transfer/beneficiary/${outside ? 'outside' : 'inside'}/${validate ? 'validate' : 'add'}`,
      {
        beneficiaryNumber,
        transactionMethod,
        beneficiaryName,
        bankName,
        beneficiaryNickname,
        isActive,
      } satisfies AddBeneficiaryFormData,
    );
  }

  updateBeneficiary(beneficiaryId: string, body: UpdateBeneficiaryRequest) {
    return this.http.patch<Beneficiary>(`/api/transfer/beneficiary/${beneficiaryId}`, body);
  }

  deleteBeneficiary(beneficiaryId: string) {
    return this.http.delete<DeleteBeneficiaryResponse>(`/api/transfer/beneficiary/${beneficiaryId}`, {});
  }

  getBeneficiaryDetails(beneficiaryId: string) {
    return this.http.get<Beneficiary>(`/api/transfer/beneficiary/${beneficiaryId}`);
  }
}

export interface UpdateBeneficiaryRequest {
  beneficiaryNickname: string;
}

interface ValidateAndAddBeneficiaryParams {
  outside: boolean;
  validate: boolean;
}

export interface DeleteBeneficiaryResponse {
  status: string;
  message: string;
}
