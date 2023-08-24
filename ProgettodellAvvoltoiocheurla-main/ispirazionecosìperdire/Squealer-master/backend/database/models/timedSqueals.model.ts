import { Schema, model, Document } from "mongoose";

interface TimedSqueal {
  body: string;
  recipients: string[];
  date: Date;
  positiveReactions?: number;
  negativeReactions?: number;
  category: string;
  channels?: string[];
  author: string;
  criticalMass?: number;
  visual: number;
  time?: number;
  intervalId?: number;
  count?: number;
}

interface TimedSquealDocument extends TimedSqueal, Document {}

const timedSquealSchema = new Schema<TimedSquealDocument>({
  //Visualizzabili
  body: { type: String, required: true }, //Corpo del messaggio (testo, immagine (path), video (path), geolocazione (coordinate per open street map api))
  recipients: { type: [String], required: true }, //Destinatari (individuo, canale o keyword)
  date: { type: Date, required: true }, //Data e ora messaggio
  positiveReactions: { type: Number },
  negativeReactions: { type: Number },
  category: { type: String, required: true }, //Categorie (privato, pubblico, popolare, impopolare, controverso)
  channels: { type: [String] }, //Canali a cui è stato aggiunto dalla redazione
  author: { type: String }, // id dell'autore
  //Non visualizzabili
  criticalMass: { type: Number }, //Massa critica (0,25 x visual)
  visual: { type: Number, default: 0, required: true }, //Visualizzazioni di account registrati e non
  // valori temporizzazione
  time: { type: Number, default: 0 }, //tempo per i messaggi automatici (in ms)
  intervalId: { type: Number }, // id dell'intervallo
  count: { type: Number }, // contatore di quante volte questo squeal è stato pubblicato
});

const timedSquealModel = model<TimedSquealDocument>(
  "timedSquealData",
  timedSquealSchema,
);

export default timedSquealModel;
