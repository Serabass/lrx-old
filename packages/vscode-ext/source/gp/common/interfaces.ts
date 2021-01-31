export interface Album {
  avgProgress: number;
  key: string;
  songs: any[];
  sumDuration: number;
}

export interface Track {
  color: string;
  title: string;
}

export interface SongMeta {
  [key: string]: Song;
}

export interface Song {
  album: string;
  capo: number;
  comments: string[];
  cover: boolean;
  duration: number;
  durationStr: string;
  fn: string;
  hash: string;
  key: string;
  meta: SongMeta;
  mtime: string;
  progress: number;
  size: string;
  st: string;
  tab: string;
  tempo: number;
  // timecodes: Timecodes;
  title: string;
  tracks: Track[];
  tracksCount: number;
  url: string;
  year: number;
}

export interface TabMeta {
  album: any;
  artist: any;
  copyright: any;
  instructions: any;
  music: any;
  notices: any;
  size: any;
  subtitle: any;
  tabber: any;
  tempo: any;
  title: any;
  words: any;
  wordsAndMusic: any;
}
