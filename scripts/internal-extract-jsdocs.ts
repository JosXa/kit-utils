// Name: Extract JSDocs to Markdown

import '@johnlindquist/kit'
import { getKenvs, getScriptFiles } from '@johnlindquist/kit/core/utils'
import { generateMarkdown, getAllDocs } from 'ts-readme'

import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const root = path.resolve(__dirname, '../')

const pattern = path.join(root, 'src', '*.ts')

const docs = await getAllDocs(pattern.replaceAll('\\', '/'))

const generatedMarkdown = docs.map((d) => generateMarkdown(d))
const readmePath = path.resolve(root, 'README.md')
const readme: string = await readFile(readmePath, 'utf-8')

const INSERT_AFTER = '## API'
const insertAfterIdx = readme.lastIndexOf(INSERT_AFTER) + INSERT_AFTER.length + 1

const final = readme.slice(0, insertAfterIdx) + '\n' + generatedMarkdown.join('\n\n')

await writeFile(readmePath, final, 'utf-8')
