import { Schema, model, models, type InferSchemaType } from "mongoose";

const pingSchema = new Schema(
  {
    pingedAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

export type PingDocument = InferSchemaType<typeof pingSchema>;

export const PingModel = models.Ping ?? model("Ping", pingSchema);
