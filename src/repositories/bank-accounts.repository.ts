import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

export interface NewBankAccount {
  document_id: string;
  company_id: string;

  bank_name: string | null;
  account_holder: string | null;
  account_number: string | null;
  customer_id: string | null;

  ifsc: string | null;
  branch: string | null;

  statement_from: string | null;
  statement_to: string | null;

  currency: string | null;

  opening_balance: number | null;
  closing_balance: number | null;
}

export class BankAccountsRepository {
  constructor(
    private readonly supabase: SupabaseClient<Database>
  ) {}

  async insert(account: NewBankAccount): Promise<string> {
    const { data, error } = await this.supabase
      .from("bank_accounts")
      .insert(account)
      .select("id")
      .single();

    if (error) {
      throw error;
    }

    return data.id;
  }
}