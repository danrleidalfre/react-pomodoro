import { Cycle } from './reducer.ts'

export enum ActionTypes {
  add = 'add',
  interrupt = 'interrupt',
  finished = 'finished',
}

export function addNewCycleAction(newCycle: Cycle) {
  return {
    type: ActionTypes.add,
    payload: { newCycle },
  }
}

export function interruptCycleAction() {
  return { type: ActionTypes.interrupt }
}

export function finishCycleAction() {
  return { type: ActionTypes.finished }
}
