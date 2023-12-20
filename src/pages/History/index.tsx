import { HistoryContainer, HistoryList, Status } from './styles.ts'
import { useContext } from 'react'
import { CyclesContext } from '../../contexts/CyclesContext.tsx'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'

export function History() {
  const { cycles } = useContext(CyclesContext)

  return (
    <HistoryContainer>
      <h1>Meu Histórico</h1>
      <HistoryList>
        <table>
          <thead>
            <tr>
              <th>Tarefa</th>
              <th>Duração</th>
              <th>Início</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {cycles.map((cycle) => {
              return (
                <tr key={cycle.id}>
                  <td>{cycle.task}</td>
                  <td>{cycle.minutes} minutos</td>
                  <td>
                    {formatDistanceToNow(new Date(cycle.start), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </td>
                  <td>
                    {cycle.finished && <Status color="green">Concluído</Status>}
                    {cycle.interrupted && (
                      <Status color="red">Interrompido</Status>
                    )}
                    {!cycle.finished && !cycle.interrupted && (
                      <Status color="yellow">Em Andamento</Status>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </HistoryList>
    </HistoryContainer>
  )
}
