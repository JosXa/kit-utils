{
  functionsData: [
    {
      description: null,
      jsDocTags: null,
      name: 'crudArg',
      parameters: [Array],
      returnType: [Object],
      type: 'function',
      typeParameters: [Array]
    },
    {
      description: null,
      jsDocTags: null,
      name: 'crudArg',
      parameters: [Array],
      returnType: [Object],
      type: 'function',
      typeParameters: [Array]
    },
    {
      description: null,
      jsDocTags: null,
      name: 'DEFAULT_CAPTIONS',
      parameters: null,
      returnType: null,
      type: '{\n' +
        '    addItemPrompt: string;\n' +
        '    addItemAction: string;\n' +
        '    editItemAction: string;\n' +
        '    removeItemAction: string;\n' +
        '    editItemHint: string;\n' +
        '}',
      typeParameters: null
    },
    {
      description: null,
      jsDocTags: null,
      name: 'DEFAULT_SHORTCUTS',
      parameters: null,
      returnType: null,
      type: '{\n    addItem: string;\n    removeItem: string;\n}',
      typeParameters: null
    },
    {
      description: null,
      jsDocTags: null,
      name: 'error',
      parameters: [Array],
      returnType: [Object],
      type: 'function',
      typeParameters: []
    },
    {
      description: null,
      jsDocTags: null,
      name: 'FORCE_REFRESH',
      parameters: null,
      returnType: null,
      type: 'unique symbol',
      typeParameters: null
    },
    {
      description: null,
      jsDocTags: [Object],
      name: 'refreshable',
      parameters: [Array],
      returnType: [Object],
      type: 'function',
      typeParameters: [Array]
    },
    {
      description: null,
      jsDocTags: null,
      name: 'withCRUDCache',
      parameters: [Array],
      returnType: [Object],
      type: 'function',
      typeParameters: [Array]
    }
  ]
}
# crudArg&lt;T&gt;(prompt [, config])

***Type parameters***

- **`T`** (`string`)

***Parameters***

- **`prompt`** (`string`)
- **`config`** (`Partial<CrudArgConfig<T>>`) – *Optional.*

***Return type***

```
Promise<T>
```

# crudArg&lt;T&gt;(prompt, config)

***Type parameters***

- **`T`** (`{ name: string; }`)

***Parameters***

- **`prompt`** (`string`)
- **`config`** (`{ convertUserInput: (userInput: string) => T | Promise<T>; } & Partial<CrudArgConfig<T>>`)

***Return type***

```
Promise<T>
```

# DEFAULT_CAPTIONS

(`{
    addItemPrompt: string;
    addItemAction: string;
    editItemAction: string;
    removeItemAction: string;
    editItemHint: string;
}`)

# DEFAULT_SHORTCUTS

(`{
    addItem: string;
    removeItem: string;
}`)

# error(err [, title])

***Parameters***

- **`err`** (`any`)
- **`title`** (`string`) – *Optional.*

***Return type***

```
Promise<void>
```

# FORCE_REFRESH

(`unique symbol`)

# refreshable&lt;T&gt;(prompt [, hint])

***Type parameters***

- **`T`**

***Parameters***

- **`prompt`** (`(refresh: () => typeof FORCE_REFRESH, resolve: (value: T) => void) => T | Promise<T>`) – An async callback accepting a `refresh` function to execute your prompt
- **`hint`** (`string | undefined`) – *Optional.* The hint to show while refreshing

***Return type***

```
Promise<T>
```

# withCRUDCache&lt;T&gt;(prompt [, config])

***Type parameters***

- **`T`** (`string`)

***Parameters***

- **`prompt`** (`() => Promise<T>`)
- **`config`** (`Partial<CrudMenuConfig<T>>`) – *Optional.*

***Return type***

```
Promise<unknown>
```

