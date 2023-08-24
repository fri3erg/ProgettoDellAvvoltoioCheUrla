import { Error, ErrorCodes, ErrorDescriptions } from "../../util/errors";
import { Success, SuccessCode, SuccessDescription } from "../../util/success";
import { stopTimer } from "../../util/timers";
import { TimedSqueal } from "../../util/types";
import timedSquealModel from "../models/timedSqueals.model";

/**
 * funzione che ritorna tutti gli squeal temporizzati
 * @returns squeals temporizzati
 * TESTATA
 */
export async function getAllTimers() {
  try {
    const timedSqueals: TimedSqueal[] = await timedSquealModel.find();
    if (timedSqueals.length < 1)
      return new Error(ErrorDescriptions.non_existent, ErrorCodes.non_existent);
    else return timedSqueals;
  } catch (error: any) {
    console.log({ errorName: error.name, errorDescription: error.message });
  }
}

/**
 * inserisce l'id dell'interval al timedSqueal
 * @param intervalId id dell'intervallo
 */
export async function setSquealInterval(squeal: TimedSqueal, intervalId: any) {
  try {
    await timedSquealModel
      .findByIdAndUpdate(
        squeal._id,
        {
          intervalId: intervalId,
        },
        { returnDocument: "after" }
      )
      .then((newDocument) => {
        if (!newDocument)
          return new Error(
            ErrorDescriptions.non_existent,
            ErrorCodes.non_existent
          );
        else {
          if (intervalId === newDocument.intervalId) {
            return new Success(SuccessDescription.updated, SuccessCode.updated);
          } else {
            return new Error(
              ErrorDescriptions.cannot_update,
              ErrorCodes.cannot_update
            );
          }
        }
      });
  } catch (error: any) {
    console.log({ errorName: error.name, errorDescription: error.message });
  }
}

/**
 * funzione che crea uno squeal temporizzato (per farlo partire usare la funzione apposita)
 * @param squeal squeal temporizzato
 */
export async function postTimedSqueal(squeal: TimedSqueal) {
  try {
    const newSqueal: any = await timedSquealModel.create(squeal);
    if (!newSqueal)
      return new Error(
        ErrorDescriptions.cannot_create,
        ErrorCodes.cannot_create
      );
    else return new Success(SuccessDescription.created, SuccessCode.created);
  } catch (error: any) {
    console.log({ errorName: error.name, errorDescription: error.message });
  }
}

/**
 * funzione che cancella uno squeal temporizzato
 * @param id id dello squeal temporizzato
 */
export async function deleteTimedSqueal(id: string) {
  try {
    const squeal: TimedSqueal | null = (await timedSquealModel.findById(
      id
    )) as TimedSqueal;
    if (squeal === null) {
      return new Error(ErrorDescriptions.non_existent, ErrorCodes.non_existent);
    } else {
      await stopTimer(squeal);
      const deleted: any = await timedSquealModel.deleteOne(
        { _id: id },
        {
          returnDocument: "after",
        }
      );
      if (deleted.deletedCount < 1)
        return new Error(
          ErrorDescriptions.cannot_delete,
          ErrorCodes.cannot_delete
        );
      else return new Success(SuccessDescription.removed, SuccessCode.removed);
    }
  } catch (error: any) {
    console.log({ errorName: error.name, errorDescription: error.message });
  }
}
