export type Facility = {
  name: string;
  icon: string;
};

export type Media = {
  id: number;
  title: string | null;
  media_type: string;
  media_url: string;
  is_front: boolean;
};

export type Result = {
  id: number;
  location: number;
  name: string;
  total_capacity: number;
  lat: number;
  lon: number;
  review_count: number;
  average_rating: number;
  featured_image: string;
  food_policy: string;
  checkin_instructions: string;
  address: string;
  facilities: Facility[];
  wifi_password: string | null;
  wifi_name: string | null;
  speciality: string | null;
  media: Media[];
  thumbnail: string;
  timings: string;
  is_open: number;
  is_branch_open: string;
  content_type_id: number;
  no_checkin_members: number;
  premium: boolean;
  is_premium: number;
  is_women_only: number;
  is_dca_approved_only: number;
  allowed_plan_ids: number[];
  is_favorite: null;
  is_at_full_capacity: boolean;
  credits_required: number;
  is_ddr: boolean;
  total_capacity_ar: string;
  credits_required_ar: string;
  spotLeft: number;
  spotLeft_ar: string;
  review_count_ar: string;
  branch_cost: string;
  branch_cost_ar: string;
};

export type ResponseObjectType = {
  next_url: string;
  previous_url: null;
  status: number;
  error: {};
  total_count: number;
  results: Result[];
  current_page: number;
  total_pages: number;
  per_page_record: number;
};
