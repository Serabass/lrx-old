import * as fse from "fs-extra";

export interface File {
    readonly exists: boolean;
    readonly filename: string;
    readonly md5: string;
    readonly mtime: number;
    readonly stats: fse.Stats;
}
