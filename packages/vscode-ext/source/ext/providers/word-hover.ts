import * as vscode from "vscode";

export class WordHover implements vscode.HoverProvider {
  private wordRegex = new RegExp(/[A-Za-zА-Яа-яёЁ]+/);
  private chordRegex = new RegExp(/[ABCDEFG][#b]?(?:M|m|sus[24]|aug)?([567])?/);
  private sites = [
    {
      title: "RhymeZone",
      cb: (w: string) =>
        `https://www.rhymezone.com/r/rhyme.cgi?Word=${w}&typeofrhyme=perfect&org1=syl&org2=l&org3=y`,
    },
    {
      title: "Reverso",
      cb: (w: string) =>
        `https://context.reverso.net/перевод/английский-русский/${w}`,
    },
    {
      title: "Rifme.net",
      cb: (w: string) => `https://rifme.net/r/${w}`,
    },
    {
      title: "Rifmik.net",
      cb: (w: string) => `https://rifmik.net/manual/${w}`,
    },
    {
      title: "Google Translate",
      cb: (w: string) =>
        `https://translate.google.com/#view=home&op=translate&sl=en&tl=ru&text=${w}`,
    },
  ];

  private makeWordMarkdown(word: string): vscode.MarkdownString {
    const markdown = this.sites
      .map((site) => {
        return `[${site.title}](${site.cb(word)})`;
      })
      .join("\n\n");
    return new vscode.MarkdownString(markdown);
  }

  public provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    _token: vscode.CancellationToken
  ): Thenable<vscode.Hover> {
    const range = document.getWordRangeAtPosition(position, this.wordRegex);

    if (range === undefined) {
      return new Promise((resolve, _reject) => {
        resolve(); // Resolve silently. TODO Use Promise.resolve instead
      });
    }
    const word = document.getText(range);

    // if (this.chordRegex.test(word)) {
    //   return new Promise((resolve, _reject) => {
    //     resolve(); // Resolve silently.
    //   });
    // }

    return new Promise((resolve, reject) => {
      if (word.match(this.wordRegex)) {
        const markdown = this.makeWordMarkdown(word);

        resolve(new vscode.Hover(markdown));
      } else {
        reject("Not a Unicode escape.");
      }
    });
  }
  public dispose() {}
}
