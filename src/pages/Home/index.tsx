import { HandPalm, Play } from 'phosphor-react'
import {
  HomeContainer,
  StartCountDownButton,
  StopCountDownButton,
} from './styles.ts'
import { createContext, useState } from 'react'
import { Form } from './components/Form'
import { Countdown } from './components/Countdown'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { string } from 'zod'

interface Cycle {
  id: string
  task: string
  minutes: number
  start: Date
  interrupted?: Date
  finished?: Date
}

interface CyclesContextType {
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  secondsPassed: number
  markCycleFinished: () => void
  setActiveCycleIdNull: () => void
  onSetSecondsPassed: (seconds: number) => void
}

export const CyclesContext = createContext({} as CyclesContextType)

const newCycleFormValidationSchema = zod.object({
  task: string().min(1, 'Informe um nome para a tarefa'),
  minutes: zod
    .number()
    .min(1, 'o cíclo precisa ser de no mínimo 5 minutos')
    .max(60, 'o cíclo precisa ser de no máximo 60 minutos'),
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [secondsPassed, setSecondsPassed] = useState(0)

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutes: 25,
    },
  })

  const { handleSubmit, watch, reset } = newCycleForm

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

  function handleCreateNewCycle(data: NewCycleFormData) {
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

    reset()
  }

  function handleInterruptCycle() {
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

  const task = watch('task')
  const isButtonDisabled = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <CyclesContext.Provider
          value={{
            activeCycle,
            activeCycleId,
            secondsPassed,
            markCycleFinished,
            setActiveCycleIdNull,
            onSetSecondsPassed,
          }}
        >
          <FormProvider {...newCycleForm}>
            <Form />
          </FormProvider>
          <Countdown />
        </CyclesContext.Provider>
        {activeCycle ? (
          <StopCountDownButton onClick={handleInterruptCycle} type="button">
            <HandPalm />
            Interromper
          </StopCountDownButton>
        ) : (
          <StartCountDownButton disabled={isButtonDisabled} type="submit">
            <Play />
            Começar
          </StartCountDownButton>
        )}
      </form>
    </HomeContainer>
  )
}
