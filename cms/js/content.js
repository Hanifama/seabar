/* Seabar CMS – modul konten: urutan section, hero, program, tentang, alumni, mitra, team, berita, navigasi */
(() => {
  'use strict';
  const { $, $$, esc, uid, clone, getPath, setPath, UI, acts, toast, openModal, confirmBox, register, touch, log, slugify, fmtDate } = CMS;
  const D = CMS.D;

  /* preview langsung: elemen [data-pv="path"] ikut berubah saat mengetik */
  const livePreview = () => {
    CMS.live = () => {
      $$('[data-pv]').forEach((el) => { const v = getPath(D(), el.dataset.pv); if (el.tagName === 'IMG') el.src = v || ''; else el.textContent = v ?? ''; });
      $$('[data-pvshow]').forEach((el) => el.classList.toggle('hidden', !getPath(D(), el.dataset.pvshow)));
    };
    CMS.live();
  };
  const initials = (n) => n.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  const move = (arr, i, d) => { const j = i + d; if (j < 0 || j >= arr.length) return false; [arr[i], arr[j]] = [arr[j], arr[i]]; return true; };
  const isOn = (it) => (it.status !== undefined ? it.status === 'published' : !!it.active);

  /* =========================================================== URUTAN SECTION */
  register('halaman', {
    title: 'Halaman & Urutan', icon: 'fa-table-columns',
    render() {
      const secs = D().sections;
      return UI.head('Halaman & Urutan Section', 'Atur section apa saja yang tampil di landing page dan urutannya. Tarik baris atau gunakan tombol panah.') +
        `<div class="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_20rem]">
          <div id="secList" class="min-w-0 space-y-3">${secs.map((s, i) => `
            <div draggable="true" data-i="${i}" class="card flex flex-wrap items-center gap-3 p-3 pr-4 transition sm:flex-nowrap ${s.visible ? '' : 'opacity-60'}">
              <span class="cursor-grab px-1 text-slate-300 hover:text-slate-500" title="Tarik untuk mengurutkan"><i class="fa-solid fa-grip-vertical"></i></span>
              <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${s.visible ? 'bg-sea-100 text-sea-600' : 'bg-slate-100 text-slate-400'}"><i class="fa-solid ${s.icon}"></i></span>
              <div class="min-w-0 flex-1"><p class="truncate text-sm font-bold">${i + 1}. ${esc(s.label)}</p><p class="truncate text-xs text-slate-500">${esc(s.desc)}</p></div>
              <div class="ml-auto flex items-center gap-1.5">
                <button class="btn-icon" data-act="sec-move" data-i="${i}" data-d="-1" ${i === 0 ? 'disabled' : ''} title="Naikkan"><i class="fa-solid fa-arrow-up"></i></button>
                <button class="btn-icon" data-act="sec-move" data-i="${i}" data-d="1" ${i === secs.length - 1 ? 'disabled' : ''} title="Turunkan"><i class="fa-solid fa-arrow-down"></i></button>
                <button class="btn-icon ${s.visible ? '!text-sea-600' : ''}" data-act="sec-vis" data-i="${i}" title="${s.visible ? 'Sembunyikan' : 'Tampilkan'}"><i class="fa-solid ${s.visible ? 'fa-eye' : 'fa-eye-slash'}"></i></button>
                <a class="btn btn-ghost !px-3 max-sm:hidden" href="#/${s.route}"><i class="fa-solid fa-pen text-[10px]"></i>Edit</a>
              </div>
            </div>`).join('')}</div>
          <aside class="card h-fit p-5 lg:sticky lg:top-24"><p class="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Peta halaman</p>
            <div class="space-y-1.5 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100"><div class="h-5 rounded bg-white ring-1 ring-slate-200 text-center text-[9px] leading-5 text-slate-400">Navbar</div>
              ${secs.map((s) => `<div class="flex items-center gap-2 rounded-md px-2 py-2 text-[10px] font-semibold ${s.visible ? 'bg-sea-100 text-sea-700' : 'bg-slate-200/60 text-slate-400 line-through'}"><i class="fa-solid ${s.icon} w-3 text-center"></i>${esc(s.label)}</div>`).join('')}
              <div class="h-6 rounded bg-navy-900 text-center text-[9px] leading-6 text-white/70">Footer</div></div>
            <p class="mt-3 text-[11px] leading-relaxed text-slate-500">Perubahan urutan ikut dalam draft dan baru tampil di website setelah <b>Publikasikan</b>.</p></aside>
        </div>`;
    },
    mount(v) {
      const list = $('#secList', v); let from = null;
      $$('[draggable]', list).forEach((row) => {
        row.addEventListener('dragstart', (e) => { from = +row.dataset.i; e.dataTransfer.effectAllowed = 'move'; row.classList.add('opacity-50'); });
        row.addEventListener('dragend', () => row.classList.remove('opacity-50'));
        row.addEventListener('dragover', (e) => { e.preventDefault(); row.setAttribute('data-sortable-over', ''); });
        row.addEventListener('dragleave', () => row.removeAttribute('data-sortable-over'));
        row.addEventListener('drop', (e) => { e.preventDefault(); const to = +row.dataset.i; if (from === null || from === to) return; const [it] = D().sections.splice(from, 1); D().sections.splice(to, 0, it); touch(); log('Urutan', 'Mengubah urutan section'); CMS.rerender(); });
      });
    },
  });
  acts['sec-move'] = (el) => { if (move(D().sections, +el.dataset.i, +el.dataset.d)) { touch(); CMS.rerender(); } };
  acts['sec-vis'] = (el) => { const s = D().sections[+el.dataset.i]; s.visible = !s.visible; touch(); log('Section', (s.visible ? 'Menampilkan ' : 'Menyembunyikan ') + s.label); CMS.rerender(); };

  /* =========================================================== HERO */
  const itemsEditor = (arrPath, label) => {
    const arr = getPath(D(), arrPath);
    return `<div class="space-y-3">${arr.map((it, i) => `<div class="rounded-xl border border-slate-200 bg-slate-50/50 p-3"><div class="mb-2 flex items-center justify-between"><span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">${label} ${i + 1}</span></div>
      <div class="grid gap-3 sm:grid-cols-[9rem_1fr]">${UI.icon('Ikon', arrPath + '.' + i + '.icon')}${UI.inp('Judul', arrPath + '.' + i + '.title')}</div><div class="mt-3">${UI.inp('Deskripsi', arrPath + '.' + i + '.desc')}</div></div>`).join('')}</div>`;
  };
  register('hero', {
    title: 'Hero & Keunggulan', icon: 'fa-flag',
    render() {
      return UI.head('Hero & Keunggulan', 'Bagian pertama yang dilihat pengunjung. Preview di kanan ikut berubah saat Anda mengetik.', '<a href="#/halaman" class="btn btn-ghost"><i class="fa-solid fa-table-columns"></i>Urutan section</a>') +
        `<div class="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_26rem]">
          <div class="space-y-6">
            ${UI.card('Teks utama', `<div class="grid gap-4">${UI.inp('Label kecil (eyebrow)', 'hero.eyebrow')}
              <div class="grid gap-4 sm:grid-cols-3">${UI.inp('Judul baris 1', 'hero.title1')}${UI.inp('Judul baris 2', 'hero.title2')}${UI.inp('Judul baris 3 (warna aksen)', 'hero.title3')}</div>
              ${UI.area('Sub-judul', 'hero.subtitle', 3)}</div>`)}
            ${UI.card('Tombol ajakan (CTA)', `<div class="grid gap-4 sm:grid-cols-2">${UI.inp('Tombol utama – teks', 'hero.cta1Text')}${UI.inp('Tombol utama – tautan', 'hero.cta1Link', { ph: '#daftar atau https://…' })}${UI.inp('Tombol kedua – teks', 'hero.cta2Text')}${UI.inp('Tombol kedua – tautan', 'hero.cta2Link')}</div>`)}
            ${UI.card('Tulisan tangan (tagline)', `<div class="grid gap-4">${UI.tog('Tampilkan tagline di hero', 'hero.showScript', 'Tulisan miring di kanan atas')}${UI.inp('Teks tagline', 'hero.script')}</div>`)}
            ${UI.card('5 keunggulan di bawah hero', itemsEditor('strip', 'Keunggulan'))}
          </div>
          <aside class="xl:sticky xl:top-24 xl:self-start">${UI.card('Pratinjau', `
            <div class="overflow-hidden rounded-2xl bg-gradient-to-b from-[#cfe6f6] via-[#e7f2fa] to-[#fdfaf3] ring-1 ring-slate-200">
              <div class="relative px-5 pb-24 pt-8"><div class="absolute right-6 top-4 h-24 w-24 rounded-full bg-[radial-gradient(circle,#fff6d8,#fde7a8_40%,transparent_70%)]"></div>
                <p class="relative mb-2 flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-gold-500"><span class="h-0.5 w-5 bg-gold-500"></span><span data-pv="hero.eyebrow"></span></p>
                <h3 class="relative text-[1.45rem] font-extrabold leading-tight text-navy-900"><span data-pv="hero.title1"></span><br><span data-pv="hero.title2"></span><br><span class="text-sea-600" data-pv="hero.title3"></span></h3>
                <p class="relative mt-3 max-w-[16rem] text-[10px] leading-relaxed text-slate-600" data-pv="hero.subtitle"></p>
                <div class="relative mt-4 flex gap-2"><span class="rounded-full bg-navy-900 px-3.5 py-2 text-[9px] font-semibold text-white" data-pv="hero.cta1Text"></span><span class="rounded-full border border-navy-900 px-3.5 py-2 text-[9px] font-semibold text-navy-900" data-pv="hero.cta2Text"></span></div>
                <p data-pvshow="hero.showScript" class="absolute right-4 top-3 -rotate-6 text-xs text-navy-800" style="font-family:cursive" data-pv="hero.script"></p>
                <img src="../assets/cruise-ship.png" alt="" class="absolute -bottom-1 right-2 w-3/5"></div>
              <div class="relative -mb-px h-8 bg-[#2f8fbd]"><div class="absolute -top-3 h-4 w-full rounded-t-[50%] bg-[#2f8fbd]"></div></div></div>
            <p class="mt-3 text-[11px] text-slate-400">Pratinjau disederhanakan; tampilan final mengikuti landing page.</p>`)}</aside>
        </div>`;
    },
    mount() { livePreview(); },
  });

  /* =========================================================== PROGRAM */
  let progTab = 'umum', progQ = '';
  const progIdx = (id) => D().programs.findIndex((p) => p.id === id);
  register('program', {
    title: 'Program', icon: 'fa-graduation-cap',
    render(arg) {
      if (arg) return programEditor(arg);
      const list = D().programs.filter((p) => (p.name + p.slug).toLowerCase().includes(progQ.toLowerCase()));
      return UI.head('Program Pelatihan', 'Kelola kartu program di landing page sekaligus halaman detail tiap program.', '<button class="btn btn-primary" data-act="prog-new"><i class="fa-solid fa-plus"></i>Program baru</button>') +
        UI.card('Judul section di landing page', `<div class="grid gap-4 sm:grid-cols-2">${UI.inp('Label kecil', 'programsSection.eyebrow')}${UI.inp('Teks tombol', 'programsSection.buttonText')}${UI.inp('Judul', 'programsSection.title', { cls: 'sm:col-span-2' })}${UI.area('Deskripsi', 'programsSection.text', 2, { cls: 'sm:col-span-2' })}</div>`, { cls: 'mb-6' }) +
        `<div class="mb-4"><div class="relative max-w-sm"><i class="fa-solid fa-magnifying-glass pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400"></i><input id="progQ" class="inp pl-9" placeholder="Cari program…" value="${esc(progQ)}"></div></div>` +
        (list.length ? `<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">${list.map((p) => { const i = progIdx(p.id); return `
          <article class="card group flex flex-col p-5">
            <div class="flex items-start gap-4"><span class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sea-100 text-xl text-sea-600"><i class="fa-solid ${esc(p.icon)}"></i></span>
              <div class="min-w-0 flex-1"><h3 class="truncate font-extrabold">${esc(p.name)}</h3><p class="truncate text-xs text-slate-500">/program-${esc(p.slug)}.html</p><div class="mt-2 flex flex-wrap gap-1.5">${UI.status(p.status)}${UI.chip('<i class="fa-regular fa-clock text-[10px]"></i>' + esc(p.duration), 'slate')}</div></div></div>
            <p class="mt-4 line-clamp-2 text-xs leading-relaxed text-slate-500">${esc(p.subtitle)}</p>
            <p class="mt-3 text-[11px] text-slate-400">${p.curriculum.length} materi kurikulum</p>
            <div class="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4">
              <a href="#/program/${p.id}" class="btn btn-primary flex-1"><i class="fa-solid fa-pen text-[10px]"></i>Edit</a>
              <button class="btn-icon" data-act="prog-toggle" data-id="${p.id}" title="${p.status === 'published' ? 'Jadikan draft' : 'Publikasikan'}"><i class="fa-solid ${p.status === 'published' ? 'fa-eye' : 'fa-eye-slash'}"></i></button>
              <button class="btn-icon" data-act="prog-move" data-id="${p.id}" data-d="-1" ${i === 0 ? 'disabled' : ''} title="Naikkan"><i class="fa-solid fa-arrow-up"></i></button>
              <button class="btn-icon" data-act="prog-move" data-id="${p.id}" data-d="1" ${i === D().programs.length - 1 ? 'disabled' : ''} title="Turunkan"><i class="fa-solid fa-arrow-down"></i></button>
              <button class="btn-icon hover:!border-red-300 hover:!text-red-500" data-act="prog-del" data-id="${p.id}" title="Hapus"><i class="fa-regular fa-trash-can"></i></button>
            </div></article>`; }).join('')}</div>` : UI.empty('fa-graduation-cap', 'Program tidak ditemukan', 'Coba kata kunci lain atau tambahkan program baru.'));
    },
    mount(v, arg) { if (arg) { livePreview(); return; } const q = $('#progQ', v); if (q) q.addEventListener('input', () => { progQ = q.value; const pos = q.selectionStart; CMS.rerender(); const n = $('#progQ'); n.focus(); n.setSelectionRange(pos, pos); }); },
  });
  function programEditor(id) {
    const i = progIdx(id); if (i < 0) return UI.empty('fa-circle-question', 'Program tidak ditemukan', 'Program mungkin sudah dihapus.', '<a class="btn btn-primary" href="#/program">Kembali</a>');
    const b = 'programs.' + i + '.', p = D().programs[i];
    const tabs = [['umum', 'Umum', 'fa-circle-info'], ['kurikulum', 'Kurikulum', 'fa-list-check'], ['fasilitas', 'Fasilitas', 'fa-building'], ['seo', 'SEO & Status', 'fa-magnifying-glass-chart']];
    let body = '';
    if (progTab === 'umum') body = UI.card('Informasi program', `<div class="grid gap-4 sm:grid-cols-2">${UI.inp('Nama program', b + 'name')}${UI.inp('Slug URL', b + 'slug', { help: 'Halaman: program-<b>slug</b>.html' })}${UI.icon('Ikon', b + 'icon')}${UI.inp('Durasi', b + 'duration', { ph: 'mis. 6 Bulan' })}${UI.inp('Sertifikat', b + 'certificate')}${UI.inp('Peluang kerja', b + 'job')}${UI.area('Sub-judul (hero halaman program)', b + 'subtitle', 2, { cls: 'sm:col-span-2' })}${UI.area('Tentang program', b + 'about', 5, { cls: 'sm:col-span-2' })}</div>`);
    if (progTab === 'kurikulum') body = UI.card('Materi kurikulum', `<div class="space-y-2.5">${p.curriculum.map((c, j) => `<div class="flex items-center gap-2"><span class="flex h-9 w-7 shrink-0 items-center justify-center text-xs font-bold text-slate-300">${j + 1}</span><input class="inp" data-b="${b}curriculum.${j}" value="${esc(c)}"><button class="btn-icon shrink-0" data-act="cur-move" data-i="${i}" data-j="${j}" data-d="-1" ${j === 0 ? 'disabled' : ''}><i class="fa-solid fa-arrow-up"></i></button><button class="btn-icon shrink-0" data-act="cur-move" data-i="${i}" data-j="${j}" data-d="1" ${j === p.curriculum.length - 1 ? 'disabled' : ''}><i class="fa-solid fa-arrow-down"></i></button><button class="btn-icon shrink-0 hover:!text-red-500" data-act="cur-del" data-i="${i}" data-j="${j}"><i class="fa-regular fa-trash-can"></i></button></div>`).join('')}</div>
      <button class="btn btn-ghost mt-4" data-act="cur-add" data-i="${i}"><i class="fa-solid fa-plus"></i>Tambah materi</button>`, { right: UI.chip(p.curriculum.length + ' materi', 'blue') });
    if (progTab === 'fasilitas') body = UI.card('Fasilitas pendukung', `<p class="mb-4 text-xs text-slate-500">Dua fasilitas khas program ini. Dua fasilitas lain (Simulasi Kapal Pesiar &amp; Ruang Kelas Modern) bersifat umum.</p><div class="grid gap-4 sm:grid-cols-2">${[1, 2].map((n) => `<div class="rounded-xl border border-slate-200 bg-slate-50/50 p-4"><p class="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">Fasilitas ${n}</p><div class="space-y-3">${UI.inp('Nama', b + 'fac' + n + '.name')}${UI.icon('Ikon', b + 'fac' + n + '.icon')}</div></div>`).join('')}</div>`);
    if (progTab === 'seo') body = `<div class="space-y-6">${UI.card('Status publikasi', `<div class="grid gap-4 sm:grid-cols-2">${UI.sel('Status', b + 'status', [['published', 'Dipublikasikan'], ['draft', 'Draft (disembunyikan)']])}</div>`)}${UI.card('SEO', `<div class="grid gap-4">${UI.inp('Judul halaman (title)', b + 'seoTitle')}${UI.area('Meta description', b + 'seoDesc', 3)}<div class="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100"><p class="text-[11px] font-semibold text-slate-400">Pratinjau Google</p><p class="mt-1 truncate text-sm font-semibold text-[#1a0dab]" data-pv="programs.${i}.seoTitle"></p><p class="text-xs text-emerald-700">seabarcollege.com › program-${esc(p.slug)}</p><p class="mt-0.5 line-clamp-2 text-xs text-slate-600" data-pv="programs.${i}.seoDesc"></p></div></div>`)}</div>`;
    return UI.head(esc(p.name), '<a href="#/program" class="font-semibold text-sea-600 hover:underline"><i class="fa-solid fa-arrow-left mr-1 text-[10px]"></i>Semua program</a> · ' + UI.status(p.status), `<a class="btn btn-ghost" target="_blank" rel="noopener" href="../program-${esc(p.slug)}.html"><i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>Buka halaman</a>`) +
      `<div class="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_22rem]"><div>${UI.tabs(tabs, progTab)}${body}</div>
        <aside class="xl:sticky xl:top-24 xl:self-start">${UI.card('Pratinjau hero halaman', `<div class="overflow-hidden rounded-2xl bg-gradient-to-r from-[#e6f0fa] to-[#dbe9f6] p-5 ring-1 ring-slate-200"><p class="text-[9px] font-medium text-slate-500">Program › <span data-pv="programs.${i}.name"></span></p><h3 class="mt-2 text-2xl font-extrabold text-navy-900" data-pv="programs.${i}.name"></h3><p class="mt-2 text-[10px] leading-relaxed text-slate-600" data-pv="programs.${i}.subtitle"></p>
          <div class="mt-4 flex gap-4 text-[9px]"><div><b class="block text-navy-900">Durasi</b><span data-pv="programs.${i}.duration" class="text-slate-500"></span></div><div><b class="block text-navy-900">Sertifikat</b><span data-pv="programs.${i}.certificate" class="text-slate-500"></span></div><div><b class="block text-navy-900">Peluang Kerja</b><span data-pv="programs.${i}.job" class="text-slate-500"></span></div></div></div>`)}</aside></div>`;
  }
  acts.tab = (el) => { progTab = el.dataset.tab; CMS.rerender(); };
  acts['prog-new'] = () => openModal({ title: 'Program baru', size: 'max-w-md', body: `<div class="space-y-4"><label class="block"><span class="lbl">Nama program</span><input id="npName" class="inp" placeholder="mis. Front Office"></label><p class="text-xs text-slate-500">Program baru dibuat sebagai <b>draft</b> dengan template kurikulum kosong.</p></div>`,
    actions: [{ label: 'Batal' }, { label: 'Buat program', cls: 'btn-primary', onClick: (m) => { const name = $('#npName', m.el).value.trim(); if (!name) { toast('Nama program wajib diisi', 'error'); return false; }
      const p = { id: uid(), name, slug: slugify(name), icon: 'fa-star', subtitle: 'Pelatihan profesional di bidang ' + name + '.', duration: 'Sesuai Jadwal', certificate: 'Internasional', job: 'Global', about: '', curriculum: ['Materi 1', 'Materi 2'], fac1: { name: 'Fasilitas 1', icon: 'fa-building' }, fac2: { name: 'Fasilitas 2', icon: 'fa-utensils' }, status: 'draft', seoTitle: name + ' – Program Pelatihan Seabar College', seoDesc: '' };
      D().programs.push(p); touch(); log('Program', 'Membuat program ' + name); CMS.go('program/' + p.id); } }] });
  acts['prog-toggle'] = (el) => { const p = D().programs[progIdx(el.dataset.id)]; p.status = p.status === 'published' ? 'draft' : 'published'; touch(); log('Program', p.name + ' → ' + p.status); CMS.rerender(); };
  acts['prog-move'] = (el) => { if (move(D().programs, progIdx(el.dataset.id), +el.dataset.d)) { touch(); CMS.rerender(); } };
  acts['prog-del'] = (el) => { const p = D().programs[progIdx(el.dataset.id)]; confirmBox('Hapus program?', 'Program <b>' + esc(p.name) + '</b> akan dihapus dari draft. Tindakan ini bisa dibatalkan dengan “Batalkan perubahan” sebelum dipublikasikan.', () => { D().programs.splice(progIdx(p.id), 1); touch(); log('Program', 'Menghapus ' + p.name); toast('Program dihapus'); CMS.rerender(); }); };
  acts['cur-add'] = (el) => { D().programs[+el.dataset.i].curriculum.push('Materi baru'); touch(); CMS.rerender(); };
  acts['cur-del'] = (el) => { D().programs[+el.dataset.i].curriculum.splice(+el.dataset.j, 1); touch(); CMS.rerender(); };
  acts['cur-move'] = (el) => { if (move(D().programs[+el.dataset.i].curriculum, +el.dataset.j, +el.dataset.d)) { touch(); CMS.rerender(); } };

  /* =========================================================== TENTANG & BAND & CTA */
  let aboutTab = 'tentang';
  register('tentang', {
    title: 'Tentang & Band', icon: 'fa-circle-info',
    render() {
      const tabs = [['tentang', 'Tentang', 'fa-circle-info'], ['band', 'Band statistik', 'fa-chart-simple'], ['cta', 'Ajakan (CTA)', 'fa-bullhorn']];
      let body = '';
      if (aboutTab === 'tentang') body = `<div class="space-y-6">${UI.card('Teks', `<div class="grid gap-4 sm:grid-cols-2">${UI.inp('Label kecil', 'about.eyebrow')}${UI.inp('Teks tombol', 'about.buttonText')}${UI.inp('Judul', 'about.title', { cls: 'sm:col-span-2' })}${UI.area('Deskripsi', 'about.text', 4, { cls: 'sm:col-span-2' })}${UI.inp('Tautan tombol', 'about.buttonLink')}${UI.inp('URL video profil', 'about.videoUrl', { ph: 'https://youtube.com/…', help: 'Dibuka saat tombol play ditekan' })}</div>`)}${UI.card('Foto section', UI.img('Foto (kosongkan untuk ilustrasi matahari terbenam)', 'about.photo'))}${UI.card('3 poin keunggulan', itemsEditor('about.features', 'Poin'))}</div>`;
      if (aboutTab === 'band') body = `<div class="space-y-6">${UI.card('Kalimat band', `<div class="grid gap-4 sm:grid-cols-2">${UI.inp('Baris 1 (emas)', 'band.line1')}${UI.inp('Baris 2', 'band.line2')}</div>`)}${UI.card('3 statistik', itemsEditor('band.stats', 'Statistik') + '<p class="mt-3 text-[11px] text-amber-600"><i class="fa-solid fa-triangle-exclamation mr-1"></i>Pastikan angka dan klaim (mis. “Ratusan”) sesuai data lembaga yang dapat dibuktikan.</p>')}</div>`;
      if (aboutTab === 'cta') body = UI.card('Banner ajakan mendaftar', `<div class="grid gap-4 sm:grid-cols-2">${UI.inp('Judul', 'cta.title', { cls: 'sm:col-span-2' })}${UI.area('Teks', 'cta.text', 2, { cls: 'sm:col-span-2' })}${UI.inp('Teks tombol', 'cta.buttonText')}${UI.inp('Tautan tombol', 'cta.buttonLink', { ph: 'https://wa.me/62…' })}</div>`);
      return UI.head('Tentang, Band & CTA', 'Profil singkat lembaga, band statistik biru, dan banner ajakan mendaftar.') + UI.tabs(tabs, aboutTab) + body;
    },
  });
  const baseTab = acts.tab;
  acts.tab = (el) => { if (CMS.routes.tentang && location.hash.includes('/tentang')) { aboutTab = el.dataset.tab; CMS.rerender(); } else if (location.hash.includes('/pengaturan')) { CMS.settingsTab(el.dataset.tab); } else baseTab(el); };

  /* =========================================================== CRUD generik */
  function crud(c) {
    let q = '', filt = 'all';
    const arr = () => D()[c.key];
    const matches = (it) => (c.search(it) + '').toLowerCase().includes(q.toLowerCase()) && (filt === 'all' || (filt === 'published') === isOn(it));
    register(c.route, {
      title: c.title, icon: c.icon,
      render() {
        const rows = arr().map((it, i) => [it, i]).filter(([it]) => matches(it));
        const head = UI.head(c.title, c.sub, `<button class="btn btn-primary" data-act="crud" data-r="${c.route}" data-op="new"><i class="fa-solid fa-plus"></i>${c.addLabel}</button>`);
        const meta = c.meta ? UI.card('Judul section di landing page', `<div class="grid gap-4 sm:grid-cols-2">${c.meta.map(([l, p, t, full]) => (t === 'area' ? UI.area(l, p, 2, { cls: full ? 'sm:col-span-2' : '' }) : UI.inp(l, p, { cls: full ? 'sm:col-span-2' : '' }))).join('')}</div>`, { cls: 'mb-6' }) : '';
        const bar = `<div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div class="relative sm:w-80"><i class="fa-solid fa-magnifying-glass pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400"></i><input id="cq-${c.route}" class="inp pl-9" placeholder="Cari…" value="${esc(q)}"></div>
          <div class="flex gap-1 rounded-xl bg-white p-1 ring-1 ring-slate-200">${[['all', 'Semua'], ['published', 'Tayang'], ['draft', 'Draft/Nonaktif']].map(([k, l]) => `<button data-act="crud-f" data-r="${c.route}" data-f="${k}" class="rounded-lg px-3 py-1.5 text-xs font-semibold ${filt === k ? 'bg-navy-900 text-white' : 'text-slate-500 hover:text-navy-900'}">${l}</button>`).join('')}</div></div>`;
        const list = rows.length ? `<div class="${c.layout === 'list' ? 'space-y-3' : 'grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'}">${rows.map(([it, i]) => c.card(it, i, `<div class="flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-3">
            <button class="btn btn-ghost !px-3 !py-1.5" data-act="crud" data-r="${c.route}" data-op="edit" data-id="${it.id}"><i class="fa-solid fa-pen text-[10px]"></i>Edit</button>
            <button class="btn-icon !h-8 !w-8" data-act="crud" data-r="${c.route}" data-op="toggle" data-id="${it.id}" title="${isOn(it) ? 'Nonaktifkan' : 'Tayangkan'}"><i class="fa-solid ${isOn(it) ? 'fa-eye' : 'fa-eye-slash'}"></i></button>
            <button class="btn-icon !h-8 !w-8" data-act="crud" data-r="${c.route}" data-op="up" data-id="${it.id}" title="Naikkan"><i class="fa-solid fa-arrow-up"></i></button>
            <button class="btn-icon !h-8 !w-8" data-act="crud" data-r="${c.route}" data-op="down" data-id="${it.id}" title="Turunkan"><i class="fa-solid fa-arrow-down"></i></button>
            <button class="btn-icon !h-8 !w-8" data-act="crud" data-r="${c.route}" data-op="dup" data-id="${it.id}" title="Duplikat"><i class="fa-regular fa-copy"></i></button>
            <button class="btn-icon !h-8 !w-8 ml-auto hover:!border-red-300 hover:!text-red-500" data-act="crud" data-r="${c.route}" data-op="del" data-id="${it.id}" title="Hapus"><i class="fa-regular fa-trash-can"></i></button></div>`)).join('')}</div>` : UI.empty(c.icon, 'Belum ada data', c.emptyText || 'Tambahkan data pertama Anda.', `<button class="btn btn-primary" data-act="crud" data-r="${c.route}" data-op="new"><i class="fa-solid fa-plus"></i>${c.addLabel}</button>`);
        return head + meta + bar + list + (c.footer || '');
      },
      mount(v) {
        const inp = $('#cq-' + c.route, v);
        if (inp) inp.addEventListener('input', () => { q = inp.value; const pos = inp.selectionStart; CMS.rerender(); const n = $('#cq-' + c.route); n.focus(); n.setSelectionRange(pos, pos); });
      },
    });
    c._setF = (f) => { filt = f; };
    CRUDS[c.route] = c;
  }
  const CRUDS = {};
  acts['crud-f'] = (el) => { CRUDS[el.dataset.r]._setF(el.dataset.f); CMS.rerender(); };
  acts.crud = (el) => {
    const c = CRUDS[el.dataset.r], arr = D()[c.key], id = el.dataset.id, idx = arr.findIndex((x) => x.id === id), op = el.dataset.op;
    if (op === 'new') return form(c, null);
    if (op === 'edit') return form(c, arr[idx]);
    if (op === 'toggle') { const it = arr[idx]; if (it.status !== undefined) it.status = it.status === 'published' ? 'draft' : 'published'; else it.active = !it.active; touch(); log(c.singular, (it[c.nameKey] || '') + (isOn(it) ? ' ditayangkan' : ' dinonaktifkan')); return CMS.rerender(); }
    if (op === 'up' || op === 'down') { if (move(arr, idx, op === 'up' ? -1 : 1)) { touch(); CMS.rerender(); } return; }
    if (op === 'dup') { const cp = clone(arr[idx]); cp.id = uid(); cp[c.nameKey] += ' (salinan)'; if (cp.status !== undefined) cp.status = 'draft'; if (cp.slug) cp.slug += '-salinan'; arr.splice(idx + 1, 0, cp); touch(); log(c.singular, 'Menduplikat ' + arr[idx][c.nameKey]); toast('Berhasil diduplikat'); return CMS.rerender(); }
    if (op === 'del') { const it = arr[idx]; return confirmBox('Hapus ' + c.singular.toLowerCase() + '?', '<b>' + esc(it[c.nameKey]) + '</b> akan dihapus dari draft. Anda masih bisa membatalkan lewat “Batalkan perubahan” sebelum publikasi.', () => { arr.splice(idx, 1); touch(); log(c.singular, 'Menghapus ' + it[c.nameKey]); toast('Dihapus'); CMS.rerender(); }); }
  };
  function fieldHtml(f, v) {
    const val = v ?? (f.def ?? '');
    if (f.type === 'textarea') return `<label class="block ${f.full ? 'sm:col-span-2' : ''}"><span class="lbl">${f.label}${f.req ? ' *' : ''}</span><textarea class="inp" rows="${f.rows || 3}" data-f="${f.name}">${esc(val)}</textarea></label>`;
    if (f.type === 'select') return `<label class="block ${f.full ? 'sm:col-span-2' : ''}"><span class="lbl">${f.label}</span><select class="inp" data-f="${f.name}">${f.options.map(([k, l]) => `<option value="${esc(k)}" ${String(val) === String(k) ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select></label>`;
    if (f.type === 'bool') return `<label class="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 ${f.full ? 'sm:col-span-2' : ''}"><input type="checkbox" class="h-4 w-4 accent-[#0b2545]" data-f="${f.name}" ${val ? 'checked' : ''}><span class="text-sm font-semibold">${f.label}</span></label>`;
    if (f.type === 'image') return `<div class="sm:col-span-2" data-imgf="${f.name}"><span class="lbl">${f.label}</span><input type="hidden" data-f="${f.name}" value="${esc(val)}"><div class="flex items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-3"><div class="flex ${f.round ? 'h-16 w-16 rounded-full' : f.portrait ? 'h-24 w-14 rounded-lg' : 'h-16 w-24 rounded-lg'} shrink-0 items-center justify-center overflow-hidden bg-slate-200 text-slate-400" data-prev>${val ? `<img src="${esc(val)}" alt="" class="h-full w-full object-cover object-top">` : '<i class="fa-regular fa-image text-xl"></i>'}</div><div class="flex flex-wrap gap-2"><button type="button" class="btn btn-ghost !px-3 !py-1.5" data-pick><i class="fa-regular fa-images"></i>Pilih / unggah</button><button type="button" class="btn btn-ghost !px-3 !py-1.5 text-red-500" data-clear><i class="fa-solid fa-xmark"></i></button></div></div></div>`;
    if (f.type === 'rich') return `<div class="sm:col-span-2"><span class="lbl">${f.label}</span><div class="overflow-hidden rounded-xl border border-slate-200 focus-within:border-sea-500 focus-within:ring-4 focus-within:ring-sea-500/15"><div class="flex flex-wrap gap-1 border-b border-slate-200 bg-slate-50 p-1.5">${[['bold', 'fa-bold'], ['italic', 'fa-italic'], ['insertUnorderedList', 'fa-list-ul'], ['insertOrderedList', 'fa-list-ol'], ['createLink', 'fa-link'], ['removeFormat', 'fa-eraser']].map(([cmd, ic]) => `<button type="button" data-cmd="${cmd}" class="flex h-8 w-8 items-center justify-center rounded-lg text-xs text-slate-600 hover:bg-white hover:text-navy-900" title="${cmd}"><i class="fa-solid ${ic}"></i></button>`).join('')}</div><div class="rich min-h-[9rem] px-3.5 py-3 text-sm leading-relaxed outline-none" contenteditable="true" data-ph="Tulis isi berita…" data-rich="${f.name}">${val}</div></div></div>`;
    return `<label class="block ${f.full ? 'sm:col-span-2' : ''}"><span class="lbl">${f.label}${f.req ? ' *' : ''}</span><input class="inp" type="${f.type || 'text'}" data-f="${f.name}" value="${esc(val)}" ${f.ph ? 'placeholder="' + esc(f.ph) + '"' : ''}></label>`;
  }
  function form(c, item) {
    const isNew = !item; const base = item ? clone(item) : c.newItem();
    openModal({ title: (isNew ? 'Tambah ' : 'Edit ') + c.singular, size: 'max-w-2xl', body: `<div class="grid gap-4 sm:grid-cols-2">${c.fields.map((f) => fieldHtml(f, base[f.name])).join('')}</div><p id="fErr" class="mt-4 hidden rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600"></p>`,
      onMount: (m) => {
        $$('[data-imgf]', m.el).forEach((w) => { const h = $('input[type=hidden]', w), pv = $('[data-prev]', w); const set = (src) => { h.value = src; pv.innerHTML = src ? `<img src="${esc(src)}" alt="" class="h-full w-full object-cover object-top">` : '<i class="fa-regular fa-image text-xl"></i>'; };
          $('[data-pick]', w).addEventListener('click', () => CMS.imagePicker(set)); $('[data-clear]', w).addEventListener('click', () => set('')); });
        $$('[data-cmd]', m.el).forEach((b) => b.addEventListener('mousedown', (e) => { e.preventDefault(); const cmd = b.dataset.cmd; if (cmd === 'createLink') { const u = prompt('Alamat tautan (URL):', 'https://'); if (u) document.execCommand(cmd, false, u); } else document.execCommand(cmd, false, null); }));
        const t = $('[data-f=title]', m.el), s = $('[data-f=slug]', m.el); if (t && s && isNew) t.addEventListener('input', () => { s.value = slugify(t.value); });
      },
      actions: [{ label: 'Batal' }, { label: '<i class="fa-solid fa-check"></i> Simpan', cls: 'btn-primary', onClick: (m) => {
        const out = { ...base }; let err = '';
        c.fields.forEach((f) => { const el = $(`[data-f="${f.name}"]`, m.el); if (f.type === 'rich') out[f.name] = $(`[data-rich="${f.name}"]`, m.el).innerHTML; else if (f.type === 'bool') out[f.name] = el.checked; else out[f.name] = el.value.trim(); if (f.req && !out[f.name]) err = err || (f.label + ' wajib diisi.'); });
        if (err) { const e = $('#fErr', m.el); e.textContent = err; e.classList.remove('hidden'); return false; }
        const arr = D()[c.key]; if (isNew) { out.id = uid(); c.prepend ? arr.unshift(out) : arr.push(out); } else arr[arr.findIndex((x) => x.id === item.id)] = out;
        touch(); log(c.singular, (isNew ? 'Menambah ' : 'Mengubah ') + out[c.nameKey]); toast(c.singular + ' disimpan ke draft'); CMS.rerender();
      } }] });
  }

  const thumb = (src, cls = 'h-24 w-14') => `<div class="flex ${cls} shrink-0 items-center justify-center overflow-hidden rounded-lg bg-sea-100 text-sea-600">${src ? `<img src="${esc(src)}" alt="" class="h-full w-full object-cover object-top" loading="lazy">` : '<i class="fa-regular fa-image"></i>'}</div>`;
  crud({ key: 'alumni', route: 'alumni', title: 'Cerita Alumni', icon: 'fa-quote-left', singular: 'Alumni', nameKey: 'name', addLabel: 'Tambah alumni', sub: 'Kutipan dan foto alumni yang tampil di carousel testimoni (juga di halaman program).',
    meta: [['Label kecil', 'alumniSection.eyebrow'], ['Teks tombol', 'alumniSection.buttonText'], ['Judul', 'alumniSection.title', 'text', true], ['Deskripsi', 'alumniSection.text', 'area', true]],
    search: (a) => a.name + a.company + a.batch,
    newItem: () => ({ name: '', batch: '', company: '', place: '', photo: '', text: '', status: 'draft' }),
    fields: [{ name: 'name', label: 'Nama', req: true }, { name: 'batch', label: 'Batch', ph: 'Students Batch 5' }, { name: 'company', label: 'Perusahaan pelayaran', req: true }, { name: 'place', label: 'Lokasi (opsional)', ph: 'Juneau, Alaska' }, { name: 'photo', label: 'Foto / poster', type: 'image', portrait: true }, { name: 'text', label: 'Kutipan testimoni', type: 'textarea', rows: 4, full: true, req: true }, { name: 'status', label: 'Status', type: 'select', options: [['published', 'Dipublikasikan'], ['draft', 'Draft']] }],
    card: (a, i, actions) => `<article class="card flex flex-col gap-3 p-4"><div class="flex gap-4">${thumb(a.photo)}<div class="min-w-0 flex-1"><div class="flex items-start justify-between gap-2"><h3 class="truncate font-extrabold">${esc(a.name)}</h3>${UI.status(a.status)}</div><p class="mt-0.5 text-xs text-slate-500">${esc(a.batch)} · ${esc(a.company)}${a.place ? ' · ' + esc(a.place) : ''}</p><p class="mt-2 line-clamp-3 text-xs leading-relaxed text-slate-600">${esc(a.text)}</p></div></div>${actions}</article>`,
    footer: '<p class="mt-4 text-[11px] text-amber-600"><i class="fa-solid fa-triangle-exclamation mr-1"></i>Pastikan kutipan alumni sudah disetujui oleh yang bersangkutan sebelum dipublikasikan.</p>' });
  crud({ key: 'partners', route: 'mitra', title: 'Mitra Industri', icon: 'fa-handshake', singular: 'Mitra', nameKey: 'name', addLabel: 'Tambah mitra', sub: 'Logo perusahaan yang berjalan otomatis di section Mitra Industri.',
    meta: [['Label kecil', 'partnersSection.eyebrow'], ['Keterangan', 'partnersSection.text']],
    search: (p) => p.name + p.url,
    newItem: () => ({ name: '', url: '', logo: '', active: true }),
    fields: [{ name: 'name', label: 'Nama perusahaan', req: true, full: true }, { name: 'url', label: 'Tautan (halaman karier)', type: 'url', ph: 'https://…', full: true }, { name: 'logo', label: 'Logo', type: 'image' }, { name: 'active', label: 'Tampilkan di website', type: 'bool', full: true, def: true }],
    card: (p, i, actions) => `<article class="card flex flex-col gap-3 p-4"><div class="flex items-center gap-4"><div class="flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50 ring-1 ring-slate-200">${p.logo ? `<img src="${esc(p.logo)}" alt="" class="max-h-full max-w-full object-contain p-1.5">` : `<span class="px-2 text-center text-[10px] font-extrabold uppercase leading-tight text-navy-800">${esc(p.name)}</span>`}</div><div class="min-w-0 flex-1"><h3 class="truncate font-extrabold">${esc(p.name)}</h3><p class="truncate text-xs text-sea-600">${esc(p.url || '—')}</p><div class="mt-1.5">${UI.chip(p.active ? '● Tayang' : '● Nonaktif', p.active ? 'green' : 'slate')}</div></div></div>${actions}</article>`,
    footer: '<p class="mt-4 text-[11px] text-slate-400">Tips: gunakan logo resmi berlatar transparan (PNG/SVG) dan pastikan hubungan kerja sama dengan perusahaan dapat dibuktikan.</p>' });
  crud({ key: 'team', route: 'team', title: 'Team Kami', icon: 'fa-users', singular: 'Anggota tim', nameKey: 'name', addLabel: 'Tambah anggota', sub: 'Struktur tim yang tampil di carousel “People Behind Seabar”.',
    meta: [['Label kecil', 'teamSection.eyebrow'], ['Judul', 'teamSection.title'], ['Deskripsi', 'teamSection.text', 'area', true]],
    search: (t) => t.name + t.role,
    newItem: () => ({ name: '', role: '', photo: '', active: true }),
    fields: [{ name: 'name', label: 'Nama lengkap', req: true }, { name: 'role', label: 'Jabatan', req: true }, { name: 'photo', label: 'Foto', type: 'image', round: true }, { name: 'active', label: 'Tampilkan di website', type: 'bool', full: true, def: true }],
    card: (t, i, actions) => `<article class="card flex flex-col gap-3 p-4"><div class="flex items-center gap-4"><div class="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-sea-500 to-navy-800 text-lg font-bold text-white">${t.photo ? `<img src="${esc(t.photo)}" alt="" class="h-full w-full object-cover object-top">` : initials(t.name)}</div><div class="min-w-0 flex-1"><h3 class="truncate font-extrabold">${esc(t.name)}</h3><p class="truncate text-xs text-slate-500">${esc(t.role)}</p><div class="mt-1.5">${UI.chip(t.active ? '● Tayang' : '● Disembunyikan', t.active ? 'green' : 'slate')}</div></div></div>${actions}</article>`,
    footer: '' });
  crud({ key: 'news', route: 'berita', title: 'Berita & Informasi', icon: 'fa-newspaper', singular: 'Berita', nameKey: 'title', addLabel: 'Tulis berita', layout: 'list', prepend: true, sub: 'Tulis, jadwalkan, dan kelola artikel. Tiga berita terbaru yang dipublikasikan tampil di landing page.',
    meta: [['Label kecil', 'newsSection.eyebrow'], ['Judul', 'newsSection.title'], ['Teks tombol', 'newsSection.buttonText']],
    search: (n) => n.title + n.tag,
    newItem: () => ({ title: '', slug: '', tag: 'Pengumuman', date: new Date().toISOString().slice(0, 10), excerpt: '', body: '', cover: '', status: 'draft' }),
    fields: [{ name: 'title', label: 'Judul', req: true, full: true }, { name: 'slug', label: 'Slug URL' }, { name: 'tag', label: 'Kategori', type: 'select', options: [['Pengumuman', 'Pengumuman'], ['Kegiatan', 'Kegiatan'], ['Tips Karier', 'Tips Karier'], ['Prestasi', 'Prestasi']] }, { name: 'date', label: 'Tanggal terbit', type: 'date' }, { name: 'status', label: 'Status', type: 'select', options: [['draft', 'Draft'], ['published', 'Dipublikasikan'], ['scheduled', 'Terjadwal']] }, { name: 'excerpt', label: 'Ringkasan', type: 'textarea', rows: 2, full: true }, { name: 'cover', label: 'Gambar sampul', type: 'image' }, { name: 'body', label: 'Isi artikel', type: 'rich' }],
    card: (n, i, actions) => `<article class="card flex flex-col gap-3 p-4 sm:flex-row sm:items-start"><div class="flex h-24 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-sea-100 to-sea-500/40 text-sea-600 sm:w-36">${n.cover ? `<img src="${esc(n.cover)}" alt="" class="h-full w-full object-cover">` : '<i class="fa-regular fa-image text-2xl"></i>'}</div><div class="min-w-0 flex-1"><div class="flex flex-wrap items-center gap-2">${UI.chip(esc(n.tag), 'gold')}${UI.status(n.status)}<span class="text-[11px] text-slate-400">${fmtDate(n.date)}</span></div><h3 class="mt-2 font-extrabold leading-snug">${esc(n.title)}</h3><p class="mt-1 line-clamp-2 text-xs text-slate-500">${esc(n.excerpt)}</p><div class="mt-3">${actions}</div></div></article>`,
    footer: '' });

  /* =========================================================== NAVIGASI */
  register('navigasi', {
    title: 'Navigasi', icon: 'fa-bars-staggered',
    render() {
      const nav = D().nav;
      return UI.head('Navigasi', 'Atur menu navbar landing page. Menu “Program” otomatis berisi daftar program yang berstatus tayang.', '<button class="btn btn-primary" data-act="nav-add"><i class="fa-solid fa-plus"></i>Tambah menu</button>') +
        UI.card('Pratinjau navbar', `<div class="no-scrollbar flex items-center gap-6 overflow-x-auto rounded-2xl bg-gradient-to-r from-[#e3eff8] to-white px-5 py-4 ring-1 ring-slate-200"><img src="../assets/logo.png" alt="" class="h-9 shrink-0">${nav.filter((n) => n.visible).map((n) => `<span class="shrink-0 text-xs font-medium text-navy-800">${esc(n.label)}${n.dropdown ? ' <i class="fa-solid fa-chevron-down text-[8px]"></i>' : ''}</span>`).join('')}<span class="ml-auto shrink-0 rounded-full bg-navy-900 px-4 py-2 text-[10px] font-semibold text-white">${esc(D().navCta.label)}</span></div>`, { cls: 'mb-6' }) +
        `<div class="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_20rem]"><div class="space-y-3">${nav.map((n, i) => `<div class="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center ${n.visible ? '' : 'opacity-60'}">
          <div class="grid flex-1 gap-3 sm:grid-cols-2">${UI.inp('Label', 'nav.' + i + '.label')}${UI.inp('Tautan', 'nav.' + i + '.href', { ph: '#bagian atau https://…' })}</div>
          <div class="flex items-center gap-1.5 self-end sm:self-center">${n.dropdown ? UI.chip('<i class="fa-solid fa-caret-down text-[9px]"></i>Dropdown ' + D().programs.filter((p) => p.status === 'published').length + ' program', 'blue') : ''}
            <button class="btn-icon" data-act="nav-move" data-i="${i}" data-d="-1" ${i === 0 ? 'disabled' : ''}><i class="fa-solid fa-arrow-up"></i></button><button class="btn-icon" data-act="nav-move" data-i="${i}" data-d="1" ${i === nav.length - 1 ? 'disabled' : ''}><i class="fa-solid fa-arrow-down"></i></button>
            <button class="btn-icon" data-act="nav-vis" data-i="${i}"><i class="fa-solid ${n.visible ? 'fa-eye' : 'fa-eye-slash'}"></i></button><button class="btn-icon hover:!text-red-500" data-act="nav-del" data-i="${i}"><i class="fa-regular fa-trash-can"></i></button></div></div>`).join('')}</div>
          ${UI.card('Tombol di navbar', `<div class="space-y-4">${UI.inp('Teks', 'navCta.label')}${UI.inp('Tautan', 'navCta.href')}</div>`, { cls: 'h-fit' })}</div>`;
    },
    mount() { livePreview(); },
  });
  acts['nav-move'] = (el) => { if (move(D().nav, +el.dataset.i, +el.dataset.d)) { touch(); CMS.rerender(); } };
  acts['nav-vis'] = (el) => { const n = D().nav[+el.dataset.i]; n.visible = !n.visible; touch(); CMS.rerender(); };
  acts['nav-del'] = (el) => { const n = D().nav[+el.dataset.i]; confirmBox('Hapus menu?', 'Menu <b>' + esc(n.label) + '</b> akan dihapus dari navbar.', () => { D().nav.splice(+el.dataset.i, 1); touch(); log('Navigasi', 'Menghapus menu ' + n.label); CMS.rerender(); }); };
  acts['nav-add'] = () => { D().nav.push({ id: uid(), label: 'Menu baru', href: '#', visible: true }); touch(); log('Navigasi', 'Menambah menu'); CMS.rerender(); };
})();
