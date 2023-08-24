import express from "express";
import { Error, TimedSqueal } from "../util/types";
import {
  deleteTimedSqueal,
  getAllTimers,
} from "../database/querys/timedSqueal";
import { startTimer } from "../util/timers";

export const router = express.Router();

router
  .route("/")
  /**
   * GET
   * chiamata che ritorna tutti gli squeal temporizzati
   */
  .get(async (req, res) => {
    try {
      const timedSqueals: TimedSqueal[] | Error | undefined =
        await getAllTimers();
      res.send(timedSqueals);
    } catch (error: any) {
      res.send({ errorName: error.name, errorDescription: error.message });
    }
  })
  /**
   * POST
   * aggiunge uno squeal temporizzato
   */
  .post(async (req, res) => {
    try {
      const squeal: TimedSqueal = req.body.squeal;
      startTimer(squeal);
    } catch (error: any) {
      res.send({ errorName: error.name, errorDescription: error.message });
    }
  })
  /**
   * DELETE
   * elimina uno squeal temporizzato
   */
  .delete(async (req, res) => {
    try {
      await deleteTimedSqueal(req.query.id as string);
    } catch (error: any) {
      res.send({ errorName: error.name, errorDescription: error.message });
    }
  });
