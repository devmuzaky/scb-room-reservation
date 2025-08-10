import { calculateUserLockedTime } from './utils';

describe('Utils functions', () => {
  it('should return proper time differences', () => {
    const output = calculateUserLockedTime('2025-02-13T15:47:11.139477Z', '2025-02-13T12:47:11.139477Z');
    expect(output).toEqual({ time: 3, isHours: true });

    const output1 = calculateUserLockedTime('2025-02-13T15:47:11.139477Z', '2025-02-13T15:27:11.139477Z');
    expect(output1).toEqual({ time: 20, isHours: false });
  });
});
