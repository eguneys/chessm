export const Paragraph = 1,
Heading = 2,
Ply = 3;

export const Code = 1,
Text = 2;

export function parseCode(code) {
  const mainLine = /^([a-zA-Z][^\s]*) (.*)/;
  const variationRegex = /^([a-zA-Z][^\s]*) ([a-zA-Z][^\s|^\/]*) (.*)/;
  let match;

  code = code.substring(1, code.length - 1);

  if ((match = code.match(variationRegex))) {
    let [_, variation, base, line] = match;
    return { variation, base, line };
  }

  if ((match = code.match(mainLine))) {
    let [_, variation, line] = match;
    return { variation, line };
  }


  return { line: code };
}

export function parseParagraph(para) {
  const codeBeginRegex = /^</,
        codeEndRegex = />$/;

  let cur = Text,
      acc = [];
  let res = [];

  para.split(' ').forEach(_ => {
    let match;

    if (cur === Text) {
      if ((match = _.match(codeBeginRegex))) {
        res.push({ type: Text, content: acc.join(' ') + ' ' });
        cur = Code;
        acc = [_];

        if ((match = _.match(codeEndRegex))) {
          res.push({ type: Code, content: acc.join(' ') });
          cur = Text;
          acc = [];
        }
      } else {
        acc.push(_);
      }
    } else if (cur === Code) {
      if ((match = _.match(codeEndRegex))) {
        acc.push(_);
        res.push({ type: Code, content: acc.join(' ') });
        cur = Text;
        acc = [];
      } else {
        acc.push(_);
      }
    }
  });

  if (acc.length > 0) {
    res.push({ type: cur, content: acc.join(' ') });
  }

  return res;
}

export function parseParagraphFull(para) {
  return parseParagraph(para).map(_ => {
    if (_.type === Code) {
      _.content = parseCode(_.content);
    }
    return _;
  });
}

export function parseMdFull(md) {
  return parseMd(md).map(_ => {
    if (_.type === Paragraph) {
      _.content = parseParagraphFull(_.content);
    }
    return _;
  });
}

export function parseMd(md) {
  const headingRegex = /^#([^\n]*)/;
  const plyRegex = /^=([^\n]*)/;

  let paragraph = [];
  let res = [];
  let lines = md.split('\n');
  let pos = 0;

  lines.forEach(line => {
    if (line === "") {
      if (paragraph.length) {
        let content = paragraph.join('\n');
        res.push({ type: Paragraph, pos, content });
        paragraph = [];
        pos += content.length + 1;
      }
      pos += 1;
      return;
    }

    let match;

    if ((match = line.match(plyRegex))) {
      let content = paragraph.join('\n');
      if (paragraph.length) {
        res.push({ type: Paragraph, pos, content });
        paragraph = [];
        pos += content.length + 1;
      }

      content = match[1];
      res.push({ type: Ply, pos, content });
      pos += content.length + 2;
    } else if ((match = line.match(headingRegex))) {
      let content = paragraph.join('\n');
      if (paragraph.length) {
        res.push({ type: Paragraph, pos, content });
        paragraph = [];
        pos += content.length + 1;
      }

      content = match[1];
      res.push({ type: Heading, pos, content });
      pos += content.length + 2;
    } else {
      paragraph.push(line);
    }
  });

  if (paragraph.length) {
    let content = paragraph.join('\n');
    res.push({ type: Paragraph, pos, content });
    paragraph = [];
    pos += content.length;
  }

  return res;

}
