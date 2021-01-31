import {Lrx} from '../src/lrx';
import path from 'path';

describe('LRX Tests', () => {
  it('LRX', async () => {
    expect(await Lrx.rate(path.join(__dirname, '1.lrx'))).toBe(5.00);
  });
});