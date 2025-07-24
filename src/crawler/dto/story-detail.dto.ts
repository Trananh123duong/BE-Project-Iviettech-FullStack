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
  author: string[]; // vì bạn join(', ') lại
  category: CategoryItem[];
  chapters: ChapterServer[];
}

export interface StoryDetailData {
  item: StoryItem;
}

export interface StoryDetailResponse {
  data: StoryDetailData;
}
