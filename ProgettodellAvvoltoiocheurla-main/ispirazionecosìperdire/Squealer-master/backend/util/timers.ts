import {
  getAllTimers,
  postTimedSqueal,
  setSquealInterval,
} from "../database/querys/timedSqueal";
import { ErrorCodes, ErrorDescriptions, Error } from "./errors";
import { TimedSqueal } from "./types";

/**
 * funzione che attiva tutti i timer (da usare all'avvio del server)
 */
export async function startAllTimer() {
  const squeals: any = await getAllTimers();
  if (!squeals.code) {
    for (let i of squeals) {
      await startTimer(i as TimedSqueal);
    }
  } else return new Error(ErrorDescriptions.no_timers, ErrorCodes.no_timers);
}

/**
 * funzione che inizializza un timer per uno squeal automatizzato
 * @param squeal lo squeal da postare
 * @param time il tempo necessario per postare uno squeal
 * @param id id dello squeal
 */
export async function startTimer(squeal: TimedSqueal) {
  const interval: any = setInterval(async () => {
    await postTimedSqueal(squeal);
  }, squeal.time);
  await setSquealInterval(squeal, interval);
}

/**
 * funzione che ferma un post automatico
 * @param squeal squeal automatico da fermare
 */
export async function stopTimer(squeal: TimedSqueal) {
  clearInterval(squeal.intervalId);
}
