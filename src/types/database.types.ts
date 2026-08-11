export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          action: string
          actor_id: string | null
          company_id: string
          created_at: string
          id: string
          message: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          company_id: string
          created_at?: string
          id?: string
          message: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          company_id?: string
          created_at?: string
          id?: string
          message?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_log_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      bank_accounts: {
        Row: {
          account_holder: string | null
          account_number: string | null
          bank_name: string | null
          branch: string | null
          closing_balance: number | null
          company_id: string
          created_at: string
          currency: string | null
          customer_id: string | null
          document_id: string
          id: string
          ifsc: string | null
          opening_balance: number | null
          statement_from: string | null
          statement_to: string | null
        }
        Insert: {
          account_holder?: string | null
          account_number?: string | null
          bank_name?: string | null
          branch?: string | null
          closing_balance?: number | null
          company_id: string
          created_at?: string
          currency?: string | null
          customer_id?: string | null
          document_id: string
          id?: string
          ifsc?: string | null
          opening_balance?: number | null
          statement_from?: string | null
          statement_to?: string | null
        }
        Update: {
          account_holder?: string | null
          account_number?: string | null
          bank_name?: string | null
          branch?: string | null
          closing_balance?: number | null
          company_id?: string
          created_at?: string
          currency?: string | null
          customer_id?: string | null
          document_id?: string
          id?: string
          ifsc?: string | null
          opening_balance?: number | null
          statement_from?: string | null
          statement_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bank_accounts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bank_accounts_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      bank_transactions: {
        Row: {
          balance: number | null
          bank_account_id: string
          category: string | null
          created_at: string
          credit: number | null
          debit: number | null
          description: string | null
          id: string
          merchant: string | null
          reference: string | null
          transaction_date: string | null
          transaction_type: string | null
          value_date: string | null
        }
        Insert: {
          balance?: number | null
          bank_account_id: string
          category?: string | null
          created_at?: string
          credit?: number | null
          debit?: number | null
          description?: string | null
          id?: string
          merchant?: string | null
          reference?: string | null
          transaction_date?: string | null
          transaction_type?: string | null
          value_date?: string | null
        }
        Update: {
          balance?: number | null
          bank_account_id?: string
          category?: string | null
          created_at?: string
          credit?: number | null
          debit?: number | null
          description?: string | null
          id?: string
          merchant?: string | null
          reference?: string | null
          transaction_date?: string | null
          transaction_type?: string | null
          value_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bank_transactions_bank_account_id_fkey"
            columns: ["bank_account_id"]
            isOneToOne: false
            referencedRelation: "bank_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      ca_clients: {
        Row: {
          ca_id: string
          company_id: string
          created_at: string
          id: string
          invited_email: string | null
          risk_level: Database["public"]["Enums"]["risk_level"]
          status: Database["public"]["Enums"]["client_status"]
        }
        Insert: {
          ca_id: string
          company_id: string
          created_at?: string
          id?: string
          invited_email?: string | null
          risk_level?: Database["public"]["Enums"]["risk_level"]
          status?: Database["public"]["Enums"]["client_status"]
        }
        Update: {
          ca_id?: string
          company_id?: string
          created_at?: string
          id?: string
          invited_email?: string | null
          risk_level?: Database["public"]["Enums"]["risk_level"]
          status?: Database["public"]["Enums"]["client_status"]
        }
        Relationships: [
          {
            foreignKeyName: "ca_clients_ca_id_fkey"
            columns: ["ca_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ca_clients_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string
          financial_year: string
          gstin: string | null
          id: string
          name: string
          owner_id: string
          pan: string | null
          sector: string | null
        }
        Insert: {
          created_at?: string
          financial_year?: string
          gstin?: string | null
          id?: string
          name: string
          owner_id: string
          pan?: string | null
          sector?: string | null
        }
        Update: {
          created_at?: string
          financial_year?: string
          gstin?: string | null
          id?: string
          name?: string
          owner_id?: string
          pan?: string | null
          sector?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      document_extractions: {
        Row: {
          confidence_score: number | null
          created_at: string
          document_id: string
          field_name: string
          field_value: string | null
          id: string
          page_number: number | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          document_id: string
          field_name: string
          field_value?: string | null
          id?: string
          page_number?: number | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          document_id?: string
          field_name?: string
          field_value?: string | null
          id?: string
          page_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "document_extractions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      document_requests: {
        Row: {
          ca_id: string
          company_id: string
          created_at: string
          document_type: Database["public"]["Enums"]["document_type"]
          fulfilled_document_id: string | null
          id: string
          note: string | null
          status: Database["public"]["Enums"]["request_status"]
        }
        Insert: {
          ca_id: string
          company_id: string
          created_at?: string
          document_type: Database["public"]["Enums"]["document_type"]
          fulfilled_document_id?: string | null
          id?: string
          note?: string | null
          status?: Database["public"]["Enums"]["request_status"]
        }
        Update: {
          ca_id?: string
          company_id?: string
          created_at?: string
          document_type?: Database["public"]["Enums"]["document_type"]
          fulfilled_document_id?: string | null
          id?: string
          note?: string | null
          status?: Database["public"]["Enums"]["request_status"]
        }
        Relationships: [
          {
            foreignKeyName: "document_requests_ca_id_fkey"
            columns: ["ca_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_requests_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_requests_fulfilled_document_id_fkey"
            columns: ["fulfilled_document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          company_id: string
          confidence: number | null
          confidence_score: number | null
          created_at: string
          document_type: Database["public"]["Enums"]["document_type"] | null
          file_name: string | null
          file_path: string | null
          file_size_bytes: number | null
          id: string
          processed_at: string | null
          processing_error: string | null
          processing_status: Database["public"]["Enums"]["document_processing_status"]
          status: Database["public"]["Enums"]["document_status"]
          type: Database["public"]["Enums"]["document_type"]
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          company_id: string
          confidence?: number | null
          confidence_score?: number | null
          created_at?: string
          document_type?: Database["public"]["Enums"]["document_type"] | null
          file_name?: string | null
          file_path?: string | null
          file_size_bytes?: number | null
          id?: string
          processed_at?: string | null
          processing_error?: string | null
          processing_status?: Database["public"]["Enums"]["document_processing_status"]
          status?: Database["public"]["Enums"]["document_status"]
          type: Database["public"]["Enums"]["document_type"]
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          company_id?: string
          confidence?: number | null
          confidence_score?: number | null
          created_at?: string
          document_type?: Database["public"]["Enums"]["document_type"] | null
          file_name?: string | null
          file_path?: string | null
          file_size_bytes?: number | null
          id?: string
          processed_at?: string | null
          processing_error?: string | null
          processing_status?: Database["public"]["Enums"]["document_processing_status"]
          status?: Database["public"]["Enums"]["document_status"]
          type?: Database["public"]["Enums"]["document_type"]
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          author_id: string
          body: string
          company_id: string
          created_at: string
          id: string
        }
        Insert: {
          author_id: string
          body: string
          company_id: string
          created_at?: string
          id?: string
        }
        Update: {
          author_id?: string
          body?: string
          company_id?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notes_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      reports: {
        Row: {
          approved_at: string | null
          ca_id: string
          company_id: string
          created_at: string
          file_path: string | null
          id: string
          status: Database["public"]["Enums"]["report_status"]
          title: string
        }
        Insert: {
          approved_at?: string | null
          ca_id: string
          company_id: string
          created_at?: string
          file_path?: string | null
          id?: string
          status?: Database["public"]["Enums"]["report_status"]
          title: string
        }
        Update: {
          approved_at?: string | null
          ca_id?: string
          company_id?: string
          created_at?: string
          file_path?: string | null
          id?: string
          status?: Database["public"]["Enums"]["report_status"]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_ca_id_fkey"
            columns: ["ca_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      client_status: "onboarding" | "action_needed" | "complete"
      document_processing_status:
        | "uploaded"
        | "processing"
        | "classified"
        | "extracted"
        | "validated"
        | "ready"
        | "failed"
      document_status:
        | "missing"
        | "uploading"
        | "processing"
        | "completed"
        | "failed"
      document_type:
        | "gstr1"
        | "gstr3b"
        | "itr"
        | "form_26as"
        | "ais_tis"
        | "balance_sheet"
        | "profit_loss"
        | "trial_balance"
        | "bank_statement"
        | "invoice"
      report_status: "draft" | "pending_approval" | "approved"
      request_status: "pending" | "fulfilled" | "cancelled"
      risk_level: "low" | "medium" | "high"
      user_role: "business_owner" | "ca"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      client_status: ["onboarding", "action_needed", "complete"],
      document_processing_status: [
        "uploaded",
        "processing",
        "classified",
        "extracted",
        "validated",
        "ready",
        "failed",
      ],
      document_status: [
        "missing",
        "uploading",
        "processing",
        "completed",
        "failed",
      ],
      document_type: [
        "gstr1",
        "gstr3b",
        "itr",
        "form_26as",
        "ais_tis",
        "balance_sheet",
        "profit_loss",
        "trial_balance",
        "bank_statement",
        "invoice",
      ],
      report_status: ["draft", "pending_approval", "approved"],
      request_status: ["pending", "fulfilled", "cancelled"],
      risk_level: ["low", "medium", "high"],
      user_role: ["business_owner", "ca"],
    },
  },
} as const
