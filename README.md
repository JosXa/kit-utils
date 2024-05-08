# kit-utils

A [Script Kit](https://scriptkit.com) environment ([what is a Kenv?](https://gist.github.com/BeSpunky/4595a7a783b74802b8cb5301d91efa55)) with UI 
utilities and other scripting goodies.

Except for some demos, this repo does not contain any runnable scripts and is meant to be used as a TypeScript library you
can reference in your own scripts.

## Installation


> [!TIP]
> This package can either be used as a [kenv](https://gist.github.com/BeSpunky/4595a7a783b74802b8cb5301d91efa55), or be 
> installed via NPM. 
> 
> #### Which should I choose?
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

### `crudArg` (function)

**Parameters:**

- prompt (`string`) 
- config (`Partial<CrudArgConfig<T>>`) 

**returns:** Promise<T>



### `crudArg` (function)

**Parameters:**

- prompt (`string`) 
- config (`{ convertUserInput: (userInput: string) => T | Promise<T>; } & Partial<CrudArgConfig<T>>`) 

**returns:** Promise<T>



### `crudArg` (function)

Implementation

**Parameters:**

- prompt (`string`) 
- { addItemPrompt = 'Create Item', dbKey = slugify(prompt, { lower: true, trim: true, remove: /[.\-:?]/g, replacement: '_' }), selectOnAdd = true, ...rest } (`Partial<CrudArgConfig<T>> | ({ convertUserInput?: (userInput: string) => T | Promise<T>; } & Partial<CrudArgConfig<T>>)`) 

**returns:** Promise<T>



### `FORCE_REFRESH` (variable: unique symbol)



### `refreshable` (function)

**Parameters:**

- prompt (`(refresh: () => unique symbol, resolve: (value: T) => void) => T | Promise<T>`) - An async callback accepting a `refresh` function to execute your prompt
- hint (`string`) - The hint to show while refreshing

**returns:** Promise<T>

```ts
await refreshable(async (refresh) => {
  const res = await fetch('http://www.randomnumberapi.com/api/v1.0/random?min=100&max=1000&count=5')
  const items = await res.json()

  return arg(
    {
      name: 'You can get new data using Ctrl+N',
      actions: [{
        name: 'Refresh',
        onAction() {
          refresh()
        },
        shortcut: 'ctrl+n',
        flag: 'refresh',
        visible: true
      }],
    },
    items.map((x) => ({ name: x.toString(), value: x })),
  )
})
```



### `typedObjectKeys` (function)

Like Object.keys, but ensures the result matches the literal keys of the passed-in object.
Normally, Object.keys returns `string[]`.

**Parameters:**

- obj (`T`) 

**returns:** (keyof T)[]



### `typedObjectEntries` (function)

Like Object.entries, but ensures the result matches the literal keys and values of the passed-in object.
Normally, Object.entries returns `[string, T][]`.

**Parameters:**

- obj (`T`) 

**returns:** EntriesOf<T>



### `typedObjectValues` (function)

Like Object.values, but works with any object-like type (even interfaces).

**Parameters:**

- obj (`T`) 

**returns:** T[keyof T][]



### `typedFromEntries` (function)

Reconstructs an object from an array of [key, value] pairs, ensuring the result matches the literal keys and values
of the original object type. This is a type-safe version of Object.fromEntries.

**Parameters:**

- entries (`T[]`) 

**returns:** ObjectFromEntries<T[]>



### `typedMapEntries` (function)

[object Object],[object Object],[object Object]

**Parameters:**

- entries (`readonly T[]`) 
- mapper (`(kvp: T) => TMapped`) 

**returns:** TMapped[]



### `mapObjectEntries` (function)

[object Object],[object Object],[object Object]

**Parameters:**

- obj (`T`) 
- mapper (`([a, b]: KeyValuePairsOf<T>) => TMapped`) 

**returns:** ObjectFromEntries<TMapped[]>



### `isKey` (function)

[object Object],[object Object],[object Object],[object Object],[object Object]

**Parameters:**

- obj (`T`) 
- key (`PropertyKey`) 

**returns:** boolean



### `WithCRUD` (class)



### `withCRUDCache` (function)

**Parameters:**

- prompt (`() => Promise<T>`) 
- config (`Partial<CrudMenuConfig<T>>`) 

**returns:** Promise<unknown>

