import { api } from "./client";

export interface BibleVerseDTO {
  number: number;
  text: string;
}

export interface BibleChapterDTO {
  book: { abbrev: string; name: string };
  version: string;
  chapter: number;
  verses: BibleVerseDTO[];
}

export interface BibleDailyVerseDTO {
  book: { abbrev: string; name: string };
  chapter: number;
  verse: number;
  text: string;
}

export function getChapter(
  book: string,
  chapter: number,
  version = "nvi",
): Promise<BibleChapterDTO> {
  return api.get<BibleChapterDTO>(`/bible/${encodeURIComponent(book)}/${chapter}`, {
    params: { version },
  });
}
