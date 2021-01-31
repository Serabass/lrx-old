{
  function extractList(list, index) {
    return list.map(function(element) { return element[index]; });
  }

  function buildList(head, tail, index) {
    return [head].concat(extractList(tail, index));
  }
}

Document
 =  title: Title
    blocks: Block+
    sep: Separator
    report: Report
    EOF {
      return {
        type: 'DOCUMENT',
        title,
        blocks,
        report,
        sep,
      }
    }

Title =
    title: SourceCharacter+
    NL+ {
      return {
        type: 'DOCUMENT_TITLE',
        title: title.join(''),
        loc: location(),
      }
    }

Block
  = header: BlockHeader NL
    body: BlockBodyElement* {
      let lines = body.filter(line => line.type === 'LINE');
      let rates = lines.map(line => line.avgRate);
      let newRates = [];

      for (let rate of rates) {
        if (!newRates.includes(rate)) {
          newRates.push(rate);
        }
      }

      let avgRate = newRates.length === 0 ? 0 : newRates.reduce((a, b) => a + b) / newRates.length;

      return {
        type: 'BLOCK',
        header,
        body,
        loc: location(),
        avgRate
      };
    }

    BlockBodyElement
      = ChordsLine
      / EmptyLine
      / LyricsLine

    BlockHeader 'block header'
    = '[' title: SourceCharacter+ ']' {
        return {
          type: 'BLOCK_HEADER',
          title: title.join(''),
          loc: location()
        };
      }

    EmptyLine 'empty line'
      = NL {
        return {
          type: 'EMPTY_LINE',
          loc: location()
        };
      }

    LyricsLine 'lyrics line'
      = content: LyricLineContent+ NL {
        let parts = [];
        let loc = location();

        let rates = content.map(con => {
          if (!con.bm) {
            return 0;
          }
          
          if (!con.bm.rate) {
            return 0;
          }
          
          return con.bm.rate.rate;
        });

        let newRates = [];

        for (let rate of rates) {
          if (!newRates.includes(rate)) {
            newRates.push(rate);
          }
        }

        let avgRate = newRates.length === 0 ? 0 : newRates.reduce((a, b) => a + b) / newRates.length;

        return {
          loc: loc,
          type: 'LINE',
          content: content,
          loc: location(),
          text: text(),
          avgRate
        };
      }

    LyricLineContent
      = content: SourceCharacter+ bm: LineBookmark? _ {
        return {
          type: 'LINE_CONTENT',
          content: content.join(''),
          bm,
          loc: location()
        };
      }

    LineBookmark 
      = '~' n: BookmarkId?
            rate: LineBookmarkRate? {
        return {
          type: 'LINE_BOOKMARK',
          n,
          rate,
          loc: location(),
          text: text()
        };
      }

    LineBookmarkRate
     = '+' rate: Integer {
        return {
          type: 'LINE_BOOKMARK_RATE',
          rate
        };
      }

BookmarkId
 = [0-9\.]+ {
   return text();
 }



Separator
 = '===' NL NL {
   return {
     type: 'SEPARATOR',
     loc: location()
   }
 }

Report = lines: ReportLine+ {
  return {
  	type: 'REPORT',
    lines,
  };
}

ReportLine = 
  '~' n: BookmarkId _  text: SourceCharacter+ NL+ {
  	return {
    	type: "REPORT_LINE",
        n,
        text: text.join(''),
        loc: location()
    }
  }












ChordsLine 'chord line'
= _ head: Chord tail:(_ Chord _)* _ NL {
  return {
    type: 'CHORDS_LINE',
    chords: buildList(head, tail, 1)
  }
}

Chord 'chord'
  = note: Note mod: ChordMod? suffix: ChordSuffix? {
    return {
      type: 'CHORD',
      note, mod, suffix,
      loc: location()
    };
  }

Note = [ABCDEFG]

ChordMod = [#b]

ChordSuffix
 = 'M'
 / '5'
 / '7'
 / 'm6'
 / 'm7'
 / 'm'
 / 'sus2'
 / 'sus4'
 / 'aug'












SourceCharacter 'source character'
  = [A-Za-z]
  / [А-Яа-яёЁ]
  / [0-9]
  / WhiteSpace
  / '#'
  / '?'
  / '!'

  / '"'
  / '“'
  / '”'
  / '«'
  / '»'
  / '('
  / ')'
  / '/'

  / '‘'
  / '’'
  / "'"

  / ','
  / ':'

  / '-'
  / '—'
  / '–'
  / '-'

  / '.'
  / '…'
  / '<'
  / '>'
  / '\u0301'






EOF 'end of file'
  = !.

__
  = (WhiteSpace / NL / Comment)*

_
  = (WhiteSpace / MultiLineCommentNoLineTerminator)*

WhiteSpace "whitespace"
  = "\t"
  / "\v"
  / "\f"
  / " "
  / "\u00A0"
  / "\uFEFF"

NL "end of line"
  = "\n"
  / "\r\n"
  / "\r"

Comment "comment"
  = MultiLineComment
  / SingleLineComment

MultiLineCommentNoLineTerminator
  = "/*" (!("*/" / LineTerminator) SourceCharacter)* "*/"

MultiLineComment
  = "/*" (!"*/" SourceCharacter)* "*/"

SingleLineComment
  = "//" (!LineTerminator SourceCharacter)*

LineTerminator
  = [\n\r\u2028\u2029]

Integer = [0-9]+ {
	return parseInt(text(), 10)
}
