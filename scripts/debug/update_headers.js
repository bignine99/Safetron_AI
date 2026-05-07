const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if(file.endsWith('.tsx')) results.push(file);
    }
  });
  return results;
}

const files = walk('src/app');
let count = 0;
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes("padding: '18px 24px 14px', borderBottom: '1px solid var(--border-default)',")) {
    content = content.replace(
      /padding: '18px 24px 14px', borderBottom: '1px solid var(--border-default)',/g,
      "height: 80, boxSizing: 'border-box', padding: '25px 24px 14px', borderBottom: '1px solid var(--border-default)',"
    );
    fs.writeFileSync(file, content);
    count++;
  }
});
console.log('Updated ' + count + ' files.');
