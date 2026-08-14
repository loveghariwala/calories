import Link from 'next/link';
import { Food3DAsset } from '@/components/Food3DAsset';
import { ArrowLeft, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 text-center font-sans">
      <div className="max-w-md w-full editorial-card rounded-3xl p-8 sm:p-12 space-y-6 shadow-xl">
        <div className="flex justify-center">
          <div className="p-4 rounded-3xl bg-[#FAF8F5] border border-[#EAE3D9] shadow-xs animate-bounce-slow">
            <Food3DAsset name="Avocado" type="avocado" size={80} />
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-[#C4552D]">
            Error 404 • Specimen Not Found
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#181513]">
            Page Out of Range
          </h1>
          <p className="text-xs sm:text-sm text-[#786C62] leading-relaxed">
            The whole food specimen or page you are looking for has been moved or does not exist in our USDA index.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#C4552D] hover:bg-[#A03E1B] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <Home className="w-4 h-4" />
            <span>Return to Studio Home</span>
          </Link>
          <Link
            href="/#categories"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-white hover:bg-[#FAF8F5] border border-[#EAE3D9] text-[#181513] text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-2xs"
          >
            <Search className="w-4 h-4" />
            <span>Browse Directories</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
