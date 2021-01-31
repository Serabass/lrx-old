import fs from "fs";

export let fse = {
  readFile: (file: string) => {
    return new Promise<Buffer>((resolve, reject) => {
      fs.readFile(file, (err, res) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(res);
      });
    });
  },
};
