import { UseridToNamePipe } from './userid-to-name.pipe';

describe('UseridToNamePipe', () => {
  it('create an instance', () => {
    const pipe = new UseridToNamePipe();
    expect(pipe).toBeTruthy();
  });
});
