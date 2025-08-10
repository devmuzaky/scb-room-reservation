import { Injectable } from '@nestjs/common';
import { PENDING_APPROVALS } from '../models/dashboard';

@Injectable()
export class ApprovalsService {
  getPendingApprovals(username: string) {
    return PENDING_APPROVALS;
  }

  getPendingOthersApprovals(username: string) {
    return PENDING_APPROVALS;
  }
}
