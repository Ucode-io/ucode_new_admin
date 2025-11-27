import {KeepAlive} from "react-activation"
import { useLocation } from "react-router-dom"

const KeepAliveWrapper = ({ children }) => {
  const { pathname } = useLocation()

  return (
    <KeepAlive name={`${pathname}`} key={`${pathname}`} cacheKey={`${pathname}`} when={false}>
      {children}
    </KeepAlive>
  )
}

export default KeepAliveWrapper
