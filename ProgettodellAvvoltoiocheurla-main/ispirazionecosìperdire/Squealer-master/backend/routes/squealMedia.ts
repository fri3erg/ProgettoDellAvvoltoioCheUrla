import express from "express";
import {
  deleteMediaSqueal,
  getMediaSqueals,
  postMediaSqueal,
} from "../database/querys/squealMedia";
import { Error, SquealMedia } from "../util/types";

export const router = express.Router();

router
  .route("/")
  /**
   * GET
   * chiamata che ritorna tutti i media squeal
   */
  .get(async (req, res) => {
    try {
      const squeals: SquealMedia[] | Error | undefined =
        await getMediaSqueals();
      res.send(squeals);
    } catch (error: any) {
      res.send({ errorName: error.name, errorDescription: error.message });
    }
  })
  /**
   * POST
   * chiamata per creare un media squeal
   */
  .post(async (req, res) => {
    try {
      const newSqueal: any = await postMediaSqueal(
        req.body,
        req.query.filename as string
      );
      res.send(newSqueal);
    } catch (error: any) {
      res.send({ errorName: error.name, errorDescription: error.message });
    }
  })
  /**
   * DELETE
   * Elimina uno squeal
   */
  .delete(async (req, res) => {
    try {
      await deleteMediaSqueal(req.query.id as string).then((ret: any) => {
        res.send(ret);
      });
    } catch (error: any) {
      res.send({ errorName: error.name, errorDescription: error.message });
    }
  });
