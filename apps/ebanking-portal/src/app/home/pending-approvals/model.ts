import { Pagination } from '@/core/models/api';

export interface IPendingApprovalsRes {
  data: any[];
  paginations: Pagination;
  transferTypes: { key: string; value: string }[];
}
