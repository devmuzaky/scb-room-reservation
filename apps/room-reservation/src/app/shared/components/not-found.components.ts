import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  template: `<div class="flex h-full w-full items-center justify-center">
    <h1 class="text-4xl font-bold">404 - Not Found</h1>
  </div>`,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
        width: 100%;
      }
    `,
  ],
})
export class NotFoundComponent {
  // This component serves as a placeholder for routes that do not match any existing paths.
  // It displays a simple "404 - Not Found" message.
}
