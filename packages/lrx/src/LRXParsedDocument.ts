type PEGLocation = any;

interface LRXDocumentTitle {
  type: "DOCUMENT_TITLE";
  title: string;
  loc: PEGLocation;
}

export interface ChordsLine {
  type: "CHORDS_LINE";
  chords: Chord[];
  text: string;
}

type Note = string;
type ChordMod = string;
type ChordSuffix = string;

export interface Chord {
  type: "CHORD";
  space: {
    start: string;
    end: string;
  };
  note: Note;
  mod: ChordMod;
  suffix: ChordSuffix;
  loc: PEGLocation;
}

interface EmptyLine {
  type: "EMPTY_LINE";
  loc: PEGLocation;
}

interface LyricsLine {
  type: "LINE";
  loc: PEGLocation;
  content: LyricLineContent[];
  text: string;
  avgRate: number;
}

interface LyricLineContent {
  type: "LINE_CONTENT";
  content: string;
  bm: LineBookmark;
  loc: PEGLocation;
}

type BookmarkId = string;

interface LineBookmark {
  type: "LINE_BOOKMARK";
  n: BookmarkId;
  rate: LineBookmarkRate;
  loc: PEGLocation;
  text: string;
}

interface LineBookmarkRate {
  type: "LINE_BOOKMARK_RATE";
  rate: number;
}

export type BlockBodyElement = ChordsLine | EmptyLine | LyricsLine;

interface LRXBlockHeader {
  type: "BLOCK_HEADER";
  title: string;
  loc: PEGLocation;
}

export interface LRXBlock {
  type: "BLOCK";
  header: LRXBlockHeader;
  body: BlockBodyElement[];
  loc: PEGLocation;
  avgRate: number;
}

interface LRXSeparator {
  type: "SEPARATOR";
  loc: PEGLocation;
}

interface LRXReport {
  type: "REPORT";
  lines: LRXReportLine[];
}

interface LRXReportLine {
  type: "REPORT_LINE";
  n: BookmarkId;
  text: string;
  loc: PEGLocation;
}

export interface LRXDocument {
  type: "DOCUMENT";
  title: LRXDocumentTitle;
  blocks: LRXBlock[];
  sep: LRXSeparator;
  report: LRXReport;
}
