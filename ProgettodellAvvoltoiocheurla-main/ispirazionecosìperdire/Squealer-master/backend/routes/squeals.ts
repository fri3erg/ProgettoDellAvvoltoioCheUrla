import {
  getSquealsByChannel,
  deleteTextSqueal,
  getAllSqueals,
  getSquealsByRecipients,
  postTextSqueal,
  getTextSqueals,
} from "../database/querys/squeals";
import express from "express";
import { startTimer } from "../util/timers";
import { TimedSqueal, Error } from "../util/types";

export const router = express.Router();

router
  .route("/")
  /**
   * GET
   * Ritorna tutti gli squeal
   */
  .get(async (req, res) => {
    try {
      const squeals: any = await getAllSqueals();
      res.status(200).send(squeals);
    } catch (error: any) {
      res.send({ errorName: error.name, errorDescription: error.message });
    }
  });

router
  .route("/text")
  /**
   * GET
   * chiamata che ritorna tutti i text squeals
   */
  .get(async (req, res) => {
    try {
      const squeals: any = await getTextSqueals();
      res.send(squeals);
    } catch (error: any) {
      res.send({ errorName: error.name, errorDescription: error.message });
    }
  })
  /**
   * POST
   * chiamata per creare un text squeal
   */
  .post(async (req, res) => {
    try {
      const ret: any = await postTextSqueal(req.body);
      res.send(ret);
    } catch (error: any) {
      res.send({ errorName: error.name, errorDescription: error.message });
    }
  })
  /**
   * DELETE
   * chiamata per cancellare uno squeal
   */
  .delete(async (req, res) => {
    try {
      await deleteTextSqueal(req.query.id as string).then((ret) => {
        res.send(ret);
      });
    } catch (error: any) {
      res.send({ errorName: error.name, errorDescription: error.message });
    }
  });

router
  .route("/recipients")
  /**
   * GET
   * ritorna tutti gli squeal appartenenti ai recipients ricercati
   */
  .get(async (req, res) => {
    try {
      const squeals: any = await getSquealsByRecipients(
        req.query.recipient as string,
      );
      res.send(squeals);
    } catch (error: any) {
      res.send({ errorName: error.name, errorDescription: error.message });
    }
  });

router
  .route("/channels")
  /**
   * GET
   * ritorna tutti gli squeal appartenenti ad un canale
   */
  .get(async (req, res) => {
    try {
      const squeals: any = await getSquealsByChannel(
        req.query.channel as string,
      );
      res.send(squeals);
    } catch (error: any) {
      res.send({ errorName: error.name, errorDescription: error.message });
    }
  });
