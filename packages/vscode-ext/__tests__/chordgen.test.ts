function ChordGen(line: string) {
  return "";
}

describe("ChordGen", () => {
  it("ChordGen", () => {
    // x02210
    let Am = `
   x 0 2 2 1 0
  █████████████
1 ┼────────●──┼ 1
2 ┼────●─●────┼ 2
3 ┼───────────┼ 3
4 ┼───────────┼ 4
5 ┼───────────┼ 5
`;
    // x35543
    let Сm = `
   x 3 5 5 4 3
  █████████████
1 ┼───────────┼ 1
2 ┼───────────┼ 2
3 ┼●─────────●┼ 3
4 ┼────────●──┼ 4
5 ┼────●─●────┼ 5
`;
    expect(1 + 1).toBe(2);
  });
});