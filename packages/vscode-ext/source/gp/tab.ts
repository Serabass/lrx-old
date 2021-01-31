import cheerio from "cheerio";
import fs from "fs";
import Zip from "zip";
import { fse } from "../ext/fse";
import { Meta, TabSection, Track } from "./common/types";

export class TrackSound {
  public name: string;
  public path: string;

  public constructor({ path, name }) {
    this.path = path;
    this.name = name;
  }

  public get fullPath() {
    return `${this.path}/${this.name}`;
  }
}

/**
 * Табулатура
 */
export class Tab {
  public static PREFERENCES_PATH = "Content/Preferences.json";
  public static SCORE_PATH = "Content/score.gpif";
  public static VERSION_PATH = "VERSION";

  /**
   * Инициализация нового таба
   * @param filename Имя файла
   */
  public static from(filename: string) {
    return new Tab(filename);
  }

  public album: string;
  public artist: string;
  public copyright: string;
  public initEndTime: number;
  public initStartTime: number;
  public instructions: string;
  public loaded: boolean;

  public md5: string;
  public music: string;
  public notices: string;
  public sections: TabSection[] = [];
  public size: string[];
  public subtitle: string;
  public tabber: string;

  public tempo: number[];
  public title: string;
  public tracks: Track[];
  public version: string;
  public words: string;

  public constructor(public filename: string) {}

  public async getScoreContents() {
    let contents = await fse.readFile(this.filename);
    let reader = Zip.Reader(contents).toObject();
    return reader[Tab.SCORE_PATH].toString("utf8");
  }

  public async getVersionContents() {
    let contents = await fse.readFile(this.filename);
    let reader = Zip.Reader(contents).toObject();
    return reader[Tab.VERSION_PATH].toString("utf8");
  }

  public async getPreferencesContents() {
    let contents = await fse.readFile(this.filename);
    let reader = Zip.Reader(contents).toObject();
    return reader[Tab.PREFERENCES_PATH].toString("utf8");
  }

  public async init(): Promise<Tab> {
    const meta = await this.read();
    this.version = meta.version;
    this.title = meta.title;
    this.artist = meta.artist;
    this.subtitle = meta.subtitle;
    this.album = meta.album;
    this.words = meta.words;
    this.music = meta.music;
    this.copyright = meta.copyright;
    this.tabber = meta.tabber;
    this.notices = meta.notices;
    this.instructions = meta.instructions;
    this.tempo = meta.tempo;
    this.size = meta.size;
    this.tracks = meta.tracks;
    this.sections = meta.sections || [];
    this.initEndTime = Date.now();

    return this;
  }

  // @CacheMethod({
  //   ttl: "1 year",
  //   storage: "file",
  //   buildKey: (obj: Tab): string =>
  //     ["Tab__read", obj.filename, obj.md5].join(cacheDelimiter),
  //   checkIsAlive: (key: string, obj: Tab) => {
  //     let [, , hash, mtime] = key.split(cacheDelimiter);
  //     return obj.md5 === hash && obj.mtime === +mtime;
  //   },
  // })
  public async read(): Promise<Meta> {
    let scoreContents = await this.getScoreContents();
    let version = await this.getVersionContents();
    let preferences = await this.getPreferencesContents();

    let $ = cheerio.load(scoreContents, { xmlMode: true });
    let $GPIF = $("GPIF");
    let $Score = $GPIF.find("Score");
    let result: Meta = {
      version,
      preferences: JSON.parse(preferences),
      title: $Score.find("Title").text(),
      artist: $Score.find("Artist").text(),
      subtitle: $Score.find("SubTitle").text(),
      album: $Score.find("Album").text(),
      words: $Score.find("Words").text(),
      music: $Score.find("Music").text(),
      copyright: $Score.find("Copyright").text(),
      tabber: $Score.find("Tabber").text(),
      notices: $Score.find("Notices").text(),
      instructions: $Score.find("Instructions").text(),

      tempo: (() => {
        return $GPIF
          .find("MasterTrack Automations Automation")
          .filter((i, el) => {
            return $("Type", el).text() === "Tempo";
          })
          .find("Value")
          .toArray()
          .map((value) => {
            let [v] = $(value).text().split(/\s+/);
            return parseInt(v, 10);
          });
      })(),

      size: (() => {
        let data = $GPIF
          .find("> MasterBars MasterBar Time")
          .toArray()
          .map((el) => $(el).text());

        let size: any[] = [];

        for (let row of data) {
          if (!size.includes(row)) {
            size.push(row);
          }
        }

        return size;
      })(),

      tracks: (() =>
        $GPIF
          .find("Tracks Track")
          .toArray()
          .map<Track>((track) => {
            let $track = $(track);

            return new Track({
              title: $track.find("> Name").text(),
              shortTitle: $track.find("> ShortName").text(),
              iconId: parseInt($track.find("> IconId").text(), 10),
              color: (() => {
                let color = $track.find("> Color").text();
                let [r, g, b] = color.split(/\s+/);

                return [r, g, b].join("."); // Use hex value instead of in additional field
              })(),
              sound: (() => {
                return $track
                  .find("> Sounds")
                  .map((i, el) => {
                    let $el = $(el);
                    let $sound = $el.find("> Sound");
                    let path = $sound.find("> Path").text();
                    let name = $sound.find("> Name").text();

                    return new TrackSound({ path, name });
                  })
                  .toArray()[0];
              })(),
              lyrics: (() => {
                return $track
                  .find("> Lyrics > Line > Text")
                  .map((i, el) => $(el).text().trim())
                  .toArray()
                  .filter((l) => !!l);
              })(),
            });
          }))(),

      sections: (() =>
        $GPIF
          .find(" > MasterBars > MasterBar > Section > Text")
          .map((i, section) => ({
            title: cheerio(section).text().trim(),
          }))
          .toArray())() as any,
    };

    return result;
  }

  /**
   * Проверяем, существует ли указанный файл таба
   */
  public get exists(): boolean {
    return fs.existsSync(this.filename);
  }

  public get initDuration(): number {
    return this.initEndTime - this.initStartTime;
  }

  /**
   * Время последнего изменения
   */
  public get mtime() {
    return this.stats.mtimeMs;
  }

  /**
   * Получаем stats
   */
  public get stats(): fs.Stats {
    return fs.statSync(this.filename);
  }
}
