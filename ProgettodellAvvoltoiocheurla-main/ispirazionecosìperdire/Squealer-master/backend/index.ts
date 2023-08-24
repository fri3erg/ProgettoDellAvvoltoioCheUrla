import express from "express";
import cors from "cors";
import { config } from "dotenv";
import session from "express-session";
import mongoose from "mongoose";
import passport from "passport";
import path from "path";
import { router as authRoute } from "./routes/authentication";
import { startAllTimer } from "./util/timers";
import { router as channelRoute } from "./routes/channels";
import { router as squealsRoute } from "./routes/squeals";
import { router as squealMediaRoute } from "./routes/squealMedia";
import { router as squealGeoRoute } from "./routes/squealGeo";
import { router as squealTimedRoute } from "./routes/timedSqueal";
import { router as mediaRoute } from "./routes/media";
import { Error } from "./util/types";
import fs from "fs";

config();

const maxAge: number = 24 * 60 * 60 * 1000;
const app = express();
const uri: string = process.env.MONGO_TEST!;
const port: any = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(
  session({
    secret: process.env.COOKIE_KEY!,
    cookie: { maxAge: maxAge },
    resave: false,
    saveUninitialized: false,
  }),
);

//Controllo se la cartella per gli uploads esiste altrimenti la creo
fs.readdir(path.resolve(__dirname, "..", "public"), (err, files) => {
  if (err) console.log(err);
  if (!files.includes("uploads")) {
    fs.mkdir("public/uploads", (err) => {
      if (err) console.log(err);
    });
  }
});

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRoute);
app.use("/api/channels", channelRoute);
app.use("/api/squeals", squealsRoute);
app.use("/api/squeals/media", squealMediaRoute);
app.use("/api/squeals/geo", squealGeoRoute);
app.use("/api/squeals/timed", squealTimedRoute);
app.use("/api/media", mediaRoute);

mongoose.set("strictQuery", false);
mongoose.connect(uri).then(async () => {
  console.log("connected to mongoose");
  const ret: Error | undefined = await startAllTimer();
  console.log(ret);
});

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
