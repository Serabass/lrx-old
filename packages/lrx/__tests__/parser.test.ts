import { parse } from "../src";
import { ChordsLine } from "../src/LRXParsedDocument";

describe("Parser", () => {
  it("Parser", () => {
    let data = parse(`Awesome song

[1 verse]
  Cm        Gm           A
  La-la-la La-la-la La-la-la

===

~1 .
`);
    expect(data.title.title).toBe("Awesome song");
    expect(data.blocks.length).toBe(1);
    const block = data.blocks[0];
    const line = block.body[0] as ChordsLine;
    expect(line.type).toBe("CHORDS_LINE");
    expect(line.chords.length).toBe(3);

    expect(line.chords[0]).toBeDefined();
    expect(line.chords[0].note).toBe("C");
    expect(line.chords[0].suffix).toBe("m");

    expect(line.chords[1]).toBeDefined();
    expect(line.chords[1].note).toBe("G");
    expect(line.chords[1].suffix).toBe("m");

    expect(line.chords[2]).toBeDefined();
    expect(line.chords[2].note).toBe("A");
    expect(line.chords[2].suffix).toBeNull();
  });

  it("Parser 2", () => {
    let data = parse(`Awesome song 2

[1 verse]
  C               Am
  La-la-la La-la-la La-la-la

===

~1 .
`);
    expect(data.title.title).toBe("Awesome song 2");
    expect(data.blocks.length).toBe(1);
    const block = data.blocks[0];
    const line = block.body[0] as ChordsLine;
    expect(line.type).toBe("CHORDS_LINE");
    expect(line.chords.length).toBe(2);

    expect(line.chords[0]).toBeDefined();
    expect(line.chords[0].space.start).toBe("  ");
    expect(line.chords[0].note).toBe("C");
    expect(line.chords[0].suffix).toBeNull();

    expect(line.chords[1]).toBeDefined();
    expect(line.chords[1].note).toBe("A");
    expect(line.chords[1].suffix).toBe("m");
  });
  it("Parser 2", () => {
    let data = parse(`Awesome song 3

[1 verse]
   C#m                          F#6
  La-la-la La-la-la La-la-la

===

~1 .
`);
    expect(data.title.title).toBe("Awesome song 3");
    expect(data.blocks.length).toBe(1);
    const block = data.blocks[0];
    const line = block.body[0] as ChordsLine;
    expect(line.type).toBe("CHORDS_LINE");
    expect(line.chords.length).toBe(2);

    expect(line.chords[0]).toBeDefined();
    expect(line.chords[0].space.start).toBe("   ");
    expect(line.chords[0].note).toBe("C");
    expect(line.chords[0].suffix).toBe("m");

    expect(line.chords[1]).toBeDefined();
    expect(line.chords[1].note).toBe("F");
    expect(line.chords[1].mod).toBe("#");
    expect(line.chords[1].suffix).toBe("6");
  });
});
