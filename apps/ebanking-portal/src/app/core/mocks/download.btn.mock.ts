import { Component } from '@angular/core';
import { DownloadButton } from '../components/download-button.ng';
import { FakeDownloadBtn } from '../components/download-button.spec';

export const OverrideDownloadBtn: [Partial<Component>, Partial<Component>] = [
  { imports: [DownloadButton] },
  { imports: [FakeDownloadBtn] },
];
