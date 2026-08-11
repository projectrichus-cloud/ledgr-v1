import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

export interface NewBankTransaction {
  bank_account_id: string;

  transaction_date: string | null;
  value_date: string | null;

  description: string | null;
  reference: string | null;

  merchant: string | null;

  category: string | null;

  transaction_type: string | null;

  debit: number | null;
  credit: number | null;
  balance: number | null;
}

export class BankTransactionsRepository {
  constructor(
    private readonly supabase: SupabaseClient<Database>
  ) {}

  async insertMany(
    transactions: NewBankTransaction[]
  ): Promise<void> {
    if (transactions.length === 0) return;

    const { error } = await this.supabase
      .from("bank_transactions")
      .insert(transactions);

    if (error) throw error;
  }
}