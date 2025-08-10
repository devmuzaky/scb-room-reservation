import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { Button } from '@scb/ui/button';
import { Icon } from '@scb/ui/icon';
import { Base64ConverterService } from '@scb/util/base64-converter';
import { MenuModule } from 'primeng/menu';

export type DownloadType = 'pdf' | 'csv' | 'excel';

export interface DownloadOptions {
  filename: string;
  extension?: DownloadType[];
  url: (ext: DownloadType) => string;
}

@Component({
  selector: 'app-download-btn, [appDownloadBtn]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, MenuModule, Icon, TranslocoPipe],
  template: `<button
      scbButton
      [variant]="mode() === 'icon' ? 'ghost' : 'primary'"
      [size]="mode() === 'icon' ? 'md' : 'lg'"
      [disabled]="isEmpty()"
      icon="download"
      (click)="downloadOptionsMenu.toggle($event)">
      @if (mode() === 'button') {
        <ng-content>{{ 'download' | transloco }}</ng-content>
      }
    </button>
    <p-menu
      #downloadOptionsMenu
      [model]="downloadOptionsList()"
      [popup]="true"
      data-testid="cc_pMenu_downloadOptions">
      <ng-template
        #item
        let-item>
        <div
          tabindex="0"
          class="flex flex-1 gap-3"
          (click)="download(item.icon)"
          role="button"
          data-testid="cc_div_downloadOption">
          <icon
            class="w-2xl"
            [name]="item.icon"></icon>
          <p class="mf-md text-text-primary flex-1">{{ item.label }}</p>
          <icon
            class="text-text-brand w-2xl"
            name="download"></icon>
        </div>
      </ng-template>
    </p-menu>`,
  host: {
    class: 'inline-block',
  },
})
export class DownloadButton {
  readonly http = inject(HttpClient);
  readonly translateService = inject(TranslocoService);
  readonly base64Converter = inject(Base64ConverterService);

  readonly isEmpty = input.required<boolean>();
  readonly options = input.required<DownloadOptions>();
  readonly mode = input<'button' | 'icon'>('button');

  readonly loading = signal(false);
  private readonly _downloadOptionsList: { icon: DownloadType; label: string }[] = [
    { icon: 'pdf', label: 'PDF' },
    { icon: 'csv', label: 'CSV' },
    { icon: 'excel', label: 'Excel' },
  ];

  readonly downloadOptionsList = computed(() => {
    const op = this.options().extension ?? ['pdf', 'csv'];
    return this._downloadOptionsList.filter(x => op.includes(x.icon));
  });

  download(extension: DownloadType) {
    const { filename, url } = this.options();
    const urlWithExtension = url(extension.toUpperCase() as DownloadType);
    const filenameWithTranslation = this.translateService.translate(filename);

    this.loading.set(true);
    this.http.get<{ file: string }>(urlWithExtension).subscribe({
      next: ({ file }) => {
        this.loading.set(false);
        if (extension === 'pdf') {
          this.base64Converter.downloadPdf(file, filenameWithTranslation);
        } else if (extension === 'excel') {
          this.base64Converter.downloadExcel(file, filenameWithTranslation);
        } else {
          this.base64Converter.base64ToFile(file, extension, filenameWithTranslation);
        }
      },
    });
  }
}
