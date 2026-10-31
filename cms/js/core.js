/* Seabar CMS – inti: state, penyimpanan, komponen UI, router */
(() => {
  'use strict';
  const KEY = 'seabar_cms_proto_v1';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const uid = () => Math.random().toString(36).slice(2, 9);
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const getPath = (o, p) => p.split('.').reduce((a, k) => (a == null ? a : a[k]), o);
  const setPath = (o, p, v) => { const ks = p.split('.'); const last = ks.pop(); ks.reduce((a, k) => a[k], o)[last] = v; };
  const fmtDate = (t) => new Date(t).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  const fmtTime = (t) => new Date(t).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  const slugify = (s) => String(s).toLowerCase().replace(/&/g, ' dan ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

  const ICONS = ['fa-graduation-cap', 'fa-globe', 'fa-users', 'fa-briefcase', 'fa-handshake', 'fa-bell-concierge', 'fa-bed', 'fa-shirt', 'fa-language', 'fa-kitchen-set', 'fa-mug-hot', 'fa-ship', 'fa-anchor', 'fa-medal', 'fa-award', 'fa-certificate', 'fa-chart-line', 'fa-star', 'fa-heart', 'fa-location-dot', 'fa-phone', 'fa-envelope', 'fa-clock', 'fa-book-open', 'fa-chalkboard-user', 'fa-utensils', 'fa-martini-glass-citrus', 'fa-soap', 'fa-broom', 'fa-fire-burner', 'fa-comments', 'fa-headphones', 'fa-earth-americas', 'fa-user-tie', 'fa-id-card', 'fa-passport', 'fa-plane', 'fa-hotel', 'fa-building', 'fa-trophy', 'fa-shield-halved', 'fa-lightbulb', 'fa-rocket', 'fa-hand-holding-heart', 'fa-file-circle-check', 'fa-gear', 'fa-camera', 'fa-video', 'fa-calendar-check', 'fa-money-bill-wave', 'fa-thumbs-up', 'fa-circle-check'];

  /* ---------------- data awal (isi landing page saat ini) ---------------- */
  function seed() {
    const P = (name, icon, subtitle, duration, about, curriculum, f1, f2) => ({
      id: uid(), name, slug: slugify(name), icon, subtitle, duration, certificate: 'Internasional', job: 'Global', about, curriculum,
      fac1: { name: f1[0], icon: f1[1] }, fac2: { name: f2[0], icon: f2[1] }, status: 'published', seoTitle: name + ' – Program Pelatihan Seabar College', seoDesc: subtitle,
    });
    const programs = [
      P('Food & Beverage', 'fa-bell-concierge', 'Pelatihan profesional di bidang Food & Beverage untuk berkarier di hotel dan kapal pesiar internasional.', '6 Bulan',
        'Program Food & Beverage di Seabar College dirancang untuk membekali Anda dengan keterampilan profesional dalam pelayanan makanan dan minuman, sesuai standar industri perhotelan dan kapal pesiar internasional.',
        ['Food & Beverage Service', 'Table Setting & Etiquette', 'Menu Knowledge', 'Bar & Beverage Service', 'Hospitality Management', 'Customer Service Excellence', 'Food Safety & Hygiene', 'Practical Training'], ['Laboratorium F&B', 'fa-kitchen-set'], ['Ruang Praktik Hotel', 'fa-utensils']),
      P('Housekeeping', 'fa-bed', 'Pelatihan profesional di bidang Housekeeping untuk berkarier di hotel dan kapal pesiar internasional.', 'Sesuai Jadwal',
        'Program Housekeeping di Seabar College dirancang untuk membekali Anda dengan keterampilan profesional dalam kebersihan dan penataan kamar maupun area publik.',
        ['Room Cleaning & Preparation', 'Bed Making Standard', 'Linen & Amenities Management', 'Public Area Cleaning', 'Housekeeping Safety & Hygiene', 'Guest Room Etiquette', 'Chemical & Equipment Handling', 'Practical Training'], ['Laboratorium Housekeeping', 'fa-broom'], ['Ruang Praktik Kamar Hotel', 'fa-bed']),
      P('Laundry', 'fa-shirt', 'Pelatihan profesional di bidang Laundry untuk berkarier di hotel dan kapal pesiar internasional.', 'Sesuai Jadwal',
        'Program Laundry di Seabar College dirancang untuk membekali Anda dengan keterampilan profesional dalam pengelolaan linen dan pakaian.',
        ['Sorting & Washing Process', 'Stain Removal', 'Pressing & Ironing', 'Folding & Packing', 'Laundry Machine Operation', 'Linen Inventory', 'Hygiene & Safety', 'Practical Training'], ['Laboratorium Laundry', 'fa-soap'], ['Ruang Praktik Linen', 'fa-shirt']),
      P('English', 'fa-language', 'Pelatihan Bahasa Inggris untuk dunia hospitality agar siap berkarier di hotel dan kapal pesiar internasional.', 'Sesuai Jadwal',
        'Program English di Seabar College dirancang untuk membekali Anda dengan kemampuan komunikasi Bahasa Inggris yang dibutuhkan di industri perhotelan dan kapal pesiar.',
        ['Hospitality Vocabulary', 'Speaking & Listening', 'Guest Communication', 'Interview Preparation', 'Writing & Email Basics', 'Pronunciation & Fluency', 'Role Play Simulation', 'Practice Test'], ['Laboratorium Bahasa', 'fa-headphones'], ['Ruang Simulasi Wawancara', 'fa-comments']),
      P('Cook', 'fa-kitchen-set', 'Pelatihan profesional di bidang Cook untuk berkarier di hotel dan kapal pesiar internasional.', 'Sesuai Jadwal',
        'Program Cook di Seabar College dirancang untuk membekali Anda dengan keterampilan profesional di dapur, mulai dari persiapan bahan hingga penyajian.',
        ['Basic Cooking Techniques', 'Knife Skills', 'Kitchen Hygiene & Safety', 'International Cuisine', 'Food Preparation', 'Menu Planning', 'Plating & Presentation', 'Practical Training'], ['Dapur Praktik', 'fa-kitchen-set'], ['Ruang Praktik Hotel', 'fa-utensils']),
      P('Barista & Bar', 'fa-mug-hot', 'Pelatihan profesional di bidang Barista & Bar untuk berkarier di hotel dan kapal pesiar internasional.', 'Sesuai Jadwal',
        'Program Barista & Bar di Seabar College dirancang untuk membekali Anda dengan keterampilan profesional dalam penyajian kopi dan minuman.',
        ['Espresso & Coffee Brewing', 'Latte Art', 'Bar Equipment Handling', 'Classic Cocktails & Mocktails', 'Beverage Knowledge', 'Customer Service at the Bar', 'Hygiene & Safety', 'Practical Training'], ['Laboratorium Barista', 'fa-mug-hot'], ['Bar Praktik', 'fa-martini-glass-citrus']),
    ];
    programs.forEach((p, i) => { p.slug = ['food-beverage', 'housekeeping', 'laundry', 'english', 'cook', 'barista-bar'][i]; });

    const A = (name, batch, company, place, photo, text) => ({ id: uid(), name, batch, company, place, photo, text, status: 'published' });
    const alumni = [
      A('Rizky Akbar', 'Students Batch 5', 'Carnival', '', '../assets/testimonial.jpg', 'Di Seabar saya belajar bahwa disiplin dan sikap melayani adalah bekal utama. Sekarang saya merasakan langsung suasana kerja di kapal pesiar yang dulu hanya bisa saya bayangkan.'),
      A('Reza', 'Students Batch 9', 'Celebrity Cruises', '', '../assets/testimonial-2.jpg', 'Mulai dari menyiapkan dokumen sampai latihan wawancara, semuanya didampingi dengan sabar. Saat berkas visa disetujui, saya tahu semua usaha dan bimbingan itu terbayar.'),
      A('Fahmi', 'Students Batch 9', 'Royal Caribbean International', 'Juneau, Alaska', '../assets/testimonial-3.jpg', 'Latihan bahasa Inggris dan simulasi kerja membuat saya percaya diri berkomunikasi dengan tamu dan rekan dari berbagai negara.'),
      A('Dicky Widiansyah', 'Students Batch 7', 'Royal Caribbean International', 'Port Roatan', '../assets/testimonial-4.jpg', 'Praktik langsung dan kebiasaan bekerja tepat waktu yang dibangun selama pelatihan sangat membantu saya beradaptasi.'),
      A('Eep Saefuloh', 'Students Batch 7', 'Norwegian Cruise Line', '', '../assets/testimonial-5.jpg', 'Yang paling berkesan adalah dukungan instruktur yang tidak berhenti setelah kelas selesai. Bagi yang masih ragu, beranikan diri melangkah, bimbingannya ada.'),
    ];
    const partners = [
      ['Viking River Cruises', 'https://www.vikingcareers.com'], ['Disney Cruise', 'https://www.disneycareers.com'], ['Carnival', 'https://shipjobs.carnival.com'],
      ['Royal Caribbean International', 'https://www.rclctrac.com'], ['PT Ratu Oceania Raya', 'https://ratuoceaniaraya.com/career'], ['Equinox Bahari Utama', 'https://equinoxshipping.co.id/career'],
    ].map(([name, url]) => ({ id: uid(), name, url, logo: '', active: true }));
    const team = [['Gugum Gumilar', 'Direktur Utama'], ['Meggi Diah Mediarti', 'Direktur Keuangan'], ['Endi Trigono', 'Kepala Lembaga'], ['Cucu Cahya Mulyati', 'Administrasi'], ['Diffani Alung Putri', 'Accounting'], ['Rizky Khafi Zaeni Putra', 'Digital Marketing']]
      .map(([name, role]) => ({ id: uid(), name, role, photo: '', active: true }));
    const body = '<p>Seabar College membuka pendaftaran untuk calon peserta pelatihan perhotelan dan kapal pesiar. Hubungi admin untuk informasi jadwal, persyaratan, dan biaya.</p><p>Isi artikel ini adalah contoh. Ganti dengan informasi resmi lembaga.</p>';
    const news = [
      { id: uid(), title: 'Penerimaan Siswa Baru Tahun 2026/2027', slug: 'penerimaan-siswa-baru-2026-2027', tag: 'Pengumuman', date: '2025-10-25', excerpt: 'Informasi penerimaan siswa baru Seabar College.', body, cover: '', status: 'published' },
      { id: uid(), title: 'Pelatihan Hospitality Bersama Mitra Industri', slug: 'pelatihan-hospitality-bersama-mitra-industri', tag: 'Kegiatan', date: '2025-10-18', excerpt: 'Kegiatan pelatihan bersama mitra industri.', body, cover: '', status: 'published' },
      { id: uid(), title: 'Tips Sukses Bekerja di Kapal Pesiar', slug: 'tips-sukses-bekerja-di-kapal-pesiar', tag: 'Tips Karier', date: '2025-10-12', excerpt: 'Tips menyiapkan diri sebelum bekerja di kapal pesiar.', body, cover: '', status: 'draft' },
    ];
    const content = {
      sections: [
        { key: 'hero', label: 'Hero & Keunggulan', desc: 'Pembuka halaman: kapal, ombak, judul, dan 5 keunggulan', icon: 'fa-flag', route: 'hero', visible: true },
        { key: 'program', label: 'Program Pelatihan', desc: 'Kartu 6 program + halaman detail', icon: 'fa-graduation-cap', route: 'program', visible: true },
        { key: 'tentang', label: 'Tentang & Band', desc: 'Profil singkat, video, dan band statistik', icon: 'fa-circle-info', route: 'tentang', visible: true },
        { key: 'alumni', label: 'Cerita Alumni', desc: 'Kartu testimoni alumni berfoto', icon: 'fa-quote-left', route: 'alumni', visible: true },
        { key: 'mitra', label: 'Mitra Industri', desc: 'Logo berjalan otomatis', icon: 'fa-handshake', route: 'mitra', visible: true },
        { key: 'team', label: 'Team Kami', desc: 'Carousel struktur tim', icon: 'fa-users', route: 'team', visible: true },
        { key: 'berita', label: 'Berita & Informasi', desc: '3 berita terbaru', icon: 'fa-newspaper', route: 'berita', visible: true },
        { key: 'cta', label: 'Ajakan Mendaftar (CTA)', desc: 'Banner penutup sebelum footer', icon: 'fa-bullhorn', route: 'tentang', visible: true },
      ],
      hero: { eyebrow: 'Your Gateway to a Global Career', title1: 'Wujudkan Karier', title2: 'Internasional Bersama', title3: 'Seabar College', subtitle: 'Pelatihan profesional di bidang perhotelan dan kapal pesiar dengan pembelajaran praktik, pendampingan, dan peluang kerja di luar negeri.', cta1Text: 'Daftar Sekarang', cta1Link: '#daftar', cta2Text: 'Tonton Profil Kami', cta2Link: '#tentang', showScript: true, script: 'Learn Today, Work Globally' },
      strip: [
        { icon: 'fa-graduation-cap', title: 'Program Berkualitas', desc: 'Standar internasional' },
        { icon: 'fa-globe', title: 'Peluang Karier Global', desc: 'Bekerja di kapal pesiar dan industri hospitality' },
        { icon: 'fa-users', title: 'Instruktur Profesional', desc: 'Didukung tenaga ahli berpengalaman' },
        { icon: 'fa-briefcase', title: 'Fasilitas Lengkap', desc: 'Ruang praktik modern' },
        { icon: 'fa-handshake', title: 'Jaringan Luas', desc: 'Mitra industri terpercaya' },
      ],
      programsSection: { eyebrow: 'Program Pelatihan', title: 'Program Unggulan untuk Masa Depan Anda', text: 'Pilih program pelatihan terbaik yang sesuai dengan minat dan tujuan karier internasional Anda.', buttonText: 'Lihat Semua Program' },
      programs,
      about: { eyebrow: 'Tentang Seabar College', title: 'Mencetak Profesional untuk Dunia Hospitality', text: 'Seabar College berkomitmen untuk memberikan pendidikan dan pelatihan berkualitas, membekali peserta dengan keterampilan dan pengalaman nyata di industri global.', buttonText: 'Kenal Lebih Dekat', buttonLink: '#tentang', videoUrl: '', photo: '',
        features: [{ icon: 'fa-gear', title: 'Pengalaman', desc: 'Lebih dari 10 tahun melatih tenaga profesional' }, { icon: 'fa-globe', title: 'Jaringan Global', desc: 'Bersama mitra industri internasional' }, { icon: 'fa-file-circle-check', title: 'Kesempatan Karier', desc: 'Bekerja di kapal pesiar dan hotel ternama' }] },
      band: { line1: 'Bersama Seabar College,', line2: 'Raih Masa Depan yang Lebih Baik', stats: [{ icon: 'fa-users', title: 'Ratusan', desc: 'Alumni Sukses' }, { icon: 'fa-briefcase', title: 'Bekerja di', desc: 'Kapal Pesiar & Hotel' }, { icon: 'fa-handshake', title: 'Mitra Industri', desc: 'Internasional' }] },
      alumniSection: { eyebrow: 'Cerita Alumni', title: 'Langkah Nyata Menuju Karier Internasional', text: 'Dengarkan pengalaman inspiratif dari alumni kami yang kini telah bekerja di berbagai kapal pesiar dunia.', buttonText: 'Lihat Cerita Alumni' },
      alumni,
      partnersSection: { eyebrow: 'Mitra Industri Kami', text: 'Bersama perusahaan terkemuka di dunia' },
      partners,
      teamSection: { eyebrow: 'People Behind Seabar', title: 'Meet the People Who Shape Your Future', text: 'Di balik setiap perjalanan dan pencapaian Seabar College, terdapat tim yang berdedikasi untuk memberikan pendidikan, pelatihan, serta pendampingan terbaik.', features: ['Experienced & Dedicated', 'Professional Training', 'Career Guidance'] },
      team,
      newsSection: { eyebrow: 'Berita & Informasi', title: 'Update Terbaru Seputar Seabar College', buttonText: 'Lihat Semua Berita' },
      news,
      cta: { title: 'Siap Memulai Perjalanan Karier Anda?', text: 'Daftar sekarang dan wujudkan impian bekerja di kancah internasional bersama Seabar College.', buttonText: 'Daftar Sekarang', buttonLink: 'https://wa.me/6287782882020' },
      nav: [
        { id: uid(), label: 'Home', href: '#home', visible: true }, { id: uid(), label: 'Program', href: '#program', visible: true, dropdown: true }, { id: uid(), label: 'Tentang Kami', href: '#tentang', visible: true },
        { id: uid(), label: 'Alumni', href: '#alumni', visible: true }, { id: uid(), label: 'Penyaluran Kerja', href: '#penyaluran', visible: true }, { id: uid(), label: 'Team Kami', href: '#team', visible: true }, { id: uid(), label: 'Berita', href: '#berita', visible: true },
      ],
      navCta: { label: 'Daftar Sekarang', href: '#daftar' },
      settings: {
        siteName: 'Seabar College', tagline: 'Your Gateway to a Global Career', logo: '../assets/logo.png', logoWhite: '../assets/logo-white.png',
        wa: '6287782882020', phone: '+62 877 8288 2020', email: 'info@seabarcollege.com', address: 'Metro Indah Mall, Jl. Soekarno-Hatta No.01 Blok I, Sekejati, Buahbatu, Kota Bandung 40286', maps: '', hours: '07.00 – 21.00 WIB',
        social: { youtube: '', instagram: '', facebook: '', linkedin: '', tiktok: '' },
        theme: { primary: '#0b2545', accent: '#1b86b8', gold: '#d4a04a', font: 'Inter' },
        seo: { title: 'Seabar College – Wujudkan Karier Internasional', description: 'Pelatihan profesional perhotelan dan kapal pesiar dengan pembelajaran praktik, pendampingan, dan peluang kerja di luar negeri.', ogImage: '', index: true },
        gtm: '', maintenance: false,
      },
    };
    const names = ['Calon Siswa 01', 'Calon Siswa 02', 'Calon Siswa 03', 'Calon Siswa 04', 'Calon Siswa 05', 'Calon Siswa 06', 'Calon Siswa 07', 'Calon Siswa 08'];
    const statuses = ['Baru', 'Baru', 'Dihubungi', 'Dihubungi', 'Terdaftar', 'Baru', 'Batal', 'Terdaftar'];
    const sources = ['Formulir Website', 'WhatsApp', 'Instagram', 'Formulir Website', 'Referral Alumni', 'WhatsApp', 'Formulir Website', 'Instagram'];
    const now = Date.now();
    const leads = names.map((n, i) => ({ id: uid(), name: n, wa: '08xx-xxxx-' + String(1000 + i), email: 'contoh' + (i + 1) + '@email.test', program: programs[i % programs.length].name, source: sources[i], status: statuses[i], note: '', at: now - i * 86400000 * 0.8, demo: true }));
    const users = [
      { id: uid(), name: 'Admin Seabar', email: 'admin@seabarcollege.com', role: 'Super Admin', active: true, last: now - 3600000 },
      { id: uid(), name: 'Editor Konten', email: 'editor@seabarcollege.com', role: 'Editor', active: true, last: now - 86400000 },
      { id: uid(), name: 'Staf Admisi', email: 'admisi@seabarcollege.com', role: 'Admisi', active: true, last: now - 2 * 86400000 },
      { id: uid(), name: 'Penulis Berita', email: 'penulis@seabarcollege.com', role: 'Penulis', active: false, last: now - 9 * 86400000 },
    ];
    const media = ['logo.png', 'logo-white.png', 'cruise-ship.png', 'testimonial.jpg', 'testimonial-2.jpg', 'testimonial-3.jpg', 'testimonial-4.jpg', 'testimonial-5.jpg'].map((f) => ({ id: uid(), name: f, src: '../assets/' + f, size: '—', builtin: true }));
    return { draft: content, published: clone(content), leads, users, media, log: [{ t: now - 7200000, user: 'Admin Seabar', action: 'Publikasi', detail: 'Konten awal dipublikasikan' }], session: null, role: 'Super Admin' };
  }

  /* ---------------- state & penyimpanan ---------------- */
  let S;
  try { S = JSON.parse(localStorage.getItem(KEY)); } catch (e) { S = null; }
  if (!S || !S.draft) S = seed();
  const D = () => S.draft;
  let saveTimer;
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); return true; } catch (e) { toast('Penyimpanan browser penuh — hapus beberapa media/foto.', 'error'); return false; } };
  const LABELS = { sections: 'Urutan section', hero: 'Hero', strip: 'Keunggulan', programsSection: 'Judul program', programs: 'Program', about: 'Tentang', band: 'Band statistik', alumniSection: 'Judul alumni', alumni: 'Alumni', partnersSection: 'Judul mitra', partners: 'Mitra industri', teamSection: 'Judul team', team: 'Team', newsSection: 'Judul berita', news: 'Berita', cta: 'CTA', nav: 'Navigasi', navCta: 'Tombol navbar', settings: 'Pengaturan situs' };
  const pending = () => Object.keys(LABELS).filter((k) => JSON.stringify(S.draft[k]) !== JSON.stringify(S.published[k]));
  function log(action, detail) { S.log.unshift({ t: Date.now(), user: (S.session && S.session.name) || 'Admin', action, detail }); S.log = S.log.slice(0, 120); }
  function touch() {
    const st = $('#saveState'); if (st) st.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Menyimpan…';
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => { if (persist() && st) st.innerHTML = '<i class="fa-solid fa-check text-emerald-500"></i> Tersimpan otomatis ' + fmtTime(Date.now()); updateBadges(); }, 350);
    updateBadges(); if (CMS.live) CMS.live();
  }
  function updateBadges() {
    const n = pending().length;
    const b = $('#pubBadge'); if (b) { b.textContent = n; b.classList.toggle('hidden', !n); }
    const s = $('#sbStatus'); if (s) s.textContent = n ? n + ' perubahan belum dipublikasikan' : 'Semua tersinkron';
    const d = $('#sbDot'); if (d) d.className = 'h-2 w-2 rounded-full ' + (n ? 'bg-gold-400' : 'bg-emerald-400');
    const newLeads = S.leads.filter((l) => l.status === 'Baru').length;
    const bd = $('#bellDot'); if (bd) bd.classList.toggle('hidden', !(newLeads || n));
    const lb = $('[data-badge="pendaftar"]'); if (lb) { lb.textContent = newLeads; lb.classList.toggle('hidden', !newLeads); }
  }

  /* ---------------- UI: toast, modal, konfirmasi ---------------- */
  function toast(msg, type = 'ok') {
    const el = document.createElement('div');
    const col = type === 'error' ? 'bg-red-600' : type === 'warn' ? 'bg-gold-500 text-navy-950' : 'bg-navy-900';
    el.className = 'toast-in pointer-events-auto flex max-w-md items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-white shadow-card ' + col;
    el.innerHTML = '<i class="fa-solid ' + (type === 'error' ? 'fa-triangle-exclamation' : 'fa-circle-check') + '"></i><span>' + esc(msg) + '</span>';
    $('#toastRoot').appendChild(el); setTimeout(() => { el.style.opacity = 0; el.style.transition = 'opacity .3s'; setTimeout(() => el.remove(), 300); }, 3200);
  }
  let modalStack = [];
  function openModal({ title, body, actions = [], size = 'max-w-lg', onMount, flush }) {
    const wrap = document.createElement('div');
    wrap.className = 'fixed inset-0 z-[90] flex items-end justify-center bg-navy-950/55 p-0 backdrop-blur-sm sm:items-center sm:p-6';
    wrap.innerHTML = `<div class="pop-in flex max-h-[92vh] w-full ${size} flex-col overflow-hidden rounded-t-3xl bg-white shadow-card sm:rounded-3xl" role="dialog" aria-modal="true" aria-label="${esc(title)}">
      <div class="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6"><h3 class="text-base font-extrabold">${esc(title)}</h3><button data-close class="btn-icon" aria-label="Tutup"><i class="fa-solid fa-xmark"></i></button></div>
      <div class="${flush ? '' : 'p-5 sm:p-6'} min-h-0 flex-1 overflow-y-auto">${body}</div>
      ${actions.length ? '<div class="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:flex-row sm:justify-end sm:px-6" data-actions></div>' : ''}</div>`;
    document.body.appendChild(wrap);
    const api = { el: wrap, close() { wrap.remove(); modalStack = modalStack.filter((m) => m !== api); } };
    wrap.addEventListener('mousedown', (e) => { if (e.target === wrap) api.close(); });
    $$('[data-close]', wrap).forEach((b) => b.addEventListener('click', api.close));
    const box = $('[data-actions]', wrap);
    actions.forEach((a) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'btn ' + (a.cls || 'btn-ghost'); b.innerHTML = a.label; b.addEventListener('click', () => { const r = a.onClick ? a.onClick(api) : null; if (r !== false && !a.keep) api.close(); }); box.appendChild(b); });
    modalStack.push(api); if (onMount) onMount(api);
    const f = $('input,textarea,select', wrap); if (f && window.innerWidth > 640 && !flush) f.focus();
    return api;
  }
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modalStack.length) modalStack[modalStack.length - 1].close(); });
  function confirmBox(title, msg, onYes, danger = true) {
    openModal({ title, body: '<p class="text-sm leading-relaxed text-slate-600">' + msg + '</p>', size: 'max-w-md', actions: [{ label: 'Batal' }, { label: danger ? '<i class="fa-solid fa-trash"></i> Ya, hapus' : 'Ya, lanjutkan', cls: danger ? 'btn-danger !bg-red-600 !text-white hover:!bg-red-700' : 'btn-primary', onClick: () => { onYes(); } }] });
  }

  /* ---------------- UI: komponen form (terikat ke path draft) ---------------- */
  const UI = {
    inp: (label, path, o = {}) => `<label class="block ${o.cls || ''}"><span class="lbl">${label}</span><input class="inp" type="${o.type || 'text'}" data-b="${path}" value="${esc(getPath(D(), path))}" ${o.ph ? 'placeholder="' + esc(o.ph) + '"' : ''}>${o.help ? '<span class="mt-1 block text-[11px] text-slate-400">' + o.help + '</span>' : ''}</label>`,
    area: (label, path, rows = 3, o = {}) => `<label class="block ${o.cls || ''}"><span class="lbl">${label}</span><textarea class="inp" rows="${rows}" data-b="${path}">${esc(getPath(D(), path))}</textarea></label>`,
    sel: (label, path, opts, o = {}) => `<label class="block ${o.cls || ''}"><span class="lbl">${label}</span><select class="inp" data-b="${path}">${opts.map(([v, l]) => `<option value="${esc(v)}" ${String(getPath(D(), path)) === String(v) ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select></label>`,
    tog: (label, path, desc = '') => `<label class="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3"><span><span class="block text-sm font-semibold">${label}</span>${desc ? '<span class="block text-[11px] text-slate-500">' + desc + '</span>' : ''}</span><span class="relative inline-flex h-6 w-11 shrink-0"><input type="checkbox" class="peer sr-only" data-b="${path}" ${getPath(D(), path) ? 'checked' : ''}><span class="absolute inset-0 rounded-full bg-slate-300 transition peer-checked:bg-sea-600"></span><span class="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5"></span></span></label>`,
    icon: (label, path) => `<div><span class="lbl">${label}</span><button type="button" data-act="pick-icon" data-path="${path}" class="flex h-[2.6rem] w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 text-sm transition hover:border-sea-500"><span class="flex h-7 w-7 items-center justify-center rounded-lg bg-sea-100 text-sea-600"><i class="fa-solid ${esc(getPath(D(), path) || 'fa-star')}"></i></span><span class="truncate text-slate-600">${esc((getPath(D(), path) || '').replace('fa-', ''))}</span><i class="fa-solid fa-chevron-down ml-auto text-[9px] text-slate-400"></i></button></div>`,
    img: (label, path, o = {}) => { const v = getPath(D(), path); return `<div class="${o.cls || ''}"><span class="lbl">${label}</span><div class="flex items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-3"><div class="flex ${o.round ? 'h-16 w-16 rounded-full' : 'h-16 w-24 rounded-lg'} shrink-0 items-center justify-center overflow-hidden bg-slate-200 text-slate-400">${v ? `<img src="${esc(v)}" alt="" class="h-full w-full object-cover object-top">` : '<i class="fa-regular fa-image text-xl"></i>'}</div><div class="min-w-0 flex-1"><p class="truncate text-xs text-slate-500">${v ? esc(v.startsWith('data:') ? 'Gambar unggahan' : v) : 'Belum ada gambar'}</p><div class="mt-2 flex flex-wrap gap-2"><button type="button" data-act="pick-image" data-path="${path}" class="btn btn-ghost !px-3 !py-1.5"><i class="fa-regular fa-images"></i>Pilih / unggah</button>${v ? `<button type="button" data-act="clear-image" data-path="${path}" class="btn btn-ghost !px-3 !py-1.5 text-red-500"><i class="fa-solid fa-xmark"></i></button>` : ''}</div></div></div></div>`; },
    chip: (text, tone = 'slate') => { const t = { green: 'bg-emerald-50 text-emerald-700', gold: 'bg-amber-50 text-amber-700', slate: 'bg-slate-100 text-slate-600', blue: 'bg-sea-100 text-sea-700', red: 'bg-red-50 text-red-600', navy: 'bg-navy-900 text-white' }[tone]; return `<span class="chip ${t}">${text}</span>`; },
    status: (s) => UI.chip({ published: '● Dipublikasikan', draft: '● Draft', scheduled: '● Terjadwal' }[s] || s, { published: 'green', draft: 'gold', scheduled: 'blue' }[s] || 'slate'),
    head: (title, sub, actions = '') => `<div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h1 class="text-2xl font-extrabold tracking-tight sm:text-[1.7rem]">${title}</h1>${sub ? '<p class="mt-1 max-w-2xl text-sm text-slate-500">' + sub + '</p>' : ''}</div><div class="flex flex-wrap items-center gap-2">${actions}<span id="saveState" class="hidden text-[11px] font-medium text-slate-500 sm:inline-flex sm:items-center sm:gap-1.5"></span></div></div>`,
    card: (title, body, o = {}) => `<section class="card ${o.cls || ''}">${title ? `<div class="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4"><h2 class="text-sm font-extrabold">${title}</h2>${o.right || ''}</div>` : ''}<div class="${o.flush ? '' : 'p-5'}">${body}</div></section>`,
    empty: (icon, title, text, action = '') => `<div class="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-14 text-center"><span class="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-sea-100 text-xl text-sea-600"><i class="fa-solid ${icon}"></i></span><p class="font-extrabold">${title}</p><p class="mt-1 max-w-sm text-sm text-slate-500">${text}</p>${action ? '<div class="mt-5">' + action + '</div>' : ''}</div>`,
    tabs: (items, cur) => `<div class="no-scrollbar -mx-1 mb-5 flex overflow-x-auto border-b border-slate-200">${items.map(([k, l, ic]) => `<button type="button" data-act="tab" data-tab="${k}" class="tab ${k === cur ? 'on' : ''}"><i class="fa-solid ${ic} mr-1.5 text-[11px]"></i>${l}</button>`).join('')}</div>`,
  };

  /* ---------------- pengikatan input -> draft ---------------- */
  document.addEventListener('input', (e) => {
    const el = e.target.closest('[data-b]'); if (!el) return;
    const v = el.type === 'checkbox' ? el.checked : el.type === 'number' ? +el.value : el.value;
    setPath(D(), el.dataset.b, v); touch();
  });

  /* ---------------- aksi (event delegation) ---------------- */
  const acts = {};
  document.addEventListener('click', (e) => { const el = e.target.closest('[data-act]'); if (!el) return; const fn = acts[el.dataset.act]; if (fn) { e.preventDefault(); fn(el, e); } });

  acts['pick-icon'] = (el) => {
    const path = el.dataset.path;
    openModal({ title: 'Pilih ikon', size: 'max-w-xl', body: `<div class="grid grid-cols-5 gap-2 sm:grid-cols-8">${ICONS.map((ic) => `<button type="button" data-ic="${ic}" title="${ic.slice(3)}" class="flex aspect-square items-center justify-center rounded-xl border border-slate-200 text-lg text-navy-800 transition hover:border-sea-500 hover:bg-sea-50 ${getPath(D(), path) === ic ? 'border-sea-500 bg-sea-50' : ''}"><i class="fa-solid ${ic}"></i></button>`).join('')}</div>`,
      onMount: (m) => $$('[data-ic]', m.el).forEach((b) => b.addEventListener('click', () => { setPath(D(), path, b.dataset.ic); touch(); m.close(); CMS.rerender(); })) });
  };
  acts['clear-image'] = (el) => { setPath(D(), el.dataset.path, ''); touch(); CMS.rerender(); };
  acts['pick-image'] = (el) => imagePicker((src) => { setPath(D(), el.dataset.path, src); touch(); CMS.rerender(); });

  function compress(file) {
    return new Promise((res, rej) => {
      if (!/^image\//.test(file.type)) return rej(new Error('Berkas harus berupa gambar.'));
      const fr = new FileReader();
      fr.onerror = () => rej(new Error('Gagal membaca berkas.'));
      fr.onload = () => { const im = new Image(); im.onerror = () => rej(new Error('Gambar tidak valid.')); im.onload = () => {
        const max = 1200, r = Math.min(1, max / Math.max(im.width, im.height)); const c = document.createElement('canvas'); c.width = Math.round(im.width * r); c.height = Math.round(im.height * r);
        c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); res(c.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.82)); }; im.src = fr.result; };
      fr.readAsDataURL(file);
    });
  }
  async function uploadFiles(files) {
    let ok = 0;
    for (const f of files) {
      try { const src = await compress(f); S.media.unshift({ id: uid(), name: f.name, src, size: Math.round(src.length * 0.75 / 1024) + ' KB', builtin: false }); ok++; }
      catch (err) { toast(err.message, 'error'); }
    }
    if (ok) { log('Media', ok + ' berkas diunggah'); persist(); toast(ok + ' gambar diunggah'); }
    return ok;
  }
  function imagePicker(onPick) {
    const render = () => `<div class="mb-4 flex flex-col gap-3 sm:flex-row"><label class="btn btn-sea cursor-pointer"><i class="fa-solid fa-upload"></i>Unggah gambar<input id="ipFile" type="file" accept="image/*" multiple class="hidden"></label><input id="ipQ" class="inp sm:max-w-xs" placeholder="Cari nama berkas…"></div>
      <div id="ipGrid" class="grid grid-cols-3 gap-3 sm:grid-cols-4"></div>`;
    openModal({ title: 'Media library', size: 'max-w-3xl', body: render(), onMount: (m) => {
      const draw = () => { const q = $('#ipQ', m.el).value.toLowerCase(); const list = S.media.filter((x) => x.name.toLowerCase().includes(q));
        $('#ipGrid', m.el).innerHTML = list.length ? list.map((x) => `<button type="button" data-id="${x.id}" class="group relative aspect-square overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200 transition hover:ring-2 hover:ring-sea-500"><img src="${esc(x.src)}" alt="" class="h-full w-full object-cover" loading="lazy"><span class="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-navy-950/80 to-transparent px-2 pb-1.5 pt-5 text-left text-[10px] font-semibold text-white">${esc(x.name)}</span></button>`).join('') : '<p class="col-span-full py-10 text-center text-sm text-slate-500">Tidak ada gambar.</p>';
        $$('#ipGrid button', m.el).forEach((b) => b.addEventListener('click', () => { const it = S.media.find((x) => x.id === b.dataset.id); m.close(); onPick(it.src); })); };
      $('#ipQ', m.el).addEventListener('input', draw); $('#ipFile', m.el).addEventListener('change', async (e) => { await uploadFiles(e.target.files); draw(); });
      draw(); } });
  }

  /* ---------------- router & shell ---------------- */
  const routes = {}; const PERMS = { 'Super Admin': '*', Editor: ['dashboard', 'halaman', 'hero', 'program', 'tentang', 'alumni', 'mitra', 'team', 'berita', 'navigasi', 'media'], Admisi: ['dashboard', 'pendaftar'], Penulis: ['dashboard', 'berita', 'media'] };
  const can = (key) => { const p = PERMS[S.role]; return p === '*' || (p && p.includes(key)); };
  const NAV = [
    ['Utama', ['dashboard']], ['Konten Website', ['halaman', 'hero', 'program', 'tentang', 'alumni', 'mitra', 'team', 'berita', 'navigasi']],
    ['Aset & Admisi', ['media', 'pendaftar']], ['Sistem', ['pengaturan', 'pengguna', 'log']],
  ];
  function register(key, def) { routes[key] = def; }
  function buildNav() {
    $('#nav').innerHTML = NAV.map(([g, keys]) => { const items = keys.filter((k) => routes[k] && can(k)); if (!items.length) return ''; return `<div><p class="mb-2 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-white/40">${g}</p><div class="space-y-0.5">${items.map((k) => `<a href="#/${k}" data-nav="${k}" class="nav-item"><i class="fa-solid ${routes[k].icon} w-4 text-center text-[13px]"></i><span class="flex-1">${routes[k].title}</span>${k === 'pendaftar' ? '<span data-badge="pendaftar" class="rounded-full bg-gold-500 px-1.5 text-[10px] font-bold text-navy-950"></span>' : ''}</a>`).join('')}</div></div>`; }).join('');
    updateBadges();
  }
  let current = 'dashboard';
  function render() {
    let hash = location.hash.replace(/^#\//, '') || 'dashboard'; const [key, ...rest] = hash.split('/'); const arg = rest.join('/');
    const r = routes[key] || routes.dashboard; const rk = routes[key] ? key : 'dashboard';
    if (!can(rk)) { $('#view').innerHTML = UI.empty('fa-lock', 'Akses dibatasi', 'Peran "' + esc(S.role) + '" tidak memiliki akses ke halaman ini.', '<a class="btn btn-primary" href="#/dashboard">Kembali ke dashboard</a>'); return; }
    current = rk; CMS.live = null; CMS.arg = arg;
    const v = $('#view'); v.innerHTML = '<div class="view-in">' + r.render(arg) + '</div>';
    if (r.mount) r.mount(v, arg);
    $$('[data-nav]').forEach((a) => a.classList.toggle('on', a.dataset.nav === rk));
    document.title = r.title + ' · Seabar CMS'; window.scrollTo({ top: 0 }); closeSidebar(); updateBadges();
  }
  const openSidebar = () => { $('#sidebar').classList.remove('-translate-x-full'); $('#scrim').classList.remove('hidden'); };
  function closeSidebar() { $('#sidebar').classList.add('-translate-x-full'); $('#scrim').classList.add('hidden'); }

  const CMS = { get S() { return S; }, set S(v) { S = v; }, D, $, $$, esc, uid, clone, getPath, setPath, fmtDate, fmtTime, slugify, ICONS, UI, acts, toast, openModal, confirmBox, imagePicker, uploadFiles,
    persist, touch, pending, LABELS, log, register, routes, can, PERMS, buildNav, render, rerender: () => { const y = window.scrollY; render(); window.scrollTo({ top: y }); }, seed, KEY, openSidebar, closeSidebar, updateBadges, go: (h) => { location.hash = '#/' + h; } };
  window.CMS = CMS;
  window.addEventListener('hashchange', () => { if (S.session) render(); });
  $('#sbOpen').addEventListener('click', openSidebar); $('#sbClose').addEventListener('click', closeSidebar); $('#scrim').addEventListener('click', closeSidebar);
})();
