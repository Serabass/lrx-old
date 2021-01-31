Expression = lines: Line+ EOF {
	return {
  	lines
  };
}

Line
= name: ChordName _ ':' _ str: Strings+ NL? {
	return {
  	type: "LINE",
    name, str
  }
}

ChordName 'chord name'
= note: ChordNote mod: ChordMod? suffix: ChordSuffix? {
	return {
  	type: "CHORD_NAME",
    note,
    mod,
    suffix
  }
}

ChordNote = [ABCDEFG]

ChordMod = [#b]

Strings = __ chars: StringChar+ __ {
	return {
  	type: 'STRINGS',
    chars: chars.join('')
  }
}

StringChar = [x0-9ABCDEF]

ChordSuffix
 = 'M'
 / '5'
 / '6'
 / '7'
 / 'm6'
 / 'm7'
 / 'm'
 / 'maj'
 / 'min'
 / 'sus2'
 / 'sus4'
 / 'aug'
 / 'add9'

__
  = (WhiteSpace / Comment)*

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

SourceCharacter 'source character'
  = [A-Za-z]
  / [А-Яа-яёЁ]
  / [0-9]
  / WhiteSpace
  
EOF = !.