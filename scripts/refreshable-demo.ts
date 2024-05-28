// Name: [kit-utils demo] Refreshable
// Exclude: false

import "@johnlindquist/kit"
import { refreshable } from ".."

await refreshable(async ({ refresh, refreshCount }) => {
  const res = await fetch("https://www.randomnumberapi.com/api/v1.0/random?min=100&max=1000&count=5")
  const items = await res.json()

  return div({
    html: md(
      `# You can get new data using <kbd>${isMac ? "Cmd" : "Ctrl"} + N</kbd>
    
(you've done that ${refreshCount} times already 😉)

${items.map((x) => `- ${x}`).join("\n")}
`,
    ),
    shortcuts: [
      {
        name: "Refresh",
        onPress() {
          refresh()
        },
        key: `${cmd}+n`,
        flag: "refresh",
        visible: true,
      },
    ],
  })
})
