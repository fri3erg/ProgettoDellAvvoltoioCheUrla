import squealModel from "../models/squeals.model";
import squealGeoModel from "../models/squealGeo.model";
import squealMediaModel from "../models/squalMedia.model";
import {
  Squeal,
  TimedSqueal,
  SquealGeo,
  SquealMedia,
  Error as ErrorType,
} from "../../util/types";
import timedSquealModel from "../models/timedSqueals.model";
import { ErrorCodes, Error, ErrorDescriptions } from "../../util/errors";
import { Success, SuccessCode, SuccessDescription } from "../../util/success";
import { addSquealToChannel, getAllChannels } from "./channels";
import { stopTimer } from "../../util/timers";

//FUNZIONI GLOBALI

/**
 * funzione che ritorna tutti gli squeals non temporizzati
 * @returns tutti gli squeals
 */
export async function getAllSqueals() {
  try {
    const squealsText: Squeal[] = await squealModel.find();
    const squealsGeo: SquealGeo[] = await squealGeoModel.find();
    const squealsMedia: SquealMedia[] = await squealMediaModel.find();
    const timedSqueal: TimedSqueal[] = await timedSquealModel.find();
    const squeals: (Squeal | SquealGeo | SquealMedia | TimedSqueal)[] = [
      ...squealsText,
      ...squealsGeo,
      ...squealsMedia,
      ...timedSqueal,
    ];
    if (squeals.length < 1)
      return new Error(ErrorDescriptions.non_existent, ErrorCodes.non_existent);
    else return squeals;
  } catch (error: any) {
    console.log({ errorName: error.name, errorDescription: error.message });
  }
}

//FUNZIONI TEXT

/**
 * funzione che ritorna tutti i text squeal
 * @returns error o gli squeal text
 */
export async function getTextSqueals() {
  try {
    const squeals: any[] = await squealModel.find();
    if (squeals.length < 1)
      return new Error(ErrorDescriptions.non_existent, ErrorCodes.non_existent);
    else return squeals;
  } catch (error: any) {
    console.log({ errorName: error.name, errorDescription: error.message });
  }
}

/**
 * crea un nuovo squeal (non automatizzato)
 * @param squeal oggetto contenente i parametri dello squeal
 * @returns eventuali errori
 */
export async function postTextSqueal(squeal: Squeal) {
  try {
    const channels: any = await getAllChannels();

    const newSqueal: any = await squealModel.create({
      body: squeal.body,
      recipients: squeal.recipients,
      date: new Date(),
      category: squeal.category,
      channels: squeal.channels,
    });

    if (!newSqueal)
      return new Error(
        ErrorDescriptions.cannot_create,
        ErrorCodes.cannot_create
      );
    else {
      if (newSqueal.channels.length < 1) {
        return new Success(SuccessDescription.created, SuccessCode.created);
      } else {
        for (let i of newSqueal.channels) {
          for (let j of channels) {
            if (i === j.name) {
              const id: unknown = newSqueal._id;
              const ret: any = await addSquealToChannel(j.name, id as string);
              return ret;
            }
          }
        }
        return new Success(SuccessDescription.created, SuccessCode.created);
      }
    }
  } catch (error: any) {
    console.log({ errorName: error.name, errorDescription: error.message });
  }
}

/**
 * funzione che cancella uno squeal
 * @param id id dello squeal
 * @returns errori eventuali
 */
export async function deleteTextSqueal(id: string) {
  try {
    const deleted: any = await squealModel.deleteOne(
      { _id: id },
      { returnDocument: "after" }
    );
    if (deleted.deletedCount < 1)
      return new Error(
        ErrorDescriptions.cannot_delete,
        ErrorCodes.cannot_delete
      );
    else return new Success(SuccessDescription.removed, SuccessCode.removed);
  } catch (error: any) {
    console.log({ errorName: error.name, errorDescription: error.message });
  }
}

/**
 * funzione che ritorna tutti gli squeal appartenenti a certi destinatari
 * @param recipients destinatari da ricercare
 * @returns squeals appartenenti ai destinatari scelti
 */
export async function getSquealsByRecipients(recipient: string) {
  try {
    const squeals: (Squeal | SquealGeo | SquealMedia | TimedSqueal)[] =
      (await getAllSqueals()) as (
        | Squeal
        | SquealGeo
        | SquealMedia
        | TimedSqueal
      )[];
    if (squeals instanceof Error) return Error;
    else {
      let squealArray: any[] = [];
      //Controllo che il destinatario ricercato sia presente in uno squeal
      for (let i of squeals) {
        for (let j of i.recipients) {
          if (j === recipient) {
            squealArray.push(i);
          }
        }
      }
      if (squealArray.length < 1)
        return new Error(
          ErrorDescriptions.non_existent,
          ErrorCodes.non_existent
        );
      else return squealArray;
    }
  } catch (error: any) {
    console.log({ errorName: error.name, errorDescription: error.message });
  }
}

/**
 * funzione che ritorna tutti gli squeal appartenenti ad un certo canale
 * @param channel canale da ricercare
 * @returns squeals appartenenti al canale scelto
 */
export async function getSquealsByChannel(channel: string) {
  try {
    const squeals: (Squeal | SquealGeo | SquealMedia | TimedSqueal)[] =
      (await getAllSqueals()) as (
        | Squeal
        | SquealGeo
        | SquealMedia
        | TimedSqueal
      )[];
    if (squeals instanceof Error) return Error;
    else {
      let squealArray: any[] = [];
      //Controllo che il destinatario ricercato sia presente in uno squeal
      for (let i of squeals) {
        if (i.channels) {
          for (let j of i.channels) {
            if (j === channel) {
              squealArray.push(i);
            }
          }
        }
      }
      if (squealArray.length < 1)
        return new Error(
          ErrorDescriptions.non_existent,
          ErrorCodes.non_existent
        );
      else return squealArray;
    }
  } catch (error: any) {
    console.log({ errorName: error.name, errorDescription: error.message });
  }
}
