import { useCallback, useState } from "react"
import { Button } from "./Button"
import "./index.css"

const App = () => {
  const [count, setCount] = useState(0)

  const increaseCount = useCallback(() => {
    setCount(count + 1)
  }, [count])

  return (
    <div className="flex flex-col justify-center items-center p-4">
      <Button
        as="a"
        onClick={increaseCount}
        className="min-w-[10rem]"
      >{`Count is ${count}`}</Button>
    </div>
  )
}

export default App
