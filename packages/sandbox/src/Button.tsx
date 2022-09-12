import tw, { tss } from "@fruitsco/twc"
import { ComponentProps, ElementType, PropsWithChildren } from "react"

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

const StyledButton = tw.button<{ $size: ButtonSize; $style: ButtonStyle; $pill: boolean }>`
bg-red-600
inline-flex
items-center
justify-center
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
