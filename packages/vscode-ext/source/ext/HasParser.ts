import * as vscode from "vscode";
import { parser } from "@serabass/lrx";
import lerp from "@sunify/lerp-color";

interface LRXDocument {
  blocks: any[];
  title: any;
}

interface IParsedToken {
  line: number;
  startCharacter: number;
  length: number;
  tokenType?: string;
  tokenModifiers?: string[];
}

export class HasParser {
  public parse(document: vscode.TextDocument) {
    const doc = parser.parse(document.getText());

    return new Parser(doc);
  }
  public parseText(text: string) {
    const doc = parser.parse(text);

    return new Parser(doc);
  }
}

export class Parser {
  constructor(public parsedDocument: LRXDocument) {}

  public findChord(
    document: vscode.TextDocument,
    position: vscode.Position
  ): vscode.Range | undefined {
    for (let block of this.parsedDocument.blocks) {
      let lines = block.body.filter((line) => line.type === "CHORDS_LINE");

      for (let line of lines) {
        for (let chord of line.chords) {
          if (
            chord.loc.start.line - 1 === position.line &&
            chord.loc.end.line - 1 === position.line
          ) {
            if (
              chord.loc.start.column <= position.character &&
              chord.loc.end.column >= position.character
            ) {
              return document.getWordRangeAtPosition(position);
            }
          }
        }
      }
    }
  }

  public findBlockHeader(position: vscode.Position) {
    let range: vscode.Range | undefined;
    let block;
    for (let block_ of this.parsedDocument.blocks) {
      if (
        block_.header.loc.start.line - 1 === position.line &&
        block_.header.loc.start.column - 1 <= position.character &&
        block_.header.loc.end.column >= position.character
      ) {
        const posStart = new vscode.Position(
          block_.header.loc.start.line - 1,
          block_.header.loc.start.column - 1
        );
        const posEnd = new vscode.Position(
          block_.header.loc.end.line - 1,
          block_.header.loc.end.column - 1
        );

        range = new vscode.Range(posStart, posEnd);
        block = block_;
        break;
      }
    }

    return {
      range,
      block,
    };
  }

  public findLineColors() {
    let result: vscode.ColorInformation[] = [];
    let from = "#FC3F4D";
    let to = "#389E28";

    for (let block of this.parsedDocument.blocks) {
      // TODO Add color to header
      for (let line of block.body) {
        if (line.type === "LINE") {
          let rates: number[] = line.content
            .map((l) => l.bm)
            .map((bm) => (bm ? bm?.rate?.rate : 0) || 0);

          let avgRate =
            rates.length > 0
              ? rates.reduce((a, b) => a + b, 0) / rates.length
              : 0;

          if (avgRate === 5) {
            continue;
          }

          if (isNaN(avgRate)) {
            debugger;
          }

          let color = lerp(from, to, avgRate / 5);

          if (!color) {
            continue;
          }

          let m = color.match(/#([A-F0-9]{2})([A-F0-9]{2})([A-F0-9]{2})/i);
          if (!m) {
            continue;
          }

          let r = parseInt(m[1], 16);
          let g = parseInt(m[2], 16);
          let b = parseInt(m[3], 16);
          let col = new vscode.Color(r / 255, g / 255, b / 255, 1);

          let start = new vscode.Position(
            line.loc.start.line - 1,
            line.text.length
          );
          let end = new vscode.Position(
            line.loc.start.line - 1,
            line.text.length + 1
          );
          let range = new vscode.Range(start, end);

          let ci = new vscode.ColorInformation(range, col);
          result.push(ci);
        }
      }
    }

    return result;
  }

  public findHighlight() {
    let r: IParsedToken[] = [];
    r.push({
      line           : this.parsedDocument.title.loc.start.line - 1,
      startCharacter : this.parsedDocument.title.loc.start.column - 1,
      length         : this.parsedDocument.title.title.length,
      tokenType      : "keyword", // tokenData.tokenType,
      tokenModifiers : ["declaration"], // tokenData.tokenModifiers
    });

    for (let block of this.parsedDocument.blocks) {
      let { header } = block;

      r.push({
        line           : header.loc.start.line - 1,
        startCharacter : header.loc.start.column - 1,
        length         : header.loc.end.column,
        tokenType      : "string", // tokenData.tokenType,
        tokenModifiers : ["declaration"], // tokenData.tokenModifiers
      });

      for (let line of block.body) {
        try {
          if (line.type === "CHORDS_LINE") {
            for (let chord of line.chords) {
              r.push({
                line           : chord.loc.start.line - 1, 
                startCharacter : chord.loc.start.column - 1,
                length         : chord.loc.end.column,
                tokenType      : "regexp", // tokenData.tokenType,
                tokenModifiers : ["declaration"], // tokenData.tokenModifiers
              });
            }
          } else if (line.type === "LINE") {
            for (let content of line.content) {
              let bm = content.bm;

              r.push({
                line           : bm.loc.start.line - 1,
                startCharacter : bm.loc.start.column - 1,
                length         : bm.text ? bm.text.length : 0,
                tokenType      : "comment", // tokenData.tokenType,
                tokenModifiers : [], // tokenData.tokenModifiers
              });
            }
          }
        } catch (e) {
          // debugger;
        }
      }
    }

    // for (let i = 0; i < lines.length; i++) {
    //   r.push({
    //     line: i,
    //     startCharacter: openOffset + 1,
    //     length: closeOffset - openOffset - 1,
    //     tokenType: undefined, // tokenData.tokenType,
    //     tokenModifiers: undefined, // tokenData.tokenModifiers
    //   });
    // }
    return r;
  }
}
