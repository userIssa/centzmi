import { Schema, Document, models, model } from "mongoose";

export interface IContactSubmission extends Document {
  name:      string;
  email:     string;
  phone?:    string;
  message:   string;
  status:    "new" | "read" | "replied";
  createdAt: Date;
}

const ContactSubmissionSchema = new Schema<IContactSubmission>(
  {
    name:    { type: String, required: true, trim: true },
    email:   { type: String, required: true, trim: true, lowercase: true },
    phone:   { type: String },
    message: { type: String, required: true },
    status:  {
      type: String,
      enum: ["new", "read", "replied"],
      default: "new",
    },
  },
  { timestamps: true }
);

export const ContactSubmission =
  models.ContactSubmission ||
  model<IContactSubmission>("ContactSubmission", ContactSubmissionSchema);
