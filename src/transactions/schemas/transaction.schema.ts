import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TransactionDocument = HydratedDocument<Transaction>;

export enum TransactionType {
  Income = 'income',
  Expense = 'expense',
}

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ required: true, enum: TransactionType })
  type!: TransactionType;

  @Prop({ required: true, min: 0 })
  amount!: number;

  @Prop({ required: true, trim: true })
  category!: string;

  @Prop({ default: '', trim: true })
  note!: string;

  @Prop({ type: Date, required: true })
  occurredAt!: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
