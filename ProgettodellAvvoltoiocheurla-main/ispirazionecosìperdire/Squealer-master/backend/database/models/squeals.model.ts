import { Schema, model, Document } from "mongoose";

interface Squeal {
  body: string;
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

interface SquealDocument extends Squeal, Document {}

const squealSchema = new Schema<SquealDocument>({
  //Visualizzabili
  body: { type: String, required: true }, //Corpo del messaggio (testo)
  recipients: { type: [String], required: true }, //Destinatari (individuo, canale o keyword)
  date: { type: Date, required: true }, //Data e ora messaggio
  positiveReactions: { type: Number, default: 0 },
  negativeReactions: { type: Number, default: 0 },
  category: { type: String, required: true }, //Categorie (privato, pubblico, popolare, impopolare, controverso)
  channels: { type: [String] }, //Canali a cui è stato aggiunto dalla redazione
  author: { type: String },
  //Non visualizzabili
  criticalMass: { type: Number, default: 0 }, //Massa critica (0,25 x visual)
  visual: { type: Number, default: 0, required: true }, //Visualizzazioni di account registrati e non
});

const squealModel = model<SquealDocument>("squealData", squealSchema);

export default squealModel;
