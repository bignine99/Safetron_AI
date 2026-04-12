const fs = require('fs');
const filePath = 'src/components/AlivePipeline.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Replace \` with `
content = content.replace(/\\`/g, '`');
// Replace \${ with ${
content = content.replace(/\\\${/g, '${');

fs.writeFileSync(filePath, content);
console.log('Fixed AlivePipeline.tsx');
