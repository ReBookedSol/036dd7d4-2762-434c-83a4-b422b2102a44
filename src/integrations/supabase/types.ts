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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai_usage: {
        Row: {
          ai_response: string | null
          cost: number
          created_at: string
          id: string
          paper_id: string | null
          question_text: string
          tokens_used: number
          user_id: string
        }
        Insert: {
          ai_response?: string | null
          cost?: number
          created_at?: string
          id?: string
          paper_id?: string | null
          question_text: string
          tokens_used?: number
          user_id: string
        }
        Update: {
          ai_response?: string | null
          cost?: number
          created_at?: string
          id?: string
          paper_id?: string | null
          question_text?: string
          tokens_used?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_usage_paper_id_fkey"
            columns: ["paper_id"]
            isOneToOne: false
            referencedRelation: "papers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_usage_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          read: boolean
          responded: boolean
          subject: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          read?: boolean
          responded?: boolean
          subject: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          read?: boolean
          responded?: boolean
          subject?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      downloads: {
        Row: {
          created_at: string
          id: string
          paper_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          paper_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          paper_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "downloads_paper_id_fkey"
            columns: ["paper_id"]
            isOneToOne: false
            referencedRelation: "papers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "downloads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      notifications: {
        Row: {
          active: boolean
          created_at: string
          created_by: string
          expires_at: string | null
          id: string
          message: string
          target_users: string[] | null
          title: string
          type: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          created_by: string
          expires_at?: string | null
          id?: string
          message: string
          target_users?: string[] | null
          title: string
          type?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          created_by?: string
          expires_at?: string | null
          id?: string
          message?: string
          target_users?: string[] | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      papers: {
        Row: {
          approved: boolean
          approved_at: string | null
          approved_by: string | null
          created_at: string
          download_count: number
          file_size: number | null
          file_url: string
          id: string
          paper_number: string | null
          paper_type: Database["public"]["Enums"]["paper_type"]
          subject_id: string
          title: string
          updated_at: string
          uploaded_by: string
          year: number
        }
        Insert: {
          approved?: boolean
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          download_count?: number
          file_size?: number | null
          file_url: string
          id?: string
          paper_number?: string | null
          paper_type?: Database["public"]["Enums"]["paper_type"]
          subject_id: string
          title: string
          updated_at?: string
          uploaded_by: string
          year: number
        }
        Update: {
          approved?: boolean
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          download_count?: number
          file_size?: number | null
          file_url?: string
          id?: string
          paper_number?: string | null
          paper_type?: Database["public"]["Enums"]["paper_type"]
          subject_id?: string
          title?: string
          updated_at?: string
          uploaded_by?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "papers_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "papers_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "papers_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      practice_test_attempts: {
        Row: {
          answers: Json | null
          completed: boolean
          completed_at: string | null
          id: string
          score: number
          started_at: string
          test_id: string
          time_taken: number | null
          total_points: number
          user_id: string
        }
        Insert: {
          answers?: Json | null
          completed?: boolean
          completed_at?: string | null
          id?: string
          score?: number
          started_at?: string
          test_id: string
          time_taken?: number | null
          total_points?: number
          user_id: string
        }
        Update: {
          answers?: Json | null
          completed?: boolean
          completed_at?: string | null
          id?: string
          score?: number
          started_at?: string
          test_id?: string
          time_taken?: number | null
          total_points?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "practice_test_attempts_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "practice_tests"
            referencedColumns: ["id"]
          },
        ]
      }
      practice_test_questions: {
        Row: {
          correct_answer: string
          created_at: string
          explanation: string | null
          id: string
          options: Json | null
          order_index: number
          points: number
          question: string
          question_type: string
          test_id: string
        }
        Insert: {
          correct_answer: string
          created_at?: string
          explanation?: string | null
          id?: string
          options?: Json | null
          order_index?: number
          points?: number
          question: string
          question_type?: string
          test_id: string
        }
        Update: {
          correct_answer?: string
          created_at?: string
          explanation?: string | null
          id?: string
          options?: Json | null
          order_index?: number
          points?: number
          question?: string
          question_type?: string
          test_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "practice_test_questions_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "practice_tests"
            referencedColumns: ["id"]
          },
        ]
      }
      practice_tests: {
        Row: {
          created_at: string
          created_by: string
          difficulty: string
          duration: number
          grade: string
          id: string
          status: string
          subject: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          difficulty?: string
          duration?: number
          grade: string
          id?: string
          status?: string
          subject: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          difficulty?: string
          duration?: number
          grade?: string
          id?: string
          status?: string
          subject?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          grade: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          school: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          grade?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          school?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          grade?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          school?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      promo_codes: {
        Row: {
          active: boolean
          code: string
          created_at: string
          created_by: string
          current_uses: number
          description: string | null
          discount_amount: number | null
          discount_percent: number | null
          expires_at: string | null
          id: string
          max_uses: number | null
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          created_by: string
          current_uses?: number
          description?: string | null
          discount_amount?: number | null
          discount_percent?: number | null
          expires_at?: string | null
          id?: string
          max_uses?: number | null
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          created_by?: string
          current_uses?: number
          description?: string | null
          discount_amount?: number | null
          discount_percent?: number | null
          expires_at?: string | null
          id?: string
          max_uses?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "promo_codes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      reports: {
        Row: {
          created_at: string
          description: string
          id: string
          paper_id: string | null
          report_type: Database["public"]["Enums"]["report_type"]
          reporter_id: string
          resolved_at: string | null
          resolved_by: string | null
          status: string
          title: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          paper_id?: string | null
          report_type: Database["public"]["Enums"]["report_type"]
          reporter_id: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          paper_id?: string | null
          report_type?: Database["public"]["Enums"]["report_type"]
          reporter_id?: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_paper_id_fkey"
            columns: ["paper_id"]
            isOneToOne: false
            referencedRelation: "papers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "reports_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      saved_papers: {
        Row: {
          id: string
          paper_id: string
          saved_at: string
          user_id: string
        }
        Insert: {
          id?: string
          paper_id: string
          saved_at?: string
          user_id: string
        }
        Update: {
          id?: string
          paper_id?: string
          saved_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_papers_paper_id_fkey"
            columns: ["paper_id"]
            isOneToOne: false
            referencedRelation: "papers"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          code: string
          created_at: string
          description: string | null
          icon_name: string | null
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          icon_name?: string | null
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          icon_name?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          end_date: string | null
          id: string
          plan_name: string
          start_date: string
          status: Database["public"]["Enums"]["subscription_status"]
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          end_date?: string | null
          id?: string
          plan_name: string
          start_date?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          end_date?: string | null
          id?: string
          plan_name?: string
          start_date?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      paper_type: "exam" | "memo" | "practice"
      report_type:
        | "paper_issue"
        | "website_bug"
        | "inappropriate_content"
        | "other"
      subscription_status: "active" | "cancelled" | "expired" | "trial"
      user_role: "admin" | "premium" | "free"
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
      paper_type: ["exam", "memo", "practice"],
      report_type: [
        "paper_issue",
        "website_bug",
        "inappropriate_content",
        "other",
      ],
      subscription_status: ["active", "cancelled", "expired", "trial"],
      user_role: ["admin", "premium", "free"],
    },
  },
} as const
