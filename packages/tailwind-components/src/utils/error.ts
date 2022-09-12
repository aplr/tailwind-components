/**
 * super basic version of sprintf
 */
function format(...args: [string, ...any]) {
  let a = args[0]
  const b = []

  for (let c = 1, len = args.length; c < len; c += 1) {
    b.push(args[c])
  }

  b.forEach((d) => {
    a = a.replace(/%[a-z]/, d)
  })

  return a
}

/**
 * Create an error file out of errors.md for development and a simple web link to the full errors
 * in production mode.
 */
export default function throwStyledComponentsError(message: string, ...interpolations: any[]) {
  if (process.env.NODE_ENV === "production") {
    return new Error(
      `An error occurred. ${
        interpolations.length > 0 ? ` Args: ${interpolations.join(", ")}` : ""
      }`
    )
  } else {
    return new Error(format(message, ...interpolations).trim())
  }
}
