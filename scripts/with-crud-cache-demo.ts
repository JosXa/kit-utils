// Name: [kit-utils demo] With CRUD Cache
// Exclude: false

import "@johnlindquist/kit"
import { withCRUDCache } from ".."

const result = await withCRUDCache(() =>
  arg({ placeholder: "Select a city (includes your previous answers)" }, ["Berlin", "Stockholm"]),
)

await div(`You selected: ${result}`)
