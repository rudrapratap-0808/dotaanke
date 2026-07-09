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
      coupons: {
        Row: {
          active: boolean
          code: string
          created_at: string
          discount_percent: number
          id: string
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          discount_percent: number
          id?: string
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          discount_percent?: number
          id?: string
        }
        Relationships: []
      }
      order_status_history: {
        Row: {
          created_at: string
          id: string
          note: string | null
          order_id: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          note?: string | null
          order_id: string
          status: string
        }
        Update: {
          created_at?: string
          id?: string
          note?: string | null
          order_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address: string
          admin_notes: string | null
          city: string
          coupon_code: string | null
          created_at: string
          customer_name: string
          discount: number
          email: string | null
          id: string
          items: Json
          order_number: string
          payment_screenshot_url: string | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          phone: string
          pincode: string
          state: string
          subtotal: number
          total: number
          tracking_number: string | null
          tracking_status: Database["public"]["Enums"]["tracking_status"]
          updated_at: string
          user_id: string | null
          whatsapp_message: string | null
        }
        Insert: {
          address: string
          admin_notes?: string | null
          city: string
          coupon_code?: string | null
          created_at?: string
          customer_name: string
          discount?: number
          email?: string | null
          id?: string
          items?: Json
          order_number?: string
          payment_screenshot_url?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          phone: string
          pincode: string
          state: string
          subtotal: number
          total: number
          tracking_number?: string | null
          tracking_status?: Database["public"]["Enums"]["tracking_status"]
          updated_at?: string
          user_id?: string | null
          whatsapp_message?: string | null
        }
        Update: {
          address?: string
          admin_notes?: string | null
          city?: string
          coupon_code?: string | null
          created_at?: string
          customer_name?: string
          discount?: number
          email?: string | null
          id?: string
          items?: Json
          order_number?: string
          payment_screenshot_url?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          phone?: string
          pincode?: string
          state?: string
          subtotal?: number
          total?: number
          tracking_number?: string | null
          tracking_status?: Database["public"]["Enums"]["tracking_status"]
          updated_at?: string
          user_id?: string | null
          whatsapp_message?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          active: boolean
          badges: string[]
          bestseller: boolean
          category: string
          created_at: string
          description: string | null
          features: string[]
          gallery: string[]
          gender: string
          id: string
          image_url: string | null
          name: string
          new_arrival: boolean
          original_price: number | null
          price: number
          rating: number
          reviews_count: number
          sizes: string[]
          slug: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          active?: boolean
          badges?: string[]
          bestseller?: boolean
          category: string
          created_at?: string
          description?: string | null
          features?: string[]
          gallery?: string[]
          gender?: string
          id?: string
          image_url?: string | null
          name: string
          new_arrival?: boolean
          original_price?: number | null
          price: number
          rating?: number
          reviews_count?: number
          sizes?: string[]
          slug: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          active?: boolean
          badges?: string[]
          bestseller?: boolean
          category?: string
          created_at?: string
          description?: string | null
          features?: string[]
          gallery?: string[]
          gender?: string
          id?: string
          image_url?: string | null
          name?: string
          new_arrival?: boolean
          original_price?: number | null
          price?: number
          rating?: number
          reviews_count?: number
          sizes?: string[]
          slug?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          admin_email: string | null
          bank_details: string | null
          id: number
          updated_at: string
          upi_id: string | null
          upi_qr_url: string | null
          whatsapp_number: string | null
        }
        Insert: {
          admin_email?: string | null
          bank_details?: string | null
          id?: number
          updated_at?: string
          upi_id?: string | null
          upi_qr_url?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          admin_email?: string | null
          bank_details?: string | null
          id?: number
          updated_at?: string
          upi_id?: string | null
          upi_qr_url?: string | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "customer"
      payment_status:
        | "pending"
        | "awaiting_verification"
        | "verified"
        | "rejected"
      tracking_status:
        | "placed"
        | "packed"
        | "shipped"
        | "out_for_delivery"
        | "delivered"
        | "cancelled"
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
      app_role: ["admin", "customer"],
      payment_status: [
        "pending",
        "awaiting_verification",
        "verified",
        "rejected",
      ],
      tracking_status: [
        "placed",
        "packed",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
    },
  },
} as const
