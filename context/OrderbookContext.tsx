import { createContext, useState } from 'react'

interface OrderbookContextProps {
  resourceid: string,
  setResourceId: (resourceid: string) => void
}

export const OrderbookContext = createContext<OrderbookContextProps>({
    resourceid: "0x71A4A13Fa1703aDD4c6830dCd3c298f333addcbe",
    setResourceId: () => {}
})

export default function OrderbookContextProvider({ children }: { children: React.ReactNode }) {
  const [resourceid, setResourceId] = useState<string>("0x71A4A13Fa1703aDD4c6830dCd3c298f333addcbe")

  const value = {
    resourceid,
    setResourceId
  }

  return (
    <OrderbookContext.Provider value={value}>
      {children}
    </OrderbookContext.Provider>
  )
}