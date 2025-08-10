import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from '@scb/ui/button';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.html',
  imports: [RouterLink, Button],
})
export class AppBreadcrumbsComponent {
  @Input() routes: { label: string; path?: string }[] = [];
}
