export interface StoryListItem {
  slug: string;
}

export interface StoryListData {
  items: StoryListItem[];
}

export interface StoryListResponse {
  data: StoryListData;
}
