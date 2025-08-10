import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideTestTransloco } from '@/config/transloco.testing';
import { render, RenderResult } from '@scb/util/testing';
import { TransactionDetail } from '../../widgets/pending-approvals/pending-approvals.model';
import { PendingApprovalsCard } from './pending-approvals-card.ng';

describe('PendingApprovalsCard', () => {
  let view: RenderResult<PendingApprovalsCard>;
  let component: PendingApprovalsCard;

  beforeEach(async () => {
    view = await render(PendingApprovalsCard, [provideNoopAnimations(), provideTestTransloco()]);
    component = view.host;
  });

  it('should create', () => {
    expect(view.host).toBeTruthy();
  });
  it('should create an instance of PendingApprovalsCard', () => {
    expect(component).toBeTruthy();
  });

  it('should have approvalsDetail defined as input', () => {
    expect(component.approvalsDetail).toBeDefined();
  });

  it('approvalsDetail should be an instance of TransactionDetail', () => {
    const mockDetail: TransactionDetail = {
      icon: '123',
      heading: 'heading',
      description: 'pending',
      totalTransactions: 0,
    };
    Object.defineProperty(component, 'approvalsDetail', {
      value: mockDetail,
    });
    expect(component.approvalsDetail).toEqual(mockDetail);
  });

  it('should return lowercase heading', () => {
    jest.spyOn(component, 'approvalsDetail').mockReturnValue({
      icon: 'icon.png',
      heading: 'APPROVED',
      description: 'Approval description',
      totalTransactions: 10,
    });
    expect(component.getTooltipClass()).toBe('approved');
  });

  it('should return empty string if heading is undefined', () => {
    jest.spyOn(component, 'approvalsDetail').mockReturnValue({
      icon: 'icon.png',
      heading: '',
      description: 'Approval description',
      totalTransactions: 10,
    });
    expect(component.getTooltipClass()).toBe('');
  });

  it('should return empty when approvalsDetail is null', () => {
    jest.spyOn(component, 'approvalsDetail').mockReturnValue(undefined);
    expect(component.getTooltipClass()).toBe('');
  });
});
