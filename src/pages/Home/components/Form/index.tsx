import { FormContainer, InputMinutes, InputTask } from './styles'
import { useContext } from 'react'
import { CyclesContext } from '../../index.tsx'
import { useFormContext } from 'react-hook-form'

export function Form() {
  const { activeCycle } = useContext(CyclesContext)
  const { register } = useFormContext()

  return (
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
  )
}
