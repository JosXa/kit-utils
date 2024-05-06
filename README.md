# kit-utils

A [Script Kit](https://scriptkit.com) environment ([what is a Kenv?](https://gist.github.com/BeSpunky/4595a7a783b74802b8cb5301d91efa55)) with UI 
utilities and other scripting goodies.

Except for some demos, this repo does not contain any runnable scripts and is meant to be used as a TypeScript library you
can reference in your own scripts.

## Installation


> [!TIP]
> This package can be used as a [kenv](https://gist.github.com/BeSpunky/4595a7a783b74802b8cb5301d91efa55), or be installed 
> via NPM. 
> 
> ### Which should I choose?
> - If you want to run the Demo apps 👉 **Install as kenv**
> - If you expect to be making occasional changes to the utilities here 👉 **Install as kenv**
> - If you plan on contributing 👉 **Install as kenv**
> - Otherwise 👉 **Install from NPM**


### Installing as a kenv

1. Open Script Kit
2. `Manage Kenvs` -> `Clone repo of scripts`
3. Enter Repo URL: https://github.com/JosXa/kit-utils.git
4. Leave the other options as default and accept the risks.

### Using as an NPM library

Simply paste\
`import {} from '@josxa/kit-utils'`\
into one of your scripts and wait for Kit to prompt you to install it.

Or install explicitly using `npm install @josxa/kit-utils`, you know the drill.

## Demos

After installation as a kenv, run the "Show or Hide Demos" script to get a feel for what's possible.

## API

### Prompt Helpers

#### `crudArg`

A wrapper around `arg` that remembers previous user choices, with actions to **c**reate, **r**ead, **u**pdate, and **d**elete cached entries.

_Example:_

```ts
import { crudArg } from '@josxa/kit-utils'

const city = await crudArg('Enter a city name')

await div(`You selected: ${city}`)
```

#### `refreshable`

See [Docstring](https://github.com/JosXa/kit-utils/tree/main/src/refreshable.ts#L6-L37)

_Example:_

See [Demo](https://github.com/JosXa/kit-utils/tree/main/scripts/refreshable-demo.ts)
