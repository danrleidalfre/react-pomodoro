import { ActionTypes } from './actions.ts'

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
      return {
        ...state,
        cycles: [action.payload.newCycle, ...state.cycles],
        activeCycleId: action.payload.newCycle.id,
      }
    case ActionTypes.interrupt:
      return {
        ...state,
        cycles: state.cycles.map((cycle) => {
          if (cycle.id === state.activeCycleId) {
            return { ...cycle, interrupted: new Date() }
          } else {
            return cycle
          }
        }),
        activeCycleId: null,
      }
    case ActionTypes.finished:
      return {
        ...state,
        cycles: state.cycles.map((cycle) => {
          if (cycle.id === state.activeCycleId) {
            return { ...cycle, finished: new Date() }
          } else {
            return cycle
          }
        }),
        activeCycleId: null,
      }
    default:
      return state
  }
}
