import { HttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { AppLanguage } from '@/layout/layout-store';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { httpFakeResponse } from '@/models/api';
import { fakeService, render, RenderResult } from '@scb/util/testing';
import { provideTestTransloco } from '../../core/config/transloco.testing';
import { ChequesStatus } from '../dashboard/widgets/cheque-out/model';
import { ChequesOutFilter } from './cheques-out-filter.ng';

const httpStub = fakeService(HttpClient, {
  request: httpFakeResponse([{ name: 'SCB', code: 'scb' }]),
});

const layoutFacadeStub = fakeService(LayoutFacadeService, {
  language: signal('en' as AppLanguage),
});

describe('ChequesOut Filter', () => {
  let view: RenderResult<ChequesOutFilter>;

  beforeEach(async () => {
    view = await render(ChequesOutFilter, [
      provideTestTransloco(),
      provideNoopAnimations(),
      httpStub,
      layoutFacadeStub,
    ]);
  });

  it('should create', () => {
    expect(view.host).toBeTruthy();
  });

  it('should clear values on calling clearFilter', () => {
    view.host.clearFilter();
    expect(view.host.status()).toEqual([]);
    expect(view.host.settlementDate()).toBeFalsy();
  });

  it('should update the output when apply is called', () => {
    view.host._status.set([ChequesStatus.DEDUCTED]);
    view.host._settlementDate.set('2005-12-09,2005-12-10');
    view.host.apply();
    expect(view.host.status()).toEqual([ChequesStatus.DEDUCTED]);
    expect(view.host.settlementDate()).toBe('2005-12-09,2005-12-10');
  });

  it('should open the status with footer', async () => {
    await view.whenStable();
    const el = view.$('[data-testid="CHEQUES_OUT_SELECT_STATUS_VALUE"');
    el.click();
    expect(el.dEl).toBeTruthy();
    expect(view.queryRoot('app-select-value')).toBeTruthy();
  });

  it('should reset _status to empty array when statusClosed is called and values are different', () => {
    // Set different values
    view.host.status.set(['Deducted' as const]);
    view.host._status.set(['Returned' as const]);

    // Call statusClosed
    view.host.statusClosed();

    // Should reset _status to empty array
    expect(view.host._status()).toEqual([]);
  });

  it('should not reset _status when statusClosed is called and values are equal', () => {
    // Set same values
    const sameValue = ['Deducted' as const];
    view.host.status.set(sameValue);
    view.host._status.set(sameValue);

    // Call statusClosed
    view.host.statusClosed();

    // Should not change _status
    expect(view.host._status()).toEqual(sameValue);
  });

  it('should reset _status when statusClosed is called and status is empty but _status has values', () => {
    // Set different values
    view.host.status.set([]);
    view.host._status.set(['Deducted' as const]);

    // Call statusClosed
    view.host.statusClosed();

    // Should reset _status to empty array
    expect(view.host._status()).toEqual([]);
  });

  it('should reset _status when statusClosed is called and _status is empty but status has values', () => {
    // Set different values
    view.host.status.set(['Deducted' as const]);
    view.host._status.set([]);

    // Call statusClosed
    view.host.statusClosed();

    // Should reset _status to empty array
    expect(view.host._status()).toEqual([]);
  });

  it('should reset _settlementDate to empty string when dateClosed is called and values are different', () => {
    // Set different values
    view.host.settlementDate.set('2023-01-01,2023-01-31');
    view.host._settlementDate.set('2023-02-01,2023-02-28');

    // Call dateClosed
    view.host.dateClosed();

    // Should reset _settlementDate to empty string
    expect(view.host._settlementDate()).toBe('');
  });

  it('should not reset _settlementDate when dateClosed is called and values are equal', () => {
    // Set same values
    const sameValue = '2023-01-01,2023-01-31';
    view.host.settlementDate.set(sameValue);
    view.host._settlementDate.set(sameValue);

    // Call dateClosed
    view.host.dateClosed();

    // Should not change _settlementDate
    expect(view.host._settlementDate()).toBe(sameValue);
  });

  it('should reset _settlementDate when dateClosed is called and settlementDate is empty but _settlementDate has value', () => {
    // Set different values
    view.host.settlementDate.set('');
    view.host._settlementDate.set('2023-01-01,2023-01-31');

    // Call dateClosed
    view.host.dateClosed();

    // Should reset _settlementDate to empty string
    expect(view.host._settlementDate()).toBe('');
  });

  it('should reset _settlementDate when dateClosed is called and _settlementDate is empty but settlementDate has value', () => {
    // Set different values
    view.host.settlementDate.set('2023-01-01,2023-01-31');
    view.host._settlementDate.set('');

    // Call dateClosed
    view.host.dateClosed();

    // Should reset _settlementDate to empty string
    expect(view.host._settlementDate()).toBe('');
  });

  it('should handle statusClosed with complex array values', () => {
    // Set different complex arrays
    view.host.status.set(['Deducted' as const, 'Returned' as const]);
    view.host._status.set(['Deducted' as const]);

    // Call statusClosed
    view.host.statusClosed();

    // Should reset _status to empty array
    expect(view.host._status()).toEqual([]);
  });

  it('should handle dateClosed with complex date ranges', () => {
    // Set different date ranges
    view.host.settlementDate.set('2023-01-01,2023-01-31,2023-02-01');
    view.host._settlementDate.set('2023-01-01,2023-01-31');

    // Call dateClosed
    view.host.dateClosed();

    // Should reset _settlementDate to empty string
    expect(view.host._settlementDate()).toBe('');
  });
});
