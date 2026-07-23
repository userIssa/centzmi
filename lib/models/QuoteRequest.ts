import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IQuoteRequest extends Document {
  fullName:    string;
  company:     string;
  email:       string;
  phone:       string;
  service:     string;
  description: string;
  quantity?:   string;
  budget?:     string;
  timeline:    string;
  status:      "new" | "in-review" | "responded" | "closed";
  createdAt:   Date;
}

const QuoteRequestSchema = new Schema<IQuoteRequest>(
  {
    fullName:    { type: String, required: true, trim: true },
    company:     { type: String, required: true, trim: true },
    email:       { type: String, required: true, trim: true, lowercase: true },
    phone:       { type: String, required: true, trim: true },
    service:     { type: String, required: true },
    description: { type: String, required: true },
    quantity:    { type: String },
    budget:      { type: String },
    timeline:    { type: String, required: true },
    status:      {
      type: String,
      enum: ["new", "in-review", "responded", "closed"],
      default: "new",
    },
  },
  { timestamps: true }
);

export const QuoteRequest =
  models.QuoteRequest ||
  model<IQuoteRequest>("QuoteRequest", QuoteRequestSchema);
