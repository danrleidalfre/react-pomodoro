import { CountDownContainer, Separator } from './styles'
import { useContext, useEffect } from 'react'
import { differenceInSeconds } from 'date-fns'
import { CyclesContext } from '../../../../contexts/CyclesContext.tsx'

export function Countdown() {
  const {
    activeCycle,
    activeCycleId,
    secondsPassed,
    markCycleFinished,
    setActiveCycleIdNull,
    onSetSecondsPassed,
  } = useContext(CyclesContext)

  const totalSeconds = activeCycle ? activeCycle.minutes * 60 : 0
  const currentSeconds = activeCycle ? totalSeconds - secondsPassed : 0

  const min = Math.floor(currentSeconds / 60)
  const sec = currentSeconds % 60

  const minutes = String(min).padStart(2, '0')
  const seconds = String(sec).padStart(2, '0')

  useEffect(() => {
    if (activeCycle) {
      document.title = `${activeCycle.task} - ${minutes}:${seconds}`
    } else {
      document.title = 'React Pomodoro'
    }
  }, [activeCycle, minutes, seconds])

  useEffect(() => {
    let interval: number

    if (activeCycle) {
      interval = setInterval(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.start,
        )

        if (secondsDifference >= totalSeconds) {
          markCycleFinished()
          onSetSecondsPassed(totalSeconds)
          setActiveCycleIdNull()
          clearInterval(interval)
        } else {
          onSetSecondsPassed(secondsDifference)
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [activeCycle, activeCycleId, totalSeconds, markCycleFinished])

  return (
    <CountDownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountDownContainer>
  )
}
