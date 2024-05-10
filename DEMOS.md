### Error

```ts
import "@johnlindquist/kit"
import { error } from "@josxa/kit-utils"

try {
  throw new Error("Something went wrong!")
} catch (err) {
  await error(err, "Houston, we have a problem!")
}

await error("This is just a string", "A title")
await error({ this: "is", an: "object" })

try {
  await get("https://some.definitely.invalid-url")
} catch (err) {
  await error(err, "Here's an Axios error!")
}

```

### Refreshable

```ts
import "@johnlindquist/kit"
import { refreshable } from "@josxa/kit-utils"

await refreshable(async (refresh) => {
  const res = await fetch("http://www.randomnumberapi.com/api/v1.0/random?min=100&max=1000&count=5")
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

```

### With CRUD Cache

```ts
import "@johnlindquist/kit"
import { withCRUDCache } from "@josxa/kit-utils"

const result = await withCRUDCache(() =>
  arg({ placeholder: "Select a city (includes your previous answers)" }, ["Berlin", "Stockholm"]),
)

await div(`You selected: ${result}`)

```

