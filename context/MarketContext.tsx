import { createContext, useState } from 'react'

interface MarketContextProps {
  itemid: number,
  setItemId: (itemid: number) => void
}

export const MarketContext = createContext<MarketContextProps>({
  itemid: 1,
  setItemId: () => {}
})

export default function MarketContextProvider({ children }: { children: React.ReactNode }) {
  const [itemid, setItemId] = useState<number>(1)

  const value = {
    itemid,
    setItemId
  }

  return (
    <MarketContext.Provider value={value}>
      {children}
    </MarketContext.Provider>
  )
}