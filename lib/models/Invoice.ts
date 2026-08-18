import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IInvoiceItem {
  description: string;
  amount: number;
}

export interface IInvoiceSection {
  title: string;
  items: IInvoiceItem[];
  subtotal: number;
  discountAmount: number;
  discountDescription: string;
}

export interface IInvoice extends Document {
  documentType: "invoice" | "quote";
  invoiceNumber: string;
  billedTo: string;
  invoiceDate: Date;
  paymentTerms: string;
  sections: IInvoiceSection[];
  vatRate: number;
  vatAmount: number;
  subtotal: number;
  totalAmount: number;
  amountInWords: string;
  paymentDetails: {
    accountName: string;
    bank: string;
    accountNumber: string;
  };
  rcNumber: string;
  status: "draft" | "sent" | "paid";
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceItemSchema = new Schema<IInvoiceItem>(
  {
    description: { type: String, required: true },
    amount: { type: Number, required: true },
  },
  { _id: false }
);

const InvoiceSectionSchema = new Schema<IInvoiceSection>(
  {
    title: { type: String, required: true },
    items: { type: [InvoiceItemSchema], default: [] },
    subtotal: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    discountDescription: { type: String, default: "" },
  },
  { _id: false }
);

const InvoiceSchema = new Schema<IInvoice>(
  {
    documentType: {
      type: String,
      enum: ["invoice", "quote"],
      default: "invoice",
    },
    invoiceNumber: { type: String, required: true, unique: true },
    billedTo: { type: String, required: true, trim: true },
    invoiceDate: { type: Date, required: true },
    paymentTerms: { type: String, default: "Due Upon Receipt" },
    sections: { type: [InvoiceSectionSchema], default: [] },
    vatRate: { type: Number, default: 7.5 },
    vatAmount: { type: Number, default: 0 },
    subtotal: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    amountInWords: { type: String, default: "" },
    paymentDetails: {
      accountName: { type: String, default: "Bogaty Centrum Limited" },
      bank: { type: String, default: "GTCO" },
      accountNumber: { type: String, default: "0700573131" },
    },
    rcNumber: { type: String, default: "1828269" },
    status: {
      type: String,
      enum: ["draft", "sent", "paid"],
      default: "draft",
    },
  },
  { timestamps: true }
);

export const Invoice =
  models.Invoice || model<IInvoice>("Invoice", InvoiceSchema);
