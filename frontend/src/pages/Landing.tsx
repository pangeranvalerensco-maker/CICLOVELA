import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, ShieldCheck, MapPin, Leaf,
  ChevronDown, CheckCircle2, TrendingUp, Users, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const HERO_SLIDES = [
  {
    src: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80&auto=format&fit=crop',
    alt: 'Hamparan sawah hijau',
  },
  {
    src: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1600&q=80&auto=format&fit=crop',
    alt: 'Petani memanen di ladang',
  },
  {
    src: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&q=80&auto=format&fit=crop',
    alt: 'Kebun hijau yang subur',
  },
];

const Landing = () => {
  const { t } = useTranslation();
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setSlide((s) => (s + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  const faqs = [
    { q: t('landing.faq1q'), a: t('landing.faq1a') },
    { q: t('landing.faq2q'), a: t('landing.faq2a') },
    { q: t('landing.faq3q'), a: t('landing.faq3a') },
    { q: t('landing.faq4q'), a: t('landing.faq4a') },
  ];

  const steps = [
    { step: 1, title: t('landing.step1t'), desc: t('landing.step1d') },
    { step: 2, title: t('landing.step2t'), desc: t('landing.step2d') },
    { step: 3, title: t('landing.step3t'), desc: t('landing.step3d') },
    { step: 4, title: t('landing.step4t'), desc: t('landing.step4d') },
  ];

  return (
    <>
      <main className="flex-1">

        {/* 2. HERO SECTION + CAROUSEL */}
        <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32">
          <div className="absolute inset-0 z-0" aria-hidden="true">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/60 via-slate-50 to-teal-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950" />
            {HERO_SLIDES.map((img, i) => (
              <img
                key={img.src}
                src={img.src}
                alt={img.alt}
                loading={i === 0 ? 'eager' : 'lazy'}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === slide ? 'opacity-100' : 'opacity-0'}`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-50/85 via-slate-50/70 to-slate-50 dark:from-slate-950/90 dark:via-slate-950/75 dark:to-slate-950" />
          </div>

          {/* Carousel controls */}
          <button
            onClick={() => setSlide((slide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/70 dark:bg-slate-800/70 text-slate-700 dark:text-slate-200 shadow hover:bg-white dark:hover:bg-slate-700 transition-colors"
            aria-label="Sebelumnya"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setSlide((slide + 1) % HERO_SLIDES.length)}
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/70 dark:bg-slate-800/70 text-slate-700 dark:text-slate-200 shadow hover:bg-white dark:hover:bg-slate-700 transition-colors"
            aria-label="Berikutnya"
          >
            <ChevronRight size={20} />
          </button>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-sm font-semibold mb-8 animate-in slide-in-from-bottom-4 duration-700 fade-in">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {t('hero.badge')}
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] max-w-4xl mx-auto animate-in slide-in-from-bottom-6 duration-700 fade-in delay-100">
              {t('hero.titleA')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">{t('hero.titleB')}</span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed animate-in slide-in-from-bottom-6 duration-700 fade-in delay-200">
              {t('hero.subtitle')}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-in slide-in-from-bottom-8 duration-700 fade-in delay-300">
              <Link to="/register" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full text-base font-bold shadow-xl shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 hover:-translate-y-1">
                {t('hero.ctaStart')} <ArrowRight size={20} />
              </Link>
              <Link to="/traceability" className="w-full sm:w-auto bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-100 px-8 py-4 rounded-full text-base font-bold transition-all flex items-center justify-center gap-2 hover:-translate-y-1">
                <MapPin size={20} className="text-emerald-500" /> {t('hero.ctaTrace')}
              </Link>
            </div>

            {/* Dots */}
            <div className="mt-8 flex items-center justify-center gap-2">
              {HERO_SLIDES.map((img, i) => (
                <button
                  key={img.src}
                  onClick={() => setSlide(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${i === slide ? 'w-8 bg-emerald-500' : 'w-2 bg-slate-400/60 hover:bg-slate-500'}`}
                />
              ))}
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mt-10">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl overflow-hidden shadow-lg border border-white/40 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur">
                  <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80&auto=format&fit=crop" alt="Petani memanen" className="h-36 w-full object-cover" loading="lazy" />
                  <p className="p-3 text-sm font-bold text-slate-800 dark:text-slate-100">{t('hero.card1')}</p>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg border border-white/40 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur">
                  <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80&auto=format&fit=crop" alt="Pasar dan distribusi" className="h-36 w-full object-cover" loading="lazy" />
                  <p className="p-3 text-sm font-bold text-slate-800 dark:text-slate-100">{t('hero.card2')}</p>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg border border-white/40 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur">
                  <img src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80&auto=format&fit=crop" alt="Kebun hijau" className="h-36 w-full object-cover" loading="lazy" />
                  <p className="p-3 text-sm font-bold text-slate-800 dark:text-slate-100">{t('hero.card3')}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. TENTANG KAMI (ABOUT) */}
        <section id="about" className="py-20 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6">{t('landing.aboutTitle')}</h2>
                <p className="text-slate-300 text-lg leading-relaxed mb-6">
                  {t('landing.aboutP1')}
                </p>
                <p className="text-slate-300 text-lg leading-relaxed mb-8">
                  <strong>CICLOVELA</strong> {t('landing.aboutP2').replace('CICLOVELA ', '')}
                </p>
                <div className="grid grid-cols-2 gap-6 border-t border-slate-800 pt-8">
                  <div>
                    <h4 className="text-4xl font-black text-emerald-400 mb-1">100%</h4>
                    <p className="text-slate-400 text-sm font-medium">{t('landing.statTransp')}</p>
                  </div>
                  <div>
                    <h4 className="text-4xl font-black text-teal-400 mb-1">0%</h4>
                    <p className="text-slate-400 text-sm font-medium">{t('landing.statManip')}</p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 rounded-3xl transform rotate-3 scale-105 blur-lg"></div>
                <div className="bg-slate-800 p-8 rounded-3xl relative border border-slate-700 shadow-2xl">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center"><CheckCircle2 size={24} /></div>
                    <div>
                      <h4 className="font-bold text-lg">{t('landing.side1t')}</h4>
                      <p className="text-slate-400 text-sm">{t('landing.side1d')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center"><Users size={24} /></div>
                    <div>
                      <h4 className="font-bold text-lg">{t('landing.side2t')}</h4>
                      <p className="text-slate-400 text-sm">{t('landing.side2d')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-rose-500/20 text-rose-400 rounded-xl flex items-center justify-center"><TrendingUp size={24} /></div>
                    <div>
                      <h4 className="font-bold text-lg">{t('landing.side3t')}</h4>
                      <p className="text-slate-400 text-sm">{t('landing.side3d')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. CARA KERJA (HOW IT WORKS) */}
        <section id="how-it-works" className="py-24 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">{t('landing.howTitle')}</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto mb-16">{t('landing.howSub')}</p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              <div className="hidden md:block absolute top-12 left-1/8 right-1/8 h-0.5 bg-slate-100 dark:bg-slate-800 z-0 w-3/4 mx-auto"></div>

              {steps.map((item) => (
                <div key={item.step} className="relative z-10 bg-white dark:bg-slate-900 pt-6">
                  <div className="w-16 h-16 bg-emerald-600 text-white text-2xl font-black rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-600/30 border-4 border-white dark:border-slate-800">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. FITUR UTAMA (FEATURES) */}
        <section id="features" className="bg-slate-50 dark:bg-slate-950 py-24 border-y border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">{t('landing.featTitle')}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 border border-blue-100">
                  <ShieldCheck size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{t('landing.feat1t')}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{t('landing.feat1d')}</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow transform md:-translate-y-4">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6 border border-emerald-100">
                  <MapPin size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{t('landing.feat2t')}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{t('landing.feat2d')}</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-6 border border-rose-100">
                  <Leaf size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{t('landing.feat3t')}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{t('landing.feat3d')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. FAQ SECTION */}
        <section id="faq" className="py-24 bg-white dark:bg-slate-900">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-slate-900">{t('landing.faqTitle')}</h2>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-slate-200 rounded-xl overflow-hidden transition-all">
                  <button
                    className="w-full px-6 py-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  >
                    <span className="font-bold text-slate-800 text-left">{faq.q}</span>
                    <ChevronDown size={20} className={`text-slate-500 transition-transform ${activeFaq === index ? 'rotate-180' : ''}`} />
                  </button>
                  {activeFaq === index && (
                    <div className="px-6 py-4 bg-white">
                      <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
    </>
  );
};

export default Landing;
