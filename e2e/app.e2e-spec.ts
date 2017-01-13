import { GivingGridPage } from './app.po';

describe('giving-grid App', function() {
  let page: GivingGridPage;

  beforeEach(() => {
    page = new GivingGridPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
