import { Schema, model, Document } from "mongoose";

interface SquealMedia {
  body: string;
  type: string;
  recipients: string[];
  date: Date;
  positiveReactions?: number;
  negativeReactions?: number;
  category: string;
  channels?: string[];
  author: string;
  criticalMass?: number;
  visual?: number;
}

interface SquealMediaDocument extends SquealMedia, Document {}

const squealMediaSchema = new Schema<SquealMediaDocument>(
  {
    //Visualizzabili
    body: { type: String, required: true }, //Corpo del messaggio (url a immagine o video)
    type: { type: String, required: true }, // Tipo del file (immagine/video)
    recipients: { type: [String], required: true }, //Destinatari (individuo, canale o keyword)
    date: { type: Date, required: true }, //Data e ora messaggio
    positiveReactions: { type: Number, default: 0 },
    negativeReactions: { type: Number, default: 0 },
    category: { type: String, required: true }, //Categorie (privato, pubblico, popolare, impopolare, controverso)
    channels: { type: [String] }, //Canali a cui è stato aggiunto dalla redazione
    author: { type: String, required: true }, // Autore dello squeal
    //Non visualizzabili
    criticalMass: { type: Number, default: 0 }, //Massa critica (0,25 x visual)
    visual: { type: Number, default: 0, required: true }, //Visualizzazioni di account registrati e non
  },
  { collection: "squealMediaData" },
);

const squealMediaModel = model<SquealMediaDocument>(
  "squealMediaData",
  squealMediaSchema,
);

export default squealMediaModel;
