export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      experiences: {
        Row: {
          id: string;
          code: string;
          slug: string;
          name_tr: string;
          name_en: string;
          tagline_tr: string | null;
          tagline_en: string | null;
          description_tr: string | null;
          description_en: string | null;
          duration_days: number;
          duration_nights: number;
          min_group_size: number;
          max_group_size: number | null;
          difficulty: "easy" | "medium" | "hard" | null;
          season_tr: string | null;
          season_en: string | null;
          base_price: number;
          theme_color: string | null;
          cover_image_url: string | null;
          gallery_urls: string[] | null;
          included_tr: string[] | null;
          included_en: string[] | null;
          not_included_tr: string[] | null;
          not_included_en: string[] | null;
          program_tr: Json | null;
          program_en: Json | null;
          is_active: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["experiences"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["experiences"]["Insert"]>;
      };
      experience_dates: {
        Row: {
          id: string;
          experience_id: string;
          start_date: string;
          end_date: string;
          max_capacity: number;
          booked_count: number;
          price_per_person: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["experience_dates"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["experience_dates"]["Insert"]>;
      };
      bookings: {
        Row: {
          id: string;
          booking_ref: string;
          experience_date_id: string;
          experience_id: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          num_persons: number;
          special_requests: string | null;
          status: "pending" | "confirmed" | "cancelled";
          total_price: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["bookings"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["bookings"]["Insert"]>;
      };
      testimonials: {
        Row: {
          id: string;
          customer_name: string;
          customer_initial: string | null;
          experience_id: string | null;
          experience_name_tr: string | null;
          experience_name_en: string | null;
          content_tr: string;
          content_en: string;
          rating: number;
          avatar_url: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["testimonials"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["testimonials"]["Insert"]>;
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          kvkk_consent: boolean;
          subscribed_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["newsletter_subscribers"]["Row"], "id" | "subscribed_at">;
        Update: Partial<Database["public"]["Tables"]["newsletter_subscribers"]["Insert"]>;
      };
      faq: {
        Row: {
          id: string;
          experience_id: string | null;
          question_tr: string;
          question_en: string;
          answer_tr: string;
          answer_en: string;
          sort_order: number;
        };
        Insert: Omit<Database["public"]["Tables"]["faq"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["faq"]["Insert"]>;
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          message: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["contact_messages"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["contact_messages"]["Insert"]>;
      };
    };
  };
}

export type Experience = Database["public"]["Tables"]["experiences"]["Row"];
export type ExperienceDate = Database["public"]["Tables"]["experience_dates"]["Row"];
export type Booking = Database["public"]["Tables"]["bookings"]["Row"];
export type Testimonial = Database["public"]["Tables"]["testimonials"]["Row"];
export type FAQ = Database["public"]["Tables"]["faq"]["Row"];
