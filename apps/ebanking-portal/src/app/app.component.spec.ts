import { render, RenderResult } from '@scb/util/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let view: RenderResult<AppComponent>;

  beforeEach(async () => {
    view = await render(AppComponent);
  });

  it('should create component', () => {
    expect(view.host).toBeDefined();
  });
});
