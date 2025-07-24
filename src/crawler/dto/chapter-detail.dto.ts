export interface ChapterImageItem {
  image_file: string;
}

export interface ChapterItem {
  chapter_path: string;
  chapter_image: ChapterImageItem[];
}

export interface ChapterApiData {
  domain_cdn: string;
  item: ChapterItem;
}

export interface ChapterApiResponse {
  data: ChapterApiData;
}
