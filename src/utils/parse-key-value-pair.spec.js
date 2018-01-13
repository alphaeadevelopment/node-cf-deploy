import { expect } from 'chai';
import parseKeyValuePair from './parse-key-value-pair';

describe('parseKeyValuePair', () => {
  it('parses "a=b"', () => {
    expect(parseKeyValuePair('a=b')).to.deep.equal({ key: 'a', value: 'b' });
  });
  it('parses "a=2"', () => {
    expect(parseKeyValuePair('a=2')).to.deep.equal({ key: 'a', value: 2 });
  });
  it('parses "a=002"', () => {
    expect(parseKeyValuePair("a=002")).to.deep.equal({ key: 'a', value: '002' });
  });
});
