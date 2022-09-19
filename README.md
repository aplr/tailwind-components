# Tailwind Components

Tailwind-native react components. Just like [styled-components](https://styled-components.com), without the css.

#### Before 😵‍💫

```jsx
const Button = ({ primary }) => (
  <div
    className={`flex ${
      primary ? "bg-indigo-600" : "bg-indigo-300"
    } inline-flex items-center border border-transparent text-xs font-medium rounded shadow-sm text-white hover:bg-indigo-700 focus:outline-none`}
  />
)
```

#### After 🧖

```ts
const StyledButton = tw.div`
  ${({ $primary }) => ($primary ? "bg-indigo-600" : "bg-indigo-300")}

  flex
  items-center
  border
  border-transparent
  text-xs
  font-medium
  rounded
  shadow-sm
  text-white

  hover:bg-indigo-700
  focus:outline-none
`

<StyledButton $primary={false}>
```

## Features

💅 Compatible with Styled Components

⚡️ Use it like any other React Component

🤯 No lines exceeding max line length

🧘 Cleaner code in the render function

## Install

> You have to install and configure Tailwind CSS to use this extension. [Install TailwindCSS](https://tailwindcss.com/docs/installation)

```bash
npm install --save @aplr/tailwind-components
```

#### VSCode IntelliSense

First, install [Tailwind CSS IntelliSense VSCode extension](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

Then, add the following settings to your user or workspace settings ([How to edit VSCode settings?](https://code.visualstudio.com/docs/getstarted/settings))

```json
{
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  },
  "editor.quickSuggestions": {
    "strings": true
  },
  "tailwindCSS.experimental.classRegex": [
    "tw(?:(?:(?:(?:\\[[.*]+\\])|(?:\\.[^`]+))+)|(?:\\(.+\\)))(?:<.+>)?`([^`]*)`",
    "tss`([^`]*)`"
  ]
}
```

## Usage

Import the `tw` helper and use it to define React components styled with TailwindCSS.

```js
import tw from "@aplr/tailwind-components"
import { render } from "react-dom"

const Button = tw.button`
  inline-flex
  flex-row
  items-center
  justify-center
  bg-indigo-500
  hover:bg-indigo-700
`

render(<Button>Click me!</Button>)
```

#### HTML

```html
<button class="inline-flex flex-row items-center justify-center bg-indigo-500 hover:bg-indigo-700">
  Click me!
</button>
```

### Interpolations

Tailwind Components support interpolations in the template syntax. The most common use are conditional class names, as shown in the following example.

```tsx
interface ButtonProps {
  $primary: boolean
}

const Button = tw.button<ButtonProps>`
  inline-flex
  ${({ $primary }) => ($primary ? "bg-indigo-600" : "bg-indigo-300")}
`

render(<Button $primary />)
```

#### HTML

```html
<button class="inline-flex bg-indigo-600">
  <!-- children -->
</button>
```

> Be sure to set the entire class name
>
> ✅&nbsp;`${({ $primary }) => $primary ? "bg-indigo-600" : "bg-indigo-300"}`
>
> ❌&nbsp;`bg-indigo-${({ $primary }) => $primary ? "600" : "300"}`

### Transient props

Tailwind Components support [transient props](https://styled-components.com/docs/api#transient-props). Prefixing prop names with a dollar sign ($) prevents them being forwarded to the DOM.

### Extend a Tailwind Component

```tsx
const RedButton = tw<ButtonProps>(Button)`
  ${({ $primary }) => ($primary ? "bg-red-600" : "bg-red-300")}
`

render(<RedButton $primary />)
```

#### HTML

```html
<button class="inline-flex bg-red-600">
  <!-- children -->
</button>
```

### Extend a Styled Component

```js
const StyledComponent = styled.div`
  filter: blur(1px);
`

const  = tw(StyledComponent)`
  flex
`
```

#### HTML:

```html
<div class="flex" style="filter: blur(1px);">
  <!-- children -->
</div>
```

### Polymorphic Components

In order to change the underlying component, you can pass the component to be rendered to the `$as` prop at runtime. The styles will stay the same, just the element is changed.

```js
const Button = tw.button`inline-flex items-center p-2`

<Button $as="a" href="#">Click me!</Button>
```

#### HTML

```html
<a href="#" class="inline-flex items-center p-2">Click me!</a>
```

## Advanced Example

```tsx
import { ComponentProps, ElementType, PropsWithChildren } from "react"
import tw, { tss } from "@aplr/tailwind-components"

const ButtonSizes = {
  xs: tss`rounded px-3 py-1.5 text-xs`,
  sm: tss`rounded-sm px-4 py-2 text-sm`,
  md: tss`rounded-md px-5 py-2 text-sm`,
  lg: tss`rounded-md px-6 py-2 text-base`,
  xl: tss`rounded-md px-7 py-3 text-lg`,
}

const ButtonStyles = {
  primary: tss`bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500`,
  secondary: tss`bg-blue-100 text-blue-700 hover:bg-blue-200 focus:ring-blue-500`,
  light: tss`bg-white text-gray-700 hover:bg-gray-50 border-gray-300 focus:ring-blue-500`,
  success: tss`bg-green-600 text-white hover:bg-green-700 focus:ring-green-500`,
  danger: tss`bg-red-600 text-white hover:bg-red-700 focus:ring-red-500`,
  dark: tss`bg-zinc-800 text-white hover:bg-zinc-900 focus:ring-zinc-500`,
}

export type ButtonSize = keyof typeof ButtonSizes

export type ButtonStyle = keyof typeof ButtonStyles

type ButtonOwnProps<E extends ElementType> = PropsWithChildren<{
  as?: E
  size?: ButtonSize
  style?: ButtonStyle
  pill?: boolean
}>

type ButtonProps<E extends ElementType> = ButtonOwnProps<E> & ComponentProps<E>

type StyledButtonProps = {
  $size: ButtonSize
  $style: ButtonStyle
  $pill: boolean
}

const StyledButton = tw.button<StyledButtonProps>`
  inline-flex
  items-center
  border
  border-transparent
  font-medium
  shadow-sm
  focus:outline-none
  focus:ring-2
  focus:ring-offset-2
  cursor-pointer

  ${({ $style }) => ButtonStyles[$style]}
  ${({ $size }) => ButtonSizes[$size]}
  ${({ $pill }) => $pill && "rounded-full"}
`

export const Button = <E extends ElementType = "button">({
  as,
  size = "md",
  style = "primary",
  pill = false,
  children,
  ...props
}: ButtonProps<E>) => (
  <StyledButton $as={as} $style={style} $size={size} $pill={pill} {...props}>
    {children}
  </StyledButton>
)

render(
  <Button as="a" href="#" size="lg" style="light" pill>
    Click me!
  </Button>
)
```
