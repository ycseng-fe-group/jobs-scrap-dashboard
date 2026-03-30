export interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string | null;
  employment_type: string | null;
  experience: string | null;
  description: string | null;
  tech_stack: string[];
  source_url: string;
  source_site: string | null;
  salary: string | null;
  deadline: string | null;
  scraped_at: string;
  created_at: string;
}

export interface JobFilters {
  techs: string[];
  sources: string[];
  employmentTypes: string[];
  search: string;
}
