export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      applications: {
        Row: {
          created_at: string;
          cv_path: string | null;
          email: string;
          id: string;
          ticket_number: number;
          ticket_format_version: number;
          job_id: string | null;
          message: string | null;
          name: string;
          notes: string;
          notes_version: number;
          customer_confirmation_requested_at: string | null;
          customer_confirmation_sent_at: string | null;
          customer_confirmation_email_id: string | null;
          customer_confirmation_payload: Json | null;
          notification_email_id: string | null;
          notification_sent_at: string | null;
          phone: string | null;
          status: string;
        };
        Insert: {
          created_at?: string;
          cv_path?: string | null;
          email: string;
          id?: string;
          ticket_number?: never;
          ticket_format_version?: number;
          job_id?: string | null;
          message?: string | null;
          name: string;
          notes?: string;
          notes_version?: number;
          customer_confirmation_requested_at?: string | null;
          customer_confirmation_sent_at?: string | null;
          customer_confirmation_email_id?: string | null;
          customer_confirmation_payload?: Json | null;
          notification_email_id?: string | null;
          notification_sent_at?: string | null;
          phone?: string | null;
          status?: string;
        };
        Update: {
          created_at?: string;
          cv_path?: string | null;
          email?: string;
          id?: string;
          ticket_number?: never;
          ticket_format_version?: number;
          job_id?: string | null;
          message?: string | null;
          name?: string;
          notes?: string;
          notes_version?: number;
          customer_confirmation_requested_at?: string | null;
          customer_confirmation_sent_at?: string | null;
          customer_confirmation_email_id?: string | null;
          customer_confirmation_payload?: Json | null;
          notification_email_id?: string | null;
          notification_sent_at?: string | null;
          phone?: string | null;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "applications_job_id_fkey";
            columns: ["job_id"];
            isOneToOne: false;
            referencedRelation: "jobs";
            referencedColumns: ["id"];
          },
        ];
      };
      contact_requests: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          ticket_number: number;
          ticket_format_version: number;
          image_paths: string[];
          message: string;
          name: string;
          notes: string;
          notes_version: number;
          customer_confirmation_requested_at: string | null;
          customer_confirmation_sent_at: string | null;
          customer_confirmation_email_id: string | null;
          customer_confirmation_payload: Json | null;
          notification_email_id: string | null;
          notification_sent_at: string | null;
          phone: string | null;
          status: string;
          subject: string | null;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          ticket_number?: never;
          ticket_format_version?: number;
          image_paths?: string[];
          message: string;
          name: string;
          notes?: string;
          notes_version?: number;
          customer_confirmation_requested_at?: string | null;
          customer_confirmation_sent_at?: string | null;
          customer_confirmation_email_id?: string | null;
          customer_confirmation_payload?: Json | null;
          notification_email_id?: string | null;
          notification_sent_at?: string | null;
          phone?: string | null;
          status?: string;
          subject?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          ticket_number?: never;
          ticket_format_version?: number;
          image_paths?: string[];
          message?: string;
          name?: string;
          notes?: string;
          notes_version?: number;
          customer_confirmation_requested_at?: string | null;
          customer_confirmation_sent_at?: string | null;
          customer_confirmation_email_id?: string | null;
          customer_confirmation_payload?: Json | null;
          notification_email_id?: string | null;
          notification_sent_at?: string | null;
          phone?: string | null;
          status?: string;
          subject?: string | null;
        };
        Relationships: [];
      };
      email_delivery: {
        Row: {
          contact_request_id: string | null;
          application_id: string | null;
          email_id: string;
          occurred_at: string;
          status: string;
        };
        Insert: {
          contact_request_id?: string | null;
          application_id?: string | null;
          email_id: string;
          occurred_at: string;
          status: string;
        };
        Update: {
          contact_request_id?: string | null;
          application_id?: string | null;
          email_id?: string;
          occurred_at?: string;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "email_delivery_contact_request_id_fkey";
            columns: ["contact_request_id"];
            isOneToOne: false;
            referencedRelation: "contact_requests";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "email_delivery_application_id_fkey";
            columns: ["application_id"];
            isOneToOne: false;
            referencedRelation: "applications";
            referencedColumns: ["id"];
          },
        ];
      };
      form_rate_limits: {
        Row: {
          expires_at: string;
          hits: number;
          key: string;
        };
        Insert: {
          expires_at: string;
          hits: number;
          key: string;
        };
        Update: {
          expires_at?: string;
          hits?: number;
          key?: string;
        };
        Relationships: [];
      };
      jobs: {
        Row: {
          active: boolean;
          created_at: string;
          description: string;
          employment_type: string | null;
          id: string;
          location: string | null;
          requirements: string;
          slug: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          active?: boolean;
          created_at?: string;
          description?: string;
          employment_type?: string | null;
          id?: string;
          location?: string | null;
          requirements?: string;
          slug: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          active?: boolean;
          created_at?: string;
          description?: string;
          employment_type?: string | null;
          id?: string;
          location?: string | null;
          requirements?: string;
          slug?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      newsletter_subscribers: {
        Row: {
          created_at: string;
          email: string;
          id: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          active: boolean;
          created_at: string;
          description: string;
          featured: boolean;
          id: string;
          images: string[];
          location: string | null;
          service_id: string | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          active?: boolean;
          created_at?: string;
          description?: string;
          featured?: boolean;
          id?: string;
          images?: string[];
          location?: string | null;
          service_id?: string | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          active?: boolean;
          created_at?: string;
          description?: string;
          featured?: boolean;
          id?: string;
          images?: string[];
          location?: string | null;
          service_id?: string | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "projects_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
        ];
      };
      services: {
        Row: {
          active: boolean;
          category: string | null;
          created_at: string;
          custom_benefits: Json;
          custom_faqs: Json;
          geo_focus: string | null;
          hero_image: string | null;
          id: string;
          long_text: string;
          meta_description: string | null;
          meta_title: string | null;
          short_text: string;
          slug: string;
          sort_order: number;
          title: string;
          updated_at: string;
        };
        Insert: {
          active?: boolean;
          category?: string | null;
          created_at?: string;
          custom_benefits?: Json;
          custom_faqs?: Json;
          geo_focus?: string | null;
          hero_image?: string | null;
          id?: string;
          long_text?: string;
          meta_description?: string | null;
          meta_title?: string | null;
          short_text?: string;
          slug: string;
          sort_order?: number;
          title: string;
          updated_at?: string;
        };
        Update: {
          active?: boolean;
          category?: string | null;
          created_at?: string;
          custom_benefits?: Json;
          custom_faqs?: Json;
          geo_focus?: string | null;
          hero_image?: string | null;
          id?: string;
          long_text?: string;
          meta_description?: string | null;
          meta_title?: string | null;
          short_text?: string;
          slug?: string;
          sort_order?: number;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          id: string;
          key: string;
          updated_at: string;
          value: Json;
        };
        Insert: {
          id?: string;
          key: string;
          updated_at?: string;
          value?: Json;
        };
        Update: {
          id?: string;
          key?: string;
          updated_at?: string;
          value?: Json;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      consume_form_quota: {
        Args: { p_key: string; p_limit: number };
        Returns: boolean;
      };
      record_email_delivery: {
        Args: { p_at: string; p_id: string; p_status: string };
        Returns: undefined;
      };
      record_submission_email_delivery: {
        Args: {
          p_at: string;
          p_id: string;
          p_status: string;
          p_source: string | null;
          p_submission_id: string | null;
        };
        Returns: undefined;
      };
    };
    Enums: {
      app_role: "admin";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin"],
    },
  },
} as const;
