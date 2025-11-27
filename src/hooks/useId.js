import { useMemo } from "react"
import { generateID } from "../utils/generateID"




const useId = () => {

  const id = useMemo(() => {
    return generateID()
  }, [])

  return id
}

export default useId