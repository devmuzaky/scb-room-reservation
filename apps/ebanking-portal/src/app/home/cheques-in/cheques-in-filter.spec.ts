import { HttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { provideTestTransloco } from '@/config/transloco.testing';
import { AppLanguage } from '@/layout/layout-store';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { httpFakeResponse } from '@/models/api';
import { fakeService, render, RenderResult } from '@scb/util/testing';
import { ChequesTypes } from '../dashboard/widgets/cheque-in/model';
import { ChequesInData } from './cheques-in';
import { ChequesInFilter } from './cheques-in-filter.ng';

const httpStub = fakeService(HttpClient, {
  request: httpFakeResponse([{ name: 'SCB', code: 'scb' }]),
});

const layoutFacadeStub = fakeService(LayoutFacadeService, {
  language: signal('en' as AppLanguage),
});

describe('ChequesIn Filter', () => {
  let view: RenderResult<ChequesInFilter>;

  beforeEach(async () => {
    view = await render(ChequesInFilter, [provideTestTransloco(), ChequesInData, httpStub, layoutFacadeStub]);
  });

  it('should create', () => {
    expect(view.host).toBeTruthy();
  });

  it('should clear values on calling clearFilter', () => {
    view.host.clearFilter();
    expect(view.host.status()).toEqual([]);
    expect(view.host.settlementDate()).toBeFalsy();
    expect(view.host.draweeBank()).toEqual([]);
  });

  it('should update the output when apply is called', () => {
    view.host._status.set([ChequesTypes.COLLECTED]);
    view.host._settlementDate.set('2005-12-09,2005-12-10');
    view.host._draweeBank.set(['SCB']);
    view.host.apply();
    expect(view.host.status()).toEqual([ChequesTypes.COLLECTED]);
    expect(view.host.settlementDate()).toBe('2005-12-09,2005-12-10');
    expect(view.host.draweeBank()).toEqual(['SCB']);
  });

  it('should fetch the draweeBank list', async () => {
    await view.whenStable();
    expect(view.host.chequesIn.bankList()).toBeTruthy();
  });

  describe('statusClosed()', () => {
    it('should update _status if status has changed', () => {
      view.host._status.set([ChequesTypes.RETURNED]);
      jest.spyOn(view.host._status, 'set');
      jest.spyOn(view.host, 'status').mockReturnValue([ChequesTypes.COLLECTED]);

      view.host.statusClosed();

      expect(view.host._status.set).toHaveBeenCalledWith([ChequesTypes.COLLECTED]);
    });

    it('should not update _status if status is unchanged', () => {
      view.host._status.set([ChequesTypes.COLLECTED]);
      jest.spyOn(view.host._status, 'set');
      jest.spyOn(view.host, 'status').mockReturnValue([ChequesTypes.COLLECTED]);

      view.host.statusClosed();

      expect(view.host._status.set).not.toHaveBeenCalled();
    });
  });

  describe('dateClosed()', () => {
    it('should reset _settlementDate if date has changed', () => {
      view.host._settlementDate.set('2023-01-01');
      jest.spyOn(view.host._settlementDate, 'set');
      jest.spyOn(view.host, 'settlementDate').mockReturnValue('2024-01-01');

      view.host.dateClosed();

      expect(view.host._settlementDate.set).toHaveBeenCalledWith('');
    });

    it('should not reset _settlementDate if date is unchanged', () => {
      view.host._settlementDate.set('2024-01-01');
      jest.spyOn(view.host._settlementDate, 'set');
      jest.spyOn(view.host, 'settlementDate').mockReturnValue('2024-01-01');

      view.host.dateClosed();

      expect(view.host._settlementDate.set).not.toHaveBeenCalled();
    });
  });

  describe('bankClosed()', () => {
    it('should update _draweeBank if value has changed', () => {
      view.host._draweeBank.set(['BANK1']);
      jest.spyOn(view.host._draweeBank, 'set');
      jest.spyOn(view.host, 'draweeBank').mockReturnValue(['BANK2']);

      view.host.bankClosed();

      expect(view.host._draweeBank.set).toHaveBeenCalledWith(['BANK2']);
    });

    it('should not update _draweeBank if value is unchanged', () => {
      view.host._draweeBank.set(['SCB']);
      jest.spyOn(view.host._draweeBank, 'set');
      jest.spyOn(view.host, 'draweeBank').mockReturnValue(['SCB']);

      view.host.bankClosed();

      expect(view.host._draweeBank.set).not.toHaveBeenCalled();
    });
  });
});
