const fs = require('fs');
const parse = require('json-schema-to-markdown');

const schema = JSON.parse(fs.readFileSync('src/dictatableconfig.schema.json'));
const markdown = parse(schema);
fs.writeFileSync('dictatableconfig.md', markdown, { encoding: 'utf8' });

const dictatorschema = JSON.parse(
  fs.readFileSync('src/dictatorconfig.schema.json')
);
const dictatormarkdown = parse(dictatorschema);
fs.writeFileSync('dictatorconfig.md', dictatormarkdown, { encoding: 'utf8' });
