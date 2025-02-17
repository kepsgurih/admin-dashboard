export interface ICustomer {
  id: String;
  name: String;
  email: String;
  phone: String;
  address: String;
  createdAt: Date;
  updatedAt: Date;
};

export interface IItem {
  id: String;
  name: String;
  description: String;
  price: Number;
  createdAt: Date;
  updatedAt: Date;
};

export enum DocumentType {
  QUOTATION = "QUOTATION",
  INVOICE = "INVOICE",
}

export enum DocumentStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  PAID = "PAID",
  CANCELLED = "CANCELLED",
}

export type Document = {
  id: string;
  documentNumber: string;
  customerId: string;
  type: DocumentType;
  issueDate: Date;
  validUntil?: Date | null;
  totalAmount: number;
  status: DocumentStatus;
  quotationId?: string | null; // Jika ini Invoice yang berasal dari Quotation
  createdAt: Date;
  updatedAt: Date;
};

export interface DocumentItem {
  id: String;
  documentId: String;
  itemId: String;
  quantity: Number;
  price: Number;
  createdAt: Date;
  updatedAt: Date;
};
