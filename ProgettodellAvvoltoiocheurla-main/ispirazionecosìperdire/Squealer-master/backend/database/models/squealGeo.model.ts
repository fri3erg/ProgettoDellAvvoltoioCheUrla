import { Schema, model, Document } from "mongoose";

interface SquealGeo {
  lat: string;
  lng: string;
  recipients: string[];
  date: Date;
  positiveReactions?: number;
  negativeReactions?: number;
  category: string;
  author: string;
  channels?: string[];
  criticalMass?: number;
  visual?: number;
}

interface SquealGeoDocument extends SquealGeo, Document {}

const squealGeoSchema = new Schema<SquealGeoDocument>({
  //Visualizzabili
  lat: { type: String, required: true }, //Corpo del messaggio (coordinate [lat,lng]) / Limitare a 2 elementi l'array
  lng: { type: String, required: true },
  recipients: { type: [String], required: true }, //Destinatari (individuo, canale o keyword)
  date: { type: Date, required: true }, //Data e ora messaggio
  positiveReactions: { type: Number, default: 0 },
  negativeReactions: { type: Number, default: 0 },
  category: { type: String, required: true }, //Categorie (privato, pubblico, popolare, impopolare, controverso)
  author: { type: String, required: true },
  channels: { type: [String] }, //Canali a cui è stato aggiunto dalla redazione
  //Non visualizzabili
  criticalMass: { type: Number, default: 0 }, //Massa critica (0,25 x visual)
  visual: { type: Number, default: 0, required: true }, //Visualizzazioni di account registrati e non
});

const squealGeoModel = model<SquealGeoDocument>(
  "squealGeoData",
  squealGeoSchema,
);

export default squealGeoModel;
