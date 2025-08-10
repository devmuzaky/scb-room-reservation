import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AppBreadcrumbsComponent } from '@/core/components';
import { TranslocoDirective } from '@jsverse/transloco';
import { ChequeBookService } from './chequebook.service';
import { RequestNewChequeBookForm } from './views/request-form/request-form';

@Component({
  selector: 'app-request-chequebook',
  providers: [ChequeBookService],
  imports: [CommonModule, AppBreadcrumbsComponent, TranslocoDirective, RequestNewChequeBookForm],
  templateUrl: './request-new-chequebook.ng.html',
  host: {
    class: 'container-grid px-3xl pt-3xl',
  },
})
export class RequestChequeBook {
  readonly chequeBookService = inject(ChequeBookService);
  readonly hideBreadCrumb = signal<boolean>(true);
}
