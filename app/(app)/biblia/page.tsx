"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/ui/AppShell";
import { AuthGuard } from "@/components/AuthGuard";
import { getChapter } from "@/api-client/bible";

const BOOKS = [
  "gn", "ex", "lv", "nm", "dt", "js", "jz", "rt", "1sm", "2sm", "1rs", "2rs", "1cr", "2cr",
  "ed", "ne", "et", "job", "sl", "pv", "ec", "ct", "is", "jr", "lm", "ez", "dn", "os", "jl",
  "am", "ob", "jn", "mq", "na", "hc", "sf", "ag", "zc", "ml",
  "mt", "mc", "lc", "jo", "at", "rm", "1co", "2co", "gl", "ef", "fp", "cl", "1ts", "2ts",
  "1tm", "2tm", "tt", "fm", "hb", "tg", "1pe", "2pe", "1jo", "2jo", "3jo", "jd", "ap",
];

const BOOK_NAMES: Record<string, string> = {
  gn: "Gênesis", ex: "Êxodo", lv: "Levítico", nm: "Números", dt: "Deuteronômio",
  js: "Josué", jz: "Juízes", rt: "Rute", "1sm": "1 Samuel", "2sm": "2 Samuel",
  "1rs": "1 Reis", "2rs": "2 Reis", "1cr": "1 Crônicas", "2cr": "2 Crônicas",
  ed: "Esdras", ne: "Neemias", et: "Ester", job: "Jó", sl: "Salmos", pv: "Provérbios",
  ec: "Eclesiastes", ct: "Cânticos", is: "Isaías", jr: "Jeremias", lm: "Lamentações",
  ez: "Ezequiel", dn: "Daniel", os: "Oséias", jl: "Joel", am: "Amós", ob: "Obadias",
  jn: "Jonas", mq: "Miquéias", na: "Naum", hc: "Habacuque", sf: "Sofonias",
  ag: "Ageu", zc: "Zacarias", ml: "Malaquias",
  mt: "Mateus", mc: "Marcos", lc: "Lucas", jo: "João", at: "Atos",
  rm: "Romanos", "1co": "1 Coríntios", "2co": "2 Coríntios", gl: "Gálatas",
  ef: "Efésios", fp: "Filipenses", cl: "Colossenses", "1ts": "1 Tessalonicenses",
  "2ts": "2 Tessalonicenses", "1tm": "1 Timóteo", "2tm": "2 Timóteo", tt: "Tito",
  fm: "Filemom", hb: "Hebreus", tg: "Tiago", "1pe": "1 Pedro", "2pe": "2 Pedro",
  "1jo": "1 João", "2jo": "2 João", "3jo": "3 João", jd: "Judas", ap: "Apocalipse",
};

const CHAPTER_COUNTS: Record<string, number> = {
  gn: 50, ex: 40, lv: 27, nm: 36, dt: 34, js: 24, jz: 21, rt: 4, "1sm": 31, "2sm": 24,
  "1rs": 22, "2rs": 25, "1cr": 29, "2cr": 36, ed: 10, ne: 13, et: 10, job: 42, sl: 150,
  pv: 31, ec: 12, ct: 8, is: 66, jr: 52, lm: 5, ez: 48, dn: 12, os: 14, jl: 3, am: 9,
  ob: 1, jn: 4, mq: 7, na: 3, hc: 3, sf: 3, ag: 2, zc: 14, ml: 4,
  mt: 28, mc: 16, lc: 24, jo: 21, at: 28, rm: 16, "1co": 16, "2co": 13, gl: 6, ef: 6,
  fp: 4, cl: 4, "1ts": 5, "2ts": 3, "1tm": 6, "2tm": 4, tt: 3, fm: 1, hb: 13, tg: 5,
  "1pe": 5, "2pe": 3, "1jo": 5, "2jo": 1, "3jo": 1, jd: 1, ap: 22,
};

function BibliaContent() {
  const [selectedBook, setSelectedBook] = useState("sl");
  const [chapter, setChapter] = useState(1);

  const { data: chapterData, isFetching } = useQuery({
    queryKey: ["bible", selectedBook, chapter],
    queryFn: () => getChapter(selectedBook, chapter),
    enabled: !!selectedBook,
  });

  const maxChapters = CHAPTER_COUNTS[selectedBook] || 1;

  return (
    <div className="mx-auto max-w-3xl px-5 pb-10 pt-6 md:max-w-2xl md:px-12 md:py-10">
      <h2 className="mb-1 text-2xl font-semibold">Bíblia</h2>

      <div className="mb-4 flex gap-2">
        <select
          value={selectedBook}
          onChange={(e) => { setSelectedBook(e.target.value); setChapter(1); }}
          className="flex-1 rounded-xl border border-divider bg-surface px-3 py-2 text-sm outline-none"
        >
          {BOOKS.map((book) => (
            <option key={book} value={book}>
              {BOOK_NAMES[book]}
            </option>
          ))}
        </select>
        <select
          value={chapter}
          onChange={(e) => setChapter(Number(e.target.value))}
          className="w-20 rounded-xl border border-divider bg-surface px-3 py-2 text-sm outline-none"
        >
          {Array.from({ length: maxChapters }, (_, i) => i + 1).map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {isFetching && (
        <p className="text-center text-sm text-text-muted">Carregando...</p>
      )}

      {chapterData && (
        <div>
          <h3 className="mb-4 text-lg font-semibold">
            {chapterData.book.name} {chapter}
          </h3>
          <div className="space-y-2">
            {chapterData.verses.map((verse) => (
              <p key={verse.number} className="text-sm leading-relaxed">
                <span className="mr-1.5 font-semibold text-accent">{verse.number}</span>
                {verse.text}
              </p>
            ))}
          </div>

          <div className="mt-6 flex justify-between">
            <button
              type="button"
              onClick={() => setChapter((c) => Math.max(1, c - 1))}
              disabled={chapter <= 1}
              className="rounded-xl bg-surface px-4 py-2 text-sm font-medium disabled:opacity-40"
            >
              Anterior
            </button>
            <button
              type="button"
              onClick={() => setChapter((c) => Math.min(maxChapters, c + 1))}
              disabled={chapter >= maxChapters}
              className="rounded-xl bg-surface px-4 py-2 text-sm font-medium disabled:opacity-40"
            >
              Próximo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BibliaPage() {
  return (
    <AuthGuard>
      <AppShell active="/biblia">
        <BibliaContent />
      </AppShell>
    </AuthGuard>
  );
}
