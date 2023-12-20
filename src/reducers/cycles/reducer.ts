import { ActionTypes } from './actions.ts'
import { produce } from 'immer'

export interface Cycle {
  id: string
  task: string
  minutes: number
  start: Date
  interrupted?: Date
  finished?: Date
}

interface CyclesState {
  cycles: Cycle[]
  activeCycleId: string | null
}

export function CyclesReducer(state: CyclesState, action: any) {
  switch (action.type) {
    case ActionTypes.add:
      return produce(state, (draft) => {
        draft.cycles.push(action.payload.newCycle)
        draft.activeCycleId = action.payload.newCycle.id
      })
    case ActionTypes.interrupt: {
      const currentCycleIndex = state.cycles.findIndex((cycle) => {
        return cycle.id === state.activeCycleId
      })

      if (currentCycleIndex < 0) {
        return state
      }

      return produce(state, (draft) => {
        draft.activeCycleId = null
        draft.cycles[currentCycleIndex].interrupted = new Date()
      })
    }
    case ActionTypes.finished: {
      const currentCycleIndex = state.cycles.findIndex((cycle) => {
        return cycle.id === state.activeCycleId
      })

      if (currentCycleIndex < 0) {
        return state
      }

      return produce(state, (draft) => {
        draft.activeCycleId = null
        draft.cycles[currentCycleIndex].finished = new Date()
      })
    }
    default:
      return state
  }
}
