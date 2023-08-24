import express from "express";
import {
  deleteGeoSqueal,
  getGeoSqueals,
  postGeoSqueal,
} from "../database/querys/squealGeo";
import { Error, SquealGeo } from "../util/types";

export const router = express.Router();

router
  .route("/")
  /**
   * GET
   * chiamata che ritorna tutti i geo squeals
   */
  .get(async (req, res) => {
    try {
      const squeals: SquealGeo[] | Error | undefined = await getGeoSqueals();
      res.send(squeals);
    } catch (error: any) {
      res.send({ errorName: error.name, errorDescription: error.message });
    }
  })
  /**
   * POST
   * chiamata per creare un geo squeal
   */
  .post(async (req, res) => {
    try {
      if (req.user) {
        console.log(req.user);

        // const ret: any = await postGeoSqueal(req.body, req.user!.username);
        // res.send(ret);
      }
    } catch (error: any) {
      res.send({ errorName: error.name, errorDescription: error.message });
    }
  })
  /**
   * DELETE
   * chiamata per rimuovere un geo squeal
   */
  .delete(async (req, res) => {
    try {
      await deleteGeoSqueal(req.query.id as string).then((ret) => {
        res.send(ret);
      });
    } catch (error: any) {
      res.send({ errorName: error.name, errorDescription: error.message });
    }
  });
