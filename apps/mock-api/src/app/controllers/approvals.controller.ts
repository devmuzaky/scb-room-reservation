import { Controller, Get, HttpCode, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ApprovalsService } from '../services/approvals.service';

@Controller('dashboard/approvals')
@UseGuards(JwtAuthGuard)
export class ApprovalsController {
  constructor(private readonly approvalsService: ApprovalsService) {}

  @Get('pending-my-approval')
  @HttpCode(HttpStatus.OK)
  getPendingApprovals(@Query('username') username: string) {
    return this.approvalsService.getPendingApprovals(username);
  }

  @Get('pending-others-approval')
  @HttpCode(HttpStatus.OK)
  getPendingOthersApprovals(@Query('username') username: string) {
    return this.approvalsService.getPendingOthersApprovals(username);
  }
}
