import {MathEx} from '../src/math-ex';

describe("MathEx", () => {
  it("MathEx.avg", () => {
    expect(MathEx.avg([0, 5, 10])).toBe(5);
    expect(MathEx.avg([0, 5, 10, 10])).toBe(5);
    expect(MathEx.avg([5, 10, 10])).toBe(7.5);
  });

  it("MathEx.avg with objects", () => {
    let objects = [
      {value: 1},
      {value: 3},
      {value: 3},
      {value: 3},
      {value: 3},
      {value: 3},
    ];
    expect(MathEx.avg(objects, o => o.value)).toBe(2);
  });

  it("MathEx.sum", () => {
    expect(MathEx.sum([1, 2, 5])).toBe(8);
  });

  it("MathEx.max", () => {
    expect(MathEx.max([1, 2, 5])).toBe(5);
  });
});
