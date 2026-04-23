export interface BookResult {
  title: string;
  author: string;
  totalPages: number;
  category: string;
  coverUrl: string;
  openLibraryKey: string;
}

export interface MagazineResult {
  title: string;
  publisher: string;
  coverUrl: string;
}

const BOOK_CATEGORIES = ['Fiction', 'Non-fiction', 'Science', 'History', 'Biography', 'Self-help', 'Technology', 'Philosophy', 'Art', 'Other'];

function guessCategory(subjects: string[]): string {
  if (!subjects?.length) return 'Fiction';
  const s = subjects.join(' ').toLowerCase();
  if (s.includes('fiction') || s.includes('novel')) return 'Fiction';
  if (s.includes('science') || s.includes('physics') || s.includes('biology') || s.includes('chemistry')) return 'Science';
  if (s.includes('history') || s.includes('historical')) return 'History';
  if (s.includes('biography') || s.includes('autobiography') || s.includes('memoir')) return 'Biography';
  if (s.includes('self-help') || s.includes('self help') || s.includes('personal development')) return 'Self-help';
  if (s.includes('technolog') || s.includes('computer') || s.includes('programming') || s.includes('software')) return 'Technology';
  if (s.includes('philosoph')) return 'Philosophy';
  if (s.includes('art') || s.includes('design') || s.includes('photography')) return 'Art';
  if (s.includes('nonfiction') || s.includes('non-fiction')) return 'Non-fiction';
  return BOOK_CATEGORIES.find(c => s.includes(c.toLowerCase())) ?? 'Non-fiction';
}

export async function searchBooks(query: string, signal?: AbortSignal): Promise<BookResult[]> {
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&fields=key,title,author_name,number_of_pages_median,cover_i,subject&limit=8`;
  const res = await fetch(url, { signal });
  if (!res.ok) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await res.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data.docs ?? []).map((doc: any): BookResult => ({
    title: doc.title ?? '',
    author: (doc.author_name ?? [])[0] ?? 'Unknown',
    totalPages: doc.number_of_pages_median ?? 0,
    category: guessCategory(doc.subject ?? []),
    coverUrl: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : '',
    openLibraryKey: doc.key ?? '',
  })).filter((r: BookResult) => r.title);
}

export async function searchMagazines(query: string, signal?: AbortSignal): Promise<MagazineResult[]> {
  const url = `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(query)}&printType=magazines&maxResults=8`;
  const res = await fetch(url, { signal });
  if (!res.ok) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await res.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data.items ?? []).map((item: any): MagazineResult => {
    const info = item.volumeInfo ?? {};
    const thumb: string = (info.imageLinks?.thumbnail ?? '').replace('http://', 'https://').replace('&edge=curl', '');
    return {
      title: info.title ?? '',
      publisher: info.publisher ?? '',
      coverUrl: thumb,
    };
  }).filter((r: MagazineResult) => r.title);
}
