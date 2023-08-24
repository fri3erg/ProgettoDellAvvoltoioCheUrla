import { Schema, model, Document } from "mongoose";

interface Channel {
  name: string;
  squeals?: string;
}

interface ChannelDocument extends Channel, Document {}

const channelsSchema = new Schema<ChannelDocument>({
  name: { type: String, required: true, unique: true }, //Nome del canale (§canale, §CANALE, #keyword)
  squeals: { type: [String] }, //id dei messaggi con destinatario il canale
});

const channelsModel = model<ChannelDocument>("channelsData", channelsSchema);

export default channelsModel;
