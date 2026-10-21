import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LIBRARY_DATA } from '../../data/libraryData';
import { LibraryItem } from '../../types';
import { BookOpen, Star, ChevronRight, Bookmark, ArrowLeft, ExternalLink, ShieldCheck } from 'lucide-react';

export const LibraryTool: React.FC = () => {
  const { favoriteBookIds, toggleBookFavorite } = useApp();
  const [selectedBook, setSelectedBook] = useState<LibraryItem | null>(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  return (
    <div className="p-6 rounded-2xl bg-[#141D30] border border-[#222F4A] space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#9275FF]/10 border border-[#9275FF]/30 flex items-center justify-center text-[#9275FF]">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-[#F5F7FC]">Biblioteca de Materiais de Referência</h2>
          <p className="text-xs text-[#B4BFD2]">
            Os 7 manuais com leituras adaptadas para celular disponíveis 100% offline.
          </p>
        </div>
      </div>

      {/* Editorial Advisory Banner */}
      <div className="p-3.5 rounded-xl bg-[#0E1524] border border-[#222F4A] flex items-start gap-2.5 text-xs text-[#B4BFD2]">
        <ShieldCheck className="w-4 h-4 text-[#65D6A4] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-[#F5F7FC]">Nota Editorial:</strong> Textos e exercícios foram adaptados integralmente para o padrão comercial exclusivo <strong className="text-[#D4FF63]">Modo Avanço</strong>. Os 7 PDFs de origem física preservam seus registros e créditos históricos.
        </p>
      </div>

      {!selectedBook ? (
        /* Books Grid */
        <div className="space-y-3">
          {LIBRARY_DATA.map((book) => {
            const isFav = favoriteBookIds.includes(book.id);

            return (
              <article
                key={book.id}
                className="p-4 rounded-xl bg-[#090E1A] border border-[#222F4A] hover:border-[#2C3C5C] transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <span className="text-[10px] text-[#D4FF63] uppercase font-bold tracking-wider">
                      {book.sourceDoc}
                    </span>
                    <h3 className="text-sm font-bold text-[#F5F7FC]">{book.title}</h3>
                    <p className="text-xs text-[#B4BFD2]">{book.subtitle}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleBookFavorite(book.id)}
                    className="p-2 text-[#B4BFD2] hover:text-[#FFD080] min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label={isFav ? 'Remover dos favoritos' : 'Favoritar livro'}
                  >
                    <Star className={`w-4 h-4 ${isFav ? 'fill-[#FFD080] text-[#FFD080]' : ''}`} />
                  </button>
                </div>

                <p className="text-xs text-[#E0E6F0] leading-relaxed line-clamp-2 bg-[#141D30] p-2.5 rounded-lg">
                  {book.summary}
                </p>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-[#8C98AF]">
                    {book.chapters.length} capítulos disponíveis
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedBook(book);
                      setActiveChapterIndex(0);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-[#1D2940] hover:bg-[#D4FF63] hover:text-black text-xs font-semibold text-[#F5F7FC] flex items-center gap-1.5 transition-colors min-h-[40px]"
                  >
                    <span>Ler Manual</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* Reading View */
        <article className="space-y-5 animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-[#222F4A]">
            <button
              type="button"
              onClick={() => setSelectedBook(null)}
              className="text-xs text-[#B4BFD2] hover:text-[#F5F7FC] flex items-center gap-1.5 min-h-[44px]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar à Biblioteca</span>
            </button>

            <button
              type="button"
              onClick={() => toggleBookFavorite(selectedBook.id)}
              className="text-xs text-[#B4BFD2] hover:text-[#FFD080] flex items-center gap-1 min-h-[44px]"
            >
              <Star
                className={`w-4 h-4 ${
                  favoriteBookIds.includes(selectedBook.id) ? 'fill-[#FFD080] text-[#FFD080]' : ''
                }`}
              />
              <span>{favoriteBookIds.includes(selectedBook.id) ? 'Favorito' : 'Favoritar'}</span>
            </button>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-[#D4FF63] font-bold uppercase tracking-wider">
              {selectedBook.sourceDoc}
            </span>
            <h2 className="text-lg font-bold text-[#F5F7FC]">{selectedBook.title}</h2>
            <p className="text-xs text-[#B4BFD2]">{selectedBook.authorCredits}</p>
          </div>

          {/* Chapter Selector Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {selectedBook.chapters.map((chap, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveChapterIndex(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors min-h-[40px] ${
                  activeChapterIndex === idx
                    ? 'bg-[#D4FF63] text-black font-bold'
                    : 'bg-[#090E1A] text-[#B4BFD2] hover:text-[#F5F7FC] border border-[#222F4A]'
                }`}
              >
                {chap.title}
              </button>
            ))}
          </div>

          {/* Chapter Reading Content */}
          <div className="p-5 rounded-xl bg-[#090E1A] border border-[#222F4A] space-y-3">
            <h3 className="text-sm font-bold text-[#F5F7FC]">
              {selectedBook.chapters[activeChapterIndex]?.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#E0E6F0] leading-relaxed whitespace-pre-line font-normal">
              {selectedBook.chapters[activeChapterIndex]?.content}
            </p>
          </div>

          {/* Practical Application Callout */}
          <div className="p-3.5 rounded-xl bg-[#D4FF63]/10 border border-[#D4FF63]/30 text-xs text-[#F5F7FC] space-y-1">
            <strong className="text-[#D4FF63] block uppercase tracking-wider">Aplicação Prática:</strong>
            <p className="text-[#E0E6F0] leading-relaxed">{selectedBook.practicalApplication}</p>
          </div>
        </article>
      )}
    </div>
  );
};
