import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { QueryTransactionsDto } from './dto/query-transactions.dto';
import {
  Transaction,
  TransactionDocument,
  TransactionType,
} from './schemas/transaction.schema';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<TransactionDocument>,
  ) {}

  async create(createDto: CreateTransactionDto): Promise<Transaction> {
    return this.transactionModel.create({
      ...createDto,
      occurredAt: new Date(createDto.occurredAt),
      note: createDto.note ?? '',
    });
  }

  async findAll(query: QueryTransactionsDto) {
    const filter: FilterQuery<TransactionDocument> = {};
    if (query.type) {
      filter.type = query.type;
    }

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const [items, total] = await Promise.all([
      this.transactionModel
        .find(filter)
        .sort({ occurredAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec(),
      this.transactionModel.countDocuments(filter),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
      },
    };
  }

  async summary() {
    const result = await this.transactionModel.aggregate<{
      _id: TransactionType;
      total: number;
    }>([
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    const income = result.find((item) => item._id === TransactionType.Income)?.total ?? 0;
    const expense = result.find((item) => item._id === TransactionType.Expense)?.total ?? 0;

    return {
      income,
      expense,
      balance: income - expense,
    };
  }
}
