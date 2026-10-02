import fs from 'fs';
import path from 'path';

function removeMinMax(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/\s*min:\s*\d+,?/g, '');
  content = content.replace(/\s*max:\s*\d+,?/g, '');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated ' + filePath);
}

['saudi.ts', 'balady.ts', 'afrangy.ts', 'afrangy-options.ts'].forEach(file => {
  removeMinMax(path.join('e:/moh bakr/jalabib-manager/src/config/garments', file));
});
