export interface ConfigTrackRule {
  color: string;
  instrumentTitle: string[];
  VST: [];
  VSTi: [];
}

export interface AppConfig {
  allowedSectionNames: string[];

  audio: {
    root: string;
  };

  colorSeparator: string;

  jenkins: {
    API_TOKEN: string;
    HOST: string;
    JOBNAME: string;
    PORT: string;
    TOKEN: string;
    USERNAME: string;
  };
  reaperRoot: string;
  requiredScoreMetaKeys: any;
  sectionTags: {[title: string]: string};
  tab: {
    root: string;
    scorePath: string;
  };

  tasks: string[];
  timeFormat: string;
  trackRules: {
    [trackName: string]: ConfigTrackRule
  };
}
