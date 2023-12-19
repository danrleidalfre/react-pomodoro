import { createContext, ReactNode, useState } from 'react'

interface Cycle {
  id: string
  task: string
  minutes: number
  start: Date
  interrupted?: Date
  finished?: Date
}

interface CreateCycleData {
  task: string
  minutes: number
}

interface CyclesContextType {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  secondsPassed: number
  markCycleFinished: () => void
  setActiveCycleIdNull: () => void
  onSetSecondsPassed: (seconds: number) => void
  createNewCycle: (data: CreateCycleData) => void
  interruptCycle: () => void
}

export const CyclesContext = createContext({} as CyclesContextType)

interface CyclesContextProviderProps {
  children: ReactNode
}

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [secondsPassed, setSecondsPassed] = useState(0)

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function onSetSecondsPassed(seconds: number) {
    setSecondsPassed(seconds)
  }

  function markCycleFinished() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, finished: new Date() }
        } else {
          return cycle
        }
      }),
    )
  }

  function setActiveCycleIdNull() {
    setActiveCycleId(null)
  }

  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime())

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutes: data.minutes,
      start: new Date(),
    }

    setCycles((state) => [...state, newCycle])
    setActiveCycleId(id)
    setSecondsPassed(0)
  }

  function interruptCycle() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interrupted: new Date() }
        } else {
          return cycle
        }
      }),
    )
    setActiveCycleId(null)
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        secondsPassed,
        markCycleFinished,
        setActiveCycleIdNull,
        onSetSecondsPassed,
        createNewCycle,
        interruptCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}
