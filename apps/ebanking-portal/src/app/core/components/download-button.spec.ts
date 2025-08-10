import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { of } from 'rxjs';
import { Base64ConverterService } from '@scb/util/base64-converter';
import { fakeService, render, RenderResult } from '@scb/util/testing';
import { provideTestTransloco } from '../config/transloco.testing';
import { fakeApi } from '../test';
import { DownloadButton, DownloadOptions, DownloadType } from './download-button.ng';

@Component({
  selector: 'app-download-btn',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ``,
})
export class FakeDownloadBtn implements Partial<DownloadButton> {
  readonly isEmpty = input(false);
  readonly options = input.required<DownloadOptions>();

  download(extension: DownloadType): void {
    // fake implementation
  }
}

const httpStub = fakeService(HttpClient, {
  get: of({ file: 'JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0Zpb' }) as any,
});

const base64Stub = fakeService(Base64ConverterService, {
  downloadPdf: () => true,
  base64ToFile: () => true,
  downloadExcel: () => true,
});

describe('Download Button', () => {
  let view: RenderResult<DownloadButton>;

  beforeEach(async () => {
    view = await render(DownloadButton, [provideTestTransloco(), httpStub, base64Stub], {
      inputs: [
        ['options', { filename: 'test', url: () => '/api/testing' }],
        ['isEmpty', signal(false)],
      ],
    });
  });

  it('should create', () => {
    view.detectChanges();
    expect(view.host).toBeTruthy();
  });

  it('should handle download with different extensions', () => {
    view.setInput('options', { filename: 'test', url: () => '/api/testing' });
    view.setInput('isEmpty', signal(false));
    view.detectChanges();
    const api = fakeApi({ file: 'JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0Zpb' });
    httpStub.v.get = api.fn as any;

    // With PDF
    view.host.base64Converter.downloadPdf = jest.fn();
    view.host.download('pdf');

    expect(view.host.loading()).toBeTruthy();
    api.complete();
    expect(view.host.loading()).toBeFalsy();
    expect(view.host.base64Converter.downloadPdf).toHaveBeenCalled();

    // With CSV
    view.host.base64Converter.base64ToFile = jest.fn();
    view.host.download('csv');
    expect(view.host.loading()).toBeTruthy();
    api.complete();
    expect(view.host.loading()).toBeFalsy();
    expect(view.host.base64Converter.base64ToFile).toHaveBeenCalled();

    // With Excel
    view.setInput('options', { filename: 'test', extension: ['pdf', 'excel'], url: () => '/api/testing' });
    view.detectChanges();
    view.host.base64Converter.downloadExcel = jest.fn();
    view.host.download('excel');
    expect(view.host.loading()).toBeTruthy();
    api.complete();
    expect(view.host.loading()).toBeFalsy();
    expect(view.host.base64Converter.downloadExcel).toHaveBeenCalled();
  });
});
