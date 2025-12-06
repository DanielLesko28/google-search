export interface SearchResultItem {
  kind: string;
  title: string;
  htmlTitle: string;
  link: string;
  displayLink: string;
  snippet: string;
  htmlSnippet: string;
  formattedUrl: string;
  htmlFormattedUrl: string;
  pagemap?: {
    metatags?: Array<Record<string, string>>;
    cse_image?: Array<{ src: string }>;
  };
}
