// Name: [kit-utils demo] Refreshable
// Exclude: false

import "@johnlindquist/kit"
import { refreshable } from ".."

await refreshable(async ({ refresh }) => {
  const res = await fetch("https://www.randomnumberapi.com/api/v1.0/random?min=100&max=1000&count=5")
  const items = await res.json()

  return arg(
    {
      name: "You can get new data using Ctrl+N",
      actions: [
        {
          name: "Refresh",
          onAction() {
            refresh()
          },
          shortcut: "ctrl+n",
          flag: "refresh",
          visible: true,
        },
      ],
    },
    items.map((x) => ({ name: x.toString(), value: x })),
  )
})
