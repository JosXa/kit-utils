import { parseExportedFunctionsAsync, renderFunctionDataToMarkdown } from 'generate-ts-docs'

import path from 'path'

// const testFile = path.join(root, 'src', '*.ts')
//
// const glob = testFile.replaceAll('\\', '/')
// console.log(glob)
const functionsData = await parseExportedFunctionsAsync(['./src/*.ts'], { tsconfigFilePath: './tsconfig.json' })
console.log({ functionsData })
for (const functionData of functionsData) {
  console.log(renderFunctionDataToMarkdown(functionData))
  // await div(JSON.stringify(renderFunctionDataToMarkdown(functionData)))
}


import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
