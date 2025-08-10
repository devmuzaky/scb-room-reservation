import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideTestTransloco } from '@/config/transloco.testing';
import { fakeApi } from '@/core/test';
import { ApiError } from '@/models/api';
import { ERR } from '@/models/error';
import { fakeService, render, RenderResult } from '@scb/util/testing';
import { Registration } from './registration';
import { RegistrationService } from './registration.service';
import { RegistrationStepsComponent } from './registration.steps.component';

const regServiceMock = fakeService(RegistrationService, {
  generatePDF: jest.fn(),
});

describe('RegistrationStepsComponent', () => {
  let view: RenderResult<RegistrationStepsComponent>;

  beforeEach(async () => {
    view = await render(
      RegistrationStepsComponent,
      [provideNoopAnimations(), provideTestTransloco(), Registration, regServiceMock],
      {
        providers: [regServiceMock],
      },
    );
    view.detectChanges();
  });

  it('should create', () => {
    expect(view.host).toBeTruthy();
  });

  it('should call generatePDF and download the file on success', async () => {
    const pdfResponse = {
      file: 'JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0Zpb+',
    };
    const api = fakeApi({
      file: 'JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0Zpb+',
    });
    regServiceMock.v.generatePDF = api.fn;
    const component = view.host;
    const downloadPDFSpy = jest.spyOn(component, 'downloadPDF');
    await component.generatePDF();
    expect(component.loading()).toBeTruthy();
    api.complete();
    expect(downloadPDFSpy).toHaveBeenCalledWith(pdfResponse.file);
    expect(component.loading()).toBeFalsy();
  });

  it('should call generatePDF and generate error', async () => {
    const api = fakeApi(new ApiError({ code: ERR.BAD_GATEWAY, message: 'Server error' }));
    regServiceMock.v.generatePDF = api.fn;
    const component = view.host;
    await component.generatePDF();
    expect(component.loading()).toBeTruthy();
    api.complete();
    expect(component.loading()).toBeFalsy();
  });

  it('should open dialog when openDialog is called', () => {
    const component = view.host;
    const alertSpy = jest.spyOn(component['alert'], 'open');

    component.openDialog();

    expect(alertSpy).toHaveBeenCalled();
  });

  it('should convert base64 data and trigger download', () => {
    const component = view.host;

    const createElementSpy = jest.spyOn(document, 'createElement');

    const anchorElement = document.createElement('a');
    const clickSpy = jest.spyOn(anchorElement, 'click');
    createElementSpy.mockReturnValue(anchorElement);
    const objectURL = 'blob:http://localhost/fake-url';
    global.URL.createObjectURL = jest.fn(() => objectURL);

    component.downloadPDF('JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0Zpb+');

    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(anchorElement.href).toBe(objectURL);
    expect(anchorElement.download).toBe('RegistrationForm.pdf');
    expect(clickSpy).toHaveBeenCalled();

    createElementSpy.mockRestore();
    clickSpy.mockRestore();
    global.URL.createObjectURL = jest.fn();
  });
});
