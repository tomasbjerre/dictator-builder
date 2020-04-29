const fs = require('fs');
const parse = require('json-schema-to-markdown');
const schema = JSON.parse(fs.readFileSync('src/schema.json'));
const markdown = parse(schema);
fs.writeFileSync('dictatorconfig.md', markdown, { encoding: 'utf8' });
