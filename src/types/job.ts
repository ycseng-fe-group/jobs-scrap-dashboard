export interface JobPosting {
  id: string;
  source: string;
  source_id: string;
  title: string;
  company: string;
  url: string;
  description: string;
  tech_stacks: string[];
  required: string[];
  preferred: string[];
  duties: string[];
  career: string;
  end_at: string | null;
  always_recruit: boolean;
  scraped_at: string;
  created_at: string;
  updated_at: string;
}

export interface JobFilters {
  techs: string[];
  sources: string[];
  search: string;
}
