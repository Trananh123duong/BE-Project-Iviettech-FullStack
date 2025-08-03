export interface CategoryItem {
  name: string;
}

export interface ChapterDataItem {
  chapter_name: string;
  chapter_title: string;
  chapter_api_data: string;
}

export interface ChapterServer {
  server_data: ChapterDataItem[];
}

export interface StoryItem {
  name: string;
  slug: string;
  content: string;
  status: string;
  author: string[];
  category: CategoryItem[];
  chapters: ChapterServer[];
}

export interface SeoSchema {
  image: string;
}

export interface SeoOnPage {
  seoSchema: SeoSchema;
}

export interface StoryDetailData {
  item: StoryItem;
  seoOnPage: SeoOnPage;
}

export interface StoryDetailResponse {
  data: StoryDetailData;
}
