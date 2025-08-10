import { Component, signal } from '@angular/core';
import { provideTestTransloco } from '@/core/config/transloco.testing';
import { AppLanguage } from '@/layout/layout-store';
import { LayoutFacadeService } from '@/layout/layout.facade.service';
import { fakeService, render, RenderResult } from '@scb/util/testing';
import { PaginationData, TablePagination } from './pagination.ng';

const layoutFacadeStub = fakeService(LayoutFacadeService, {
  language: signal<AppLanguage>('en'),
  mobileMode: signal(false),
});

@Component({
  imports: [TablePagination],
  template: `<app-pagination
    [totalRecords]="totalRecords()"
    [totalPages]="totalPages()"
    [page]="page" />`,
})
export class TestPagination {
  readonly page = new PaginationData();
  readonly totalRecords = signal(0);
  readonly totalPages = signal(0);
}

describe('Credit Card Pagination', () => {
  let view: RenderResult<TestPagination>;
  let comp: TablePagination;

  beforeEach(async () => {
    view = await render(TestPagination, [provideTestTransloco(), layoutFacadeStub], {
      providers: [layoutFacadeStub],
    });
    view.detectChanges();
    comp = view.viewChild(TablePagination);
  });

  it('should create', () => {
    expect(view.host).toBeTruthy();
  });

  it('should handle the page change', () => {
    jest.spyOn(comp.reload, 'emit');
    const value = { rows: 10, first: 1, page: 2 };
    comp.onPageChange(value);
    expect({
      first: comp.page().first(),
      rows: comp.page().rows(),
      page: comp.page().pageNumber() - 1,
    }).toEqual(value);
    expect(comp.reload.emit).toHaveBeenCalled();
  });
});
