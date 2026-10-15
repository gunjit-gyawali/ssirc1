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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          achieved_on: string | null
          category: string | null
          created_at: string
          description: string | null
          featured: boolean
          id: string
          image_url: string | null
          link_url: string | null
          organization: string | null
          published: boolean
          recipient: string | null
          title: string
          updated_at: string
        }
        Insert: {
          achieved_on?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          image_url?: string | null
          link_url?: string | null
          organization?: string | null
          published?: boolean
          recipient?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          achieved_on?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          image_url?: string | null
          link_url?: string | null
          organization?: string | null
          published?: boolean
          recipient?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      applications: {
        Row: {
          admin_notes: string | null
          created_at: string
          email: string
          extra: string | null
          full_name: string
          id: string
          interests: string | null
          level: string | null
          motivation: string
          phone: string | null
          skills: string | null
          status: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          email: string
          extra?: string | null
          full_name: string
          id?: string
          interests?: string | null
          level?: string | null
          motivation: string
          phone?: string | null
          skills?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          email?: string
          extra?: string | null
          full_name?: string
          id?: string
          interests?: string | null
          level?: string | null
          motivation?: string
          phone?: string | null
          skills?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          status: string
          subject: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          status?: string
          subject?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          status?: string
          subject?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          ends_at: string | null
          featured: boolean
          id: string
          organizer: string | null
          poster_url: string | null
          published: boolean
          registration_url: string | null
          results: string | null
          slug: string
          starts_at: string
          title: string
          updated_at: string
          venue: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          ends_at?: string | null
          featured?: boolean
          id?: string
          organizer?: string | null
          poster_url?: string | null
          published?: boolean
          registration_url?: string | null
          results?: string | null
          slug: string
          starts_at: string
          title: string
          updated_at?: string
          venue?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          ends_at?: string | null
          featured?: boolean
          id?: string
          organizer?: string | null
          poster_url?: string | null
          published?: boolean
          registration_url?: string | null
          results?: string | null
          slug?: string
          starts_at?: string
          title?: string
          updated_at?: string
          venue?: string | null
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          album: string | null
          caption: string | null
          category: string | null
          created_at: string
          display_order: number
          featured: boolean
          id: string
          image_url: string
          published: boolean
          updated_at: string
        }
        Insert: {
          album?: string | null
          caption?: string | null
          category?: string | null
          created_at?: string
          display_order?: number
          featured?: boolean
          id?: string
          image_url: string
          published?: boolean
          updated_at?: string
        }
        Update: {
          album?: string | null
          caption?: string | null
          category?: string | null
          created_at?: string
          display_order?: number
          featured?: boolean
          id?: string
          image_url?: string
          published?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      members: {
        Row: {
          category: string
          created_at: string
          designation: string | null
          display_order: number
          education: string | null
          email: string | null
          featured: boolean
          full_bio: string | null
          full_name: string
          github_url: string | null
          id: string
          linkedin_url: string | null
          photo_url: string | null
          published: boolean
          short_bio: string | null
          show_email: boolean
          skills: string[]
          slug: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          category?: string
          created_at?: string
          designation?: string | null
          display_order?: number
          education?: string | null
          email?: string | null
          featured?: boolean
          full_bio?: string | null
          full_name: string
          github_url?: string | null
          id?: string
          linkedin_url?: string | null
          photo_url?: string | null
          published?: boolean
          short_bio?: string | null
          show_email?: boolean
          skills?: string[]
          slug: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          designation?: string | null
          display_order?: number
          education?: string | null
          email?: string | null
          featured?: boolean
          full_bio?: string | null
          full_name?: string
          github_url?: string | null
          id?: string
          linkedin_url?: string | null
          photo_url?: string | null
          published?: boolean
          short_bio?: string | null
          show_email?: boolean
          skills?: string[]
          slug?: string
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      news: {
        Row: {
          author: string | null
          category: string | null
          content: string | null
          cover_url: string | null
          created_at: string
          id: string
          published: boolean
          published_at: string | null
          slug: string
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          category?: string | null
          content?: string | null
          cover_url?: string | null
          created_at?: string
          id?: string
          published?: boolean
          published_at?: string | null
          slug: string
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          category?: string | null
          content?: string | null
          cover_url?: string | null
          created_at?: string
          id?: string
          published?: boolean
          published_at?: string | null
          slug?: string
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_members: {
        Row: {
          member_id: string
          project_id: string
        }
        Insert: {
          member_id: string
          project_id: string
        }
        Update: {
          member_id?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_members_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          category: string
          cover_url: string | null
          created_at: string
          demo_url: string | null
          description: string | null
          end_date: string | null
          featured: boolean
          github_url: string | null
          id: string
          methodology: string | null
          problem: string | null
          published: boolean
          slug: string
          solution: string | null
          start_date: string | null
          status: string
          summary: string | null
          technologies: string[]
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          cover_url?: string | null
          created_at?: string
          demo_url?: string | null
          description?: string | null
          end_date?: string | null
          featured?: boolean
          github_url?: string | null
          id?: string
          methodology?: string | null
          problem?: string | null
          published?: boolean
          slug: string
          solution?: string | null
          start_date?: string | null
          status?: string
          summary?: string | null
          technologies?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          cover_url?: string | null
          created_at?: string
          demo_url?: string | null
          description?: string | null
          end_date?: string | null
          featured?: boolean
          github_url?: string | null
          id?: string
          methodology?: string | null
          problem?: string | null
          published?: boolean
          slug?: string
          solution?: string | null
          start_date?: string | null
          status?: string
          summary?: string | null
          technologies?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      app_role: "admin" | "moderator" | "user"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
