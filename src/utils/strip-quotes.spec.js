import { expect } from 'chai';
import stripQuotes from './strip-quotes';

describe('strip-quotes', () => {
  it('strips quotes when found at beginning and end', () => {
    expect(stripQuotes('"abc"')).to.equal('abc');
  });
  it('returns input when no quotes', () => {
    expect(stripQuotes('abc')).to.equal('abc');
  })
});
