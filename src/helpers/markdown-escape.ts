const replacements = [
  [/\*/g, "\\*", "asterisks"],
  [/#/g, "\\#", "number signs"],
  [/\//g, "\\/", "slashes"],
  [/\(/g, "\\(", "parentheses"],
  [/\)/g, "\\)", "parentheses"],
  [/\[/g, "\\[", "square brackets"],
  [/]/g, "\\]", "square brackets"],
  [/</g, "&lt;", "angle brackets"],
  [/>/g, "&gt;", "angle brackets"],
  [/_/g, "\\_", "underscores"],
  [/`/g, "\\`", "codeblocks"],
] as const

export const markdownEscape = (string: string, skips: (typeof replacements)[number][2][]): string => {
  skips = skips || []
  return replacements.reduce((string, replacement) => {
    const name = replacement[2]
    return name && skips.indexOf(name) !== -1 ? string : string.replace(replacement[0], replacement[1])
  }, string)
}

/*
MIT License

Copyright (c) Kyle E. Mitchell

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
  distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

  The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
