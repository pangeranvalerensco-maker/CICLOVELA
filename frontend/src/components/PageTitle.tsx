import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const TITLE_MAP: Record<string, string> = {
  '/': 'Beranda — CICLOVELA',
  '/catalog': 'Katalog Produk — CICLOVELA',
  '/traceability': 'Lacak Produk — CICLOVELA',
  '/partners': 'Mitra Bisnis — CICLOVELA',
  '/impact': 'Dampak Kita — CICLOVELA',
  '/terms': 'Syarat & Ketentuan — CICLOVELA',
  '/privacy': 'Kebijakan Privasi — CICLOVELA',
  '/contact': 'Hubungi Kami — CICLOVELA',
  '/login': 'Masuk — CICLOVELA',
  '/register': 'Daftar — CICLOVELA',
  '/forgot-password': 'Lupa Password — CICLOVELA',
  '/reset-password': 'Reset Password — CICLOVELA',
  '/dashboard': 'Dashboard — CICLOVELA',
};

const PageTitle = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    let title = 'CICLOVELA — Rantai Pasok Pertanian Terpercaya';
    // exact match
    if (TITLE_MAP[pathname]) {
      title = TITLE_MAP[pathname];
    } else if (pathname.startsWith('/catalog/')) {
      title = 'Detail Produk — CICLOVELA';
    } else if (pathname.startsWith('/admin')) {
      title = 'Admin — CICLOVELA';
    } else if (pathname.startsWith('/dashboard')) {
      title = 'Dashboard — CICLOVELA';
    }
    document.title = title;
  }, [pathname]);

  return null;
};

export default PageTitle;
