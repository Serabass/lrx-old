/**
 * Дорожка
 */
export class Track {
  /**
   * RGB-цвет дорожки
   */
  public color: string;

  /**
   * Название дорожки
   */
  public iconId: number;

  /**
   * Краткое название дорожки
   */
  public lyrics: string[];

  /**
   * Краткое название дорожки
   */
  public shortTitle: string;

  /**
   * Звуковой банк
   */
  public sound: any;

  /**
   * Название дорожки
   */
  public title: string;

  /**
   * Конструктор
   *
   * @param options
   */
  public constructor({ title, iconId, sound, color, shortTitle, lyrics }) {
    this.title = title;
    this.iconId = iconId;
    this.sound = sound;
    this.color = color;
    this.shortTitle = shortTitle;
    this.lyrics = lyrics;
  }

  /**
   * Цвет дорожки в HEX-формате
   */
  public get colorHex() {
    return this.color
      .split(".")
      .map((c) => parseInt(c, 10).toString(16))
      .join("");
  }
}

export interface TabSection {
  title: string;
}

export interface TabPreferences {
  tempo: {
    constantTempo: number;
    fromTempo: number;
    isActive: boolean;
    mode: string; // "Constant" | "..."
    repeatCount: number;
    step: number;
    toTempo: number;
  };
  tonality: {
    isActive: boolean;
    value: number;
  };
  view: {
    globalViewHeight: number;
  };
}

export interface Meta {
  /**
   * Название альбома
   */
  album: string;

  /**
   * Исполнитель
   */
  artist: string;

  /**
   * Копирайт
   */
  copyright: string;

  /**
   * Инструкции
   */
  instructions: string;

  /**
   * Автор музыки
   */
  music: string;

  /**
   * Примечание
   */
  notices: string;

  /**
   * Настройки
   */
  preferences: TabPreferences;

  sections: TabSection[];
  /**
   * Размер
   */
  size: string[];

  /**
   * Дополнительная подпись
   */
  subtitle: string;

  /**
   * Аранжировщик
   */
  tabber: string;

  /**
   * Темп
   */
  tempo: number[];

  /**
   * Название композиции
   */
  title: string;

  /**
   * Дорожки
   */
  tracks: Track[];
  /**
   * Версия Guitar Pro
   */
  version: string;

  /**
   * Автор стихов
   */
  words: string;
}
