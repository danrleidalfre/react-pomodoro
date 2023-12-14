import { Play } from 'phosphor-react'
import {
  CountDownContainer,
  FormContainer,
  HomeContainer,
  InputMinutes,
  InputTask,
  Separator,
  StartCountDownButton,
} from './styles.ts'

export function Home() {
  return (
    <HomeContainer>
      <form>
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <InputTask
            id="task"
            list="suggestions"
            placeholder="Dê um nome para seu projeto"
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
            min={5}
            max={60}
          />

          <span>minutos.</span>
        </FormContainer>

        <CountDownContainer>
          <span>0</span>
          <span>0</span>
          <Separator>:</Separator>
          <span>0</span>
          <span>0</span>
        </CountDownContainer>

        <StartCountDownButton type="submit">
          <Play />
          Começar
        </StartCountDownButton>
      </form>
    </HomeContainer>
  )
}
