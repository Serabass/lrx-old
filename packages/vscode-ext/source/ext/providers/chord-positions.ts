// @see https://github.com/doaboa/note-me/blob/master/db.js
// @see https://github.com/utkillr/songlist

let source = `
A x02220 577655
Asus4 x02230
Am x02210 577555
A#m x13321
A# x13331
B x24442
Bsus4 x24462
Bb x13331
Bbm x13321
Bm x24432
C x32010 335553
Cadd9 x32030
Db 446664
C# 446664
C#sus4 446684
Dbsus4 446684
Cm x35543
C#m x46654
Dm xx0231 x57765
D xx0232 x57775
D# x68886
D#m x68876
Ebm x68876
E 022100 x79997
Eb x68876
Em 022000 x79987
Em7 022030 x799A7
F 133211
F# 244322
F#m 244222
Fm 133111
Gb 244322
Gm 355333
G 320003 355433
G5 320033
G# 466544
Ab 466544
G#m 466444
G#m7 466464
`;

export let positions: any = {};

source
  .trim()
  .split(/[\r\n]+/)
  .map((line) => line.split(/\s+/))
  .forEach(([key, ...value]) => {
    positions[key] = value;
  });