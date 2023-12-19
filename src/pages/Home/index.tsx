import { HandPalm, Play } from 'phosphor-react'
import {
  CountDownContainer,
  FormContainer,
  HomeContainer,
  InputMinutes,
  InputTask,
  Separator,
  StartCountDownButton,
  StopCountDownButton,
} from './styles.ts'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { string } from 'zod'
import { useEffect, useState } from 'react'
import { differenceInSeconds } from 'date-fns'

const newCycleFormValidationSchema = zod.object({
  task: string().min(1, 'Informe um nome para a tarefa'),
  minutes: zod
    .number()
    .min(1, 'o cíclo precisa ser de no mínimo 5 minutos')
    .max(60, 'o cíclo precisa ser de no máximo 60 minutos'),
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle {
  id: string
  task: string
  minutes: number
  start: Date
  interrupted?: Date
  finished?: Date
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [secondsPassed, setSecondsPassed] = useState(0)

  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutes: 25,
    },
  })

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

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

  const totalSeconds = activeCycle ? activeCycle.minutes * 60 : 0
  const currentSeconds = activeCycle ? totalSeconds - secondsPassed : 0

  const min = Math.floor(currentSeconds / 60)
  const sec = currentSeconds % 60

  const minutes = String(min).padStart(2, '0')
  const seconds = String(sec).padStart(2, '0')

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`
    } else {
      document.title = 'React Pomodoro'
    }
  }, [activeCycle, minutes, seconds])

  useEffect(() => {
    let interval: number

    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.start,
        )

        if (secondsDifference >= totalSeconds) {
          setCycles((state) =>
            state.map((cycle) => {
              if (cycle.id === activeCycleId) {
                return { ...cycle, finished: new Date() }
              } else {
                return cycle
              }
            }),
          )
          setSecondsPassed(totalSeconds)
          setActiveCycleId(null)
          clearInterval(interval)
        } else {
          setSecondsPassed(secondsDifference)
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [activeCycle, activeCycleId, totalSeconds])

  const task = watch('task')
  const isButtonDisabled = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <InputTask
            id="task"
            list="suggestions"
            placeholder="Dê um nome para seu projeto"
            disabled={!!activeCycle}
            {...register('task')}
          />
          <datalist id="suggestions">
            <option value="Estudar" />
            <option value="Trabalhar" />
          </datalist>

          <label htmlFor="minutes">durante</label>
          <InputMinutes
            id="minutes"
            placeholder="00"
            type="number"
            step={5}
            min={1}
            max={60}
            disabled={!!activeCycle}
            {...register('minutes', { valueAsNumber: true })}
          />

          <span>minutos.</span>
        </FormContainer>

        <CountDownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountDownContainer>

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
