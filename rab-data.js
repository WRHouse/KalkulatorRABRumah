
// ============================================================
// RAB RUMAH — DATA AHSP 2025 + GAYA ARSITEKTUR + JENIS ATAP
// ============================================================

const WILAYAH = [
  { id:"jakarta",     label:"DKI Jakarta",                        indeks:1.10 },
  { id:"jabodetabek", label:"Bogor / Depok / Tangerang / Bekasi", indeks:1.00 },
  { id:"bandung",     label:"Bandung & Sekitarnya",               indeks:0.93 },
  { id:"yogyakarta",  label:"Yogyakarta",                         indeks:0.90 },
  { id:"semarang",    label:"Semarang",                           indeks:0.91 },
  { id:"surabaya",    label:"Surabaya",                           indeks:0.96 },
  { id:"malang",      label:"Malang",                             indeks:0.92 },
  { id:"medan",       label:"Medan",                              indeks:0.91 },
  { id:"palembang",   label:"Palembang",                          indeks:0.89 },
  { id:"pekanbaru",   label:"Pekanbaru",                          indeks:0.94 },
  { id:"batam",       label:"Batam",                              indeks:1.05 },
  { id:"bali",        label:"Denpasar / Bali",                    indeks:1.07 },
  { id:"makassar",    label:"Makassar",                           indeks:0.96 },
  { id:"banjarmasin", label:"Banjarmasin",                        indeks:1.08 },
  { id:"balikpapan",  label:"Balikpapan",                         indeks:1.18 },
  { id:"manado",      label:"Manado",                             indeks:1.00 },
  { id:"ambon",       label:"Ambon",                              indeks:1.25 },
  { id:"jayapura",    label:"Jayapura / Papua",                   indeks:1.42 },
  { id:"sorong",      label:"Sorong",                             indeks:1.38 },
  { id:"kupang",      label:"Kupang / NTT",                       indeks:0.90 },
  { id:"mataram",     label:"Mataram / NTB",                      indeks:0.91 },
];

const FAKTOR_LANTAI = { 1:1.00, 2:0.92, 3:0.87 };
const KELAS_MULT    = { ekonomi:0.82, menengah:1.00, mewah:1.62 };
const HARGA_M2_BASE = { ekonomi:4_400_000, menengah:7_100_000, mewah:12_000_000 };

// ── GAYA ARSITEKTUR ──────────────────────────────────────────
const GAYA_ARSITEKTUR = [
  {
    id:"modern_minimalis", label:"Modern Minimalis",
    keywords:"Clean lines · Fasad polos · Warna netral",
    finishing_mult:1.00,
    material_hint:"Cat eksterior weathershield putih/abu, batu alam slim, kaca aluminium",
    atap_cocok:["genteng_metal","dak_beton","bitumen"],
    warna:["#E8E8E8","#2D2D2D","#FFFFFF"],
    svg:`<svg viewBox="0 0 80 56" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="56" fill="#F5F5F5"/>
      <rect x="8" y="22" width="64" height="28" fill="#FFFFFF" stroke="#D0D0D0" stroke-width="1"/>
      <rect x="8" y="14" width="64" height="10" fill="#E0E0E0"/>
      <rect x="16" y="28" width="10" height="22" fill="#B0C4D8"/>
      <rect x="30" y="28" width="18" height="14" fill="#B0C4D8"/>
      <rect x="54" y="28" width="12" height="22" fill="#B0C4D8"/>
      <line x1="8" y1="22" x2="72" y2="22" stroke="#C0C0C0" stroke-width="1.5"/>
    </svg>`,
  },
  {
    id:"industrial", label:"Industrial",
    keywords:"Exposed concrete · Besi hitam · Bata ekspos",
    finishing_mult:0.95,
    material_hint:"Bata ekspos, beton ekspos, besi hollow hitam, lantai epoxy/polished concrete",
    atap_cocok:["spandek","genteng_metal","dak_beton"],
    warna:["#4A4A4A","#8B4513","#2C2C2C"],
    svg:`<svg viewBox="0 0 80 56" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="56" fill="#E8E0D8"/>
      <rect x="8" y="16" width="64" height="34" fill="#C8B89A"/>
      <pattern id="bata" width="12" height="6" patternUnits="userSpaceOnUse">
        <rect width="12" height="6" fill="#B8907A" stroke="#A07060" stroke-width="0.5"/>
        <rect x="6" y="3" width="12" height="6" fill="#C8A08A" stroke="#A07060" stroke-width="0.5"/>
      </pattern>
      <rect x="8" y="16" width="64" height="34" fill="url(#bata)" opacity="0.7"/>
      <rect x="14" y="24" width="8" height="26" fill="#2C2C2C" opacity="0.8"/>
      <rect x="28" y="24" width="20" height="16" fill="#3C3C3C" opacity="0.7"/>
      <rect x="54" y="24" width="14" height="26" fill="#2C2C2C" opacity="0.8"/>
      <rect x="8" y="10" width="64" height="8" fill="#555"/>
    </svg>`,
  },
  {
    id:"klasik_colonial", label:"Klasik / Colonial",
    keywords:"Lengkungan · Pilar · Ornamen dekoratif",
    finishing_mult:1.35,
    material_hint:"Cat pastel hangat, pilar GRC, ornamen profil gypsum, keramik teraso, roster dekoratif",
    atap_cocok:["genteng_keramik","genteng_metal"],
    warna:["#F5F0E8","#C8A878","#8B7355"],
    svg:`<svg viewBox="0 0 80 56" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="56" fill="#FBF5EA"/>
      <polygon points="40,6 6,22 74,22" fill="#D4A070"/>
      <rect x="10" y="22" width="60" height="28" fill="#F5ECD8"/>
      <rect x="16" y="22" width="6" height="28" fill="#E8D5B0"/>
      <rect x="58" y="22" width="6" height="28" fill="#E8D5B0"/>
      <path d="M28 38 Q36 30 44 38" fill="none" stroke="#C8A878" stroke-width="2"/>
      <rect x="34" y="38" width="12" height="12" fill="#C8A878"/>
      <circle cx="19" cy="20" r="3" fill="#E8D5B0"/>
      <circle cx="61" cy="20" r="3" fill="#E8D5B0"/>
    </svg>`,
  },
  {
    id:"tropis_kontemporer", label:"Tropis Kontemporer",
    keywords:"Atap miring · Kayu · Teras lebar",
    finishing_mult:1.10,
    material_hint:"Wood decking, atap sirap/metal, roster kayu, tanaman rambat, ventilasi silang",
    atap_cocok:["genteng_keramik","genteng_metal","bitumen"],
    warna:["#8B6914","#556B2F","#D4A870"],
    svg:`<svg viewBox="0 0 80 56" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="56" fill="#F0EBD8"/>
      <polygon points="4,22 40,6 76,22" fill="#8B6914"/>
      <rect x="10" y="22" width="60" height="28" fill="#D4A870"/>
      <rect x="10" y="22" width="60" height="6" fill="#6B4E1A" opacity="0.4"/>
      <rect x="16" y="30" width="10" height="20" fill="#5C4A2A"/>
      <rect x="30" y="30" width="20" height="14" fill="#6B5A3A" opacity="0.6"/>
      <rect x="54" y="30" width="10" height="20" fill="#5C4A2A"/>
      <rect x="0" y="22" width="80" height="4" fill="#6B4E1A" opacity="0.5"/>
    </svg>`,
  },
  {
    id:"mediterania", label:"Mediterania",
    keywords:"Warna hangat · Genting merah · Plester tekstur",
    finishing_mult:1.25,
    material_hint:"Cat tierra/kuning ochre, genting merah clay, pilar putih, tanaman olive/lavender",
    atap_cocok:["genteng_keramik"],
    warna:["#D4722A","#F5D06E","#FFFFFF"],
    svg:`<svg viewBox="0 0 80 56" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="56" fill="#FDF5E6"/>
      <polygon points="6,24 40,8 74,24" fill="#C05020"/>
      <polygon points="6,24 15,24 12,18" fill="#A04010"/>
      <polygon points="74,24 65,24 68,18" fill="#A04010"/>
      <rect x="10" y="24" width="60" height="26" fill="#F5D06E"/>
      <rect x="20" y="32" width="10" height="18" fill="#8B7355"/>
      <path d="M34 40 Q40 33 46 40 L46 50 L34 50 Z" fill="#FFFFFF"/>
      <rect x="52" y="32" width="14" height="10" fill="#87CEEB" opacity="0.7"/>
      <circle cx="14" cy="40" r="5" fill="#3A7D44" opacity="0.7"/>
      <circle cx="66" cy="40" r="5" fill="#3A7D44" opacity="0.7"/>
    </svg>`,
  },
  {
    id:"japandi", label:"Japandi",
    keywords:"Natural · Wood tone · Sederhana & tenang",
    finishing_mult:1.15,
    material_hint:"Kayu cedar/pinus natural, shoji screen, gravel, batu alam hitam, cat putih warm",
    atap_cocok:["dak_beton","genteng_keramik","bitumen"],
    warna:["#C8B89A","#4A3728","#F8F4EE"],
    svg:`<svg viewBox="0 0 80 56" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="56" fill="#F8F4EE"/>
      <rect x="6" y="14" width="68" height="6" fill="#4A3728"/>
      <rect x="10" y="20" width="60" height="30" fill="#F0EAE0"/>
      <rect x="10" y="20" width="60" height="30" fill="#C8B89A" opacity="0.3"/>
      <rect x="16" y="26" width="14" height="24" fill="#4A3728" opacity="0.15"/>
      <rect x="34" y="26" width="12" height="16" fill="#B8D4E8" opacity="0.6"/>
      <rect x="50" y="26" width="14" height="24" fill="#4A3728" opacity="0.15"/>
      <rect x="16" y="26" width="2" height="24" fill="#4A3728" opacity="0.4"/>
      <rect x="28" y="26" width="2" height="24" fill="#4A3728" opacity="0.4"/>
    </svg>`,
  },
  {
    id:"art_deco", label:"Art Deco",
    keywords:"Geometris bold · Warna kontras · Ornamen linear",
    finishing_mult:1.30,
    material_hint:"Marmer, kuningan/brass, warna navy/gold, ornamen linear relief, kaca patri",
    atap_cocok:["dak_beton","genteng_metal"],
    warna:["#1A1A2E","#C9A84C","#F0E6C8"],
    svg:`<svg viewBox="0 0 80 56" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="56" fill="#F0E6C8"/>
      <rect x="8" y="8" width="64" height="42" fill="#1A1A2E"/>
      <rect x="12" y="12" width="56" height="34" fill="#252548"/>
      <rect x="16" y="16" width="4" height="30" fill="#C9A84C"/>
      <rect x="60" y="16" width="4" height="30" fill="#C9A84C"/>
      <rect x="30" y="24" width="20" height="14" fill="#C9A84C" opacity="0.2"/>
      <rect x="34" y="38" width="12" height="12" fill="#C9A84C" opacity="0.8"/>
      <line x1="8" y1="20" x2="72" y2="20" stroke="#C9A84C" stroke-width="1.5"/>
      <line x1="8" y1="42" x2="72" y2="42" stroke="#C9A84C" stroke-width="1.5"/>
    </svg>`,
  },
  {
    id:"vernakular", label:"Vernakular / Tradisional",
    keywords:"Arsitektur lokal · Material alam · Atap joglo/limasan",
    finishing_mult:1.20,
    material_hint:"Kayu ulin/jati, atap sirap/ijuk, anyaman bambu, ornamen ukiran lokal, tanah liat",
    atap_cocok:["genteng_keramik","bitumen"],
    warna:["#8B4513","#DAA520","#F5DEB3"],
    svg:`<svg viewBox="0 0 80 56" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="56" fill="#FDF5DC"/>
      <polygon points="40,4 2,26 78,26" fill="#8B4513"/>
      <polygon points="40,10 15,26 65,26" fill="#A0522D"/>
      <polygon points="40,16 25,26 55,26" fill="#CD853F"/>
      <rect x="10" y="26" width="60" height="24" fill="#DEB887"/>
      <rect x="18" y="26" width="8" height="24" fill="#8B4513" opacity="0.5"/>
      <rect x="54" y="26" width="8" height="24" fill="#8B4513" opacity="0.5"/>
      <rect x="32" y="34" width="16" height="16" fill="#5C3A1E"/>
      <rect x="10" y="26" width="60" height="3" fill="#6B3A10" opacity="0.6"/>
    </svg>`,
  },
];

// ── JENIS ATAP ────────────────────────────────────────────────
const JENIS_ATAP = [
  {
    id:"dak_beton", label:"Dak Beton / Cor",
    harga_m2:650_000, struktur_hint:"Ring balok lebih kuat, besi lebih banyak, waterproofing wajib",
    desc:"Kuat, bisa dijadikan rooftop/taman atap, cocok rumah modern & industrial",
    pros:"Tahan lama, multifungsi", cons:"Biaya tinggi, perlu waterproofing berkala",
    warna:"#607D8B",
  },
  {
    id:"genteng_keramik", label:"Genteng Keramik",
    harga_m2:185_000, struktur_hint:"Kuda-kuda kayu atau baja ringan, beban sedang",
    desc:"Klasik, durable, estetis, cocok tropis, mediterania, dan klasik",
    pros:"Estetis, awet >30 tahun", cons:"Berat, perlu kuda-kuda kuat",
    warna:"#C0522A",
  },
  {
    id:"genteng_metal", label:"Genteng Metal (Zincalume/Colorsteel)",
    harga_m2:114_665, struktur_hint:"Baja ringan (light gauge steel), beban ringan",
    desc:"Ringan, pemasangan cepat, ekonomis, cocok modern & industrial",
    pros:"Ringan, tahan karat, garansi panjang", cons:"Lebih panas, bising saat hujan tanpa foam",
    warna:"#78909C",
  },
  {
    id:"upvc", label:"UPVC Double Layer",
    harga_m2:320_000, struktur_hint:"Rangka baja ringan, titik tumpuan lebih rapat",
    desc:"Transparan/tembus cahaya, anti panas, cocok kanopi & tambahan atap",
    pros:"Cahaya alami, ringan, anti UV", cons:"Tidak cocok untuk atap utama luas",
    warna:"#90CAF9",
  },
  {
    id:"bitumen", label:"Bitumen / Aspal Shingle",
    harga_m2:145_000, struktur_hint:"Bisa di plywood sebagai underlayer, fleksibel",
    desc:"Kedap suara, fleksibel untuk atap miring, cocok rumah modern & japandi",
    pros:"Kedap suara, ringan, estetis modern", cons:"Umur lebih pendek di iklim tropis",
    warna:"#37474F",
  },
  {
    id:"polycarbonate", label:"Polycarbonate",
    harga_m2:85_000, struktur_hint:"Rangka baja hollow, titik baut rapat",
    desc:"Transparan, murah, ideal untuk carport, kanopi, atau area transisi",
    pros:"Murah, transparan, cahaya alami", cons:"Tidak cocok untuk atap utama rumah",
    warna:"#B3E5FC",
  },
  {
    id:"spandek", label:"Atap Spandek / Galvalum",
    harga_m2:95_000, struktur_hint:"Baja ringan atau gording besi, bentang besar",
    desc:"Industri & ekonomis, tahan lama, cocok industrial style dan gudang",
    pros:"Kuat, bentang besar, murah", cons:"Panas, estetika terbatas tanpa plafon",
    warna:"#B0BEC5",
  },
  {
    id:"green_roof", label:"Green Roof / Atap Tanaman",
    harga_m2:850_000, struktur_hint:"Struktur dak beton extra kuat + waterproofing + drainase",
    desc:"Ekologis, estetis premium, thermal insulation, cocok mewah & modern",
    pros:"Isolasi panas, estetis, ekologis", cons:"Biaya sangat tinggi, perawatan intensif",
    warna:"#4CAF50",
  },
];

// Spesifikasi finishing per kelas
const SPEC_NOTES = {
  ekonomi: {
    pondasi:"Batu kali / pondasi setempat", struktur:"Beton K-225, tulangan SNI minimal",
    dinding:"Bata merah, plester-acian standar", kusen:"Kayu meranti / aluminium 3\"",
    lantai:"Keramik 30×30 kelas B", sanitasi:"Sanitary ekonomi", listrik:"1.300–2.200 VA",
    cat:"Cat emulsi ekonomi (Vinilex, Mowilex E)",
  },
  menengah: {
    pondasi:"Batu kali / footplate beton bertulang", struktur:"Beton K-250, full SNI",
    dinding:"Bata merah / hebel AAC, plester halus", kusen:"Kayu kamper / aluminium 4\"",
    lantai:"Keramik 60×60 kelas A", sanitasi:"TOTO / American Standard", listrik:"2.200–4.400 VA",
    cat:"Cat premium (Dulux, Mowilex)",
  },
  mewah: {
    pondasi:"Footplate / minipile beton", struktur:"Beton K-300, kolom besar",
    dinding:"Hebel / bata fasad premium", kusen:"UPVC / aluminium sistem + double glazing",
    lantai:"Granit / marmer premium", sanitasi:"Kohler / TOTO premium", listrik:"≥6.600 VA smart home",
    cat:"Jotun / Dulux WeatherShield Max",
  },
};

// AHSP Divisi — harga aktual dari file RAB Otomatis V2-2025
const AHSP_DIVISI = [
  { id:"persiapan", roman:"I",   label:"Pekerjaan Persiapan",           color:"#6B7280",
    items:[
      { kode:"A.1.1.1.8", uraian:"Pembersihan lahan",                  satuan:"M²", harga:23100,    mat:0.35, volume_fn:(L)=>L*1.5 },
      { kode:"A.1.1.1.4", uraian:"Pengukuran & bouwplank",             satuan:"M'", harga:92990,    mat:0.50, volume_fn:(L)=>4*Math.sqrt(L)*1.15 },
      { kode:"-",         uraian:"Penyediaan air kerja",                satuan:"LS", harga:500000,   mat:0.20, volume_fn:()=>1 },
      { kode:"-",         uraian:"Administrasi & dokumentasi",          satuan:"LS", harga:500000,   mat:0.10, volume_fn:()=>1 },
    ]},
  { id:"tanah", roman:"II", label:"Pekerjaan Tanah",                    color:"#92400E",
    items:[
      { kode:"A.1.5.1.4",  uraian:"Galian tanah pondasi ≤1m",          satuan:"M³", harga:143484,   mat:0.05, volume_fn:(L,lnt)=>L*0.155*lnt },
      { kode:"A.1.5.1.9",  uraian:"Urugan tanah kembali",              satuan:"M³", harga:39050,    mat:0.10, volume_fn:(L,lnt)=>L*0.135*lnt },
      { kode:"A.1.5.1.11", uraian:"Urugan pasir bawah pondasi t=10cm", satuan:"M³", harga:440426,   mat:0.70, volume_fn:(L)=>L*0.010 },
      { kode:"A.1.5.1.11", uraian:"Urugan pasir bawah lantai t=10cm",  satuan:"M³", harga:440426,   mat:0.70, volume_fn:(L)=>L*0.024 },
    ]},
  { id:"pondasi", roman:"III", label:"Pekerjaan Pondasi",               color:"#78350F",
    items:[
      { kode:"A.3.1.1.9",  uraian:"Batu kosong / aanstamping",         satuan:"M³", harga:885381,   mat:0.68, volume_fn:(L,lnt)=>L*0.030*lnt },
      { kode:"A.3.1.1.1",  uraian:"Pondasi batu gunung (1SP:3PP)",     satuan:"M³", harga:1467001,  mat:0.65, volume_fn:(L,lnt)=>L*0.090*lnt },
    ]},
  { id:"beton", roman:"IV", label:"Pekerjaan Struktur Beton",           color:"#1E3A8A",
    items:[
      { kode:"A.4.1.1.30", uraian:"Sloof beton bertulang 20×25 cm",    satuan:"M³", harga:7336880,  mat:0.65, volume_fn:(L,lnt)=>L*0.011*lnt },
      { kode:"A.4.1.1.33", uraian:"Kolom praktis 15×15 cm (K250)",     satuan:"M³", harga:8939854,  mat:0.63, volume_fn:(L,lnt)=>L*0.008*lnt },
      { kode:"A.4.1.1.33", uraian:"Kolom utama 20×20 cm (K250)",       satuan:"M³", harga:8939854,  mat:0.63, volume_fn:(L,lnt)=>L*0.006*lnt },
      { kode:"A.4.1.1.30", uraian:"Ring balok 15×20 cm (K250)",        satuan:"M³", harga:7336880,  mat:0.65, volume_fn:(L,lnt)=>L*0.009*lnt },
      { kode:"A.4.1.1.8",  uraian:"Plat lantai beton K250 t=12cm",     satuan:"M³", harga:1802958,  mat:0.67, volume_fn:(L,lnt)=>lnt>1?L*0.12*(lnt-1):0 },
      { kode:"A.4.1.1.25", uraian:"Bekisting plat lantai",             satuan:"M²", harga:700265,   mat:0.55, volume_fn:(L,lnt)=>lnt>1?L*0.8*(lnt-1):L*0.06 },
      { kode:"A.4.1.1.18", uraian:"Pembesian besi tulangan polos/ulir",satuan:"Kg", harga:17692,    mat:0.80, volume_fn:(L,lnt)=>L*5.5*lnt },
    ]},
  { id:"dinding", roman:"V", label:"Pekerjaan Dinding & Pasangan",      color:"#B45309",
    items:[
      { kode:"A.4.4.1.9",  uraian:"Pasangan bata merah ½ bata",        satuan:"M²", harga:178223,   mat:0.60, volume_fn:(L,lnt)=>4*Math.sqrt(L)*1.1*3.2*0.65*lnt },
    ]},
  { id:"plester", roman:"VI", label:"Plesteran & Acian",                color:"#D97706",
    items:[
      { kode:"A.4.4.2.5",  uraian:"Plesteran 1SP:5PP, t=15mm",         satuan:"M²", harga:89498,    mat:0.45, volume_fn:(L,lnt)=>4*Math.sqrt(L)*1.1*3.2*0.65*lnt*2 },
      { kode:"A.4.4.2.27", uraian:"Acian dinding",                     satuan:"M²", harga:54406,    mat:0.35, volume_fn:(L,lnt)=>4*Math.sqrt(L)*1.1*3.2*0.65*lnt*2 },
      { kode:"A.4.4.2.1",  uraian:"Plesteran trasram 1SP:1PP",         satuan:"M²", harga:108051,   mat:0.50, volume_fn:(L,lnt,km)=>km*12 },
    ]},
  { id:"atap", roman:"VII", label:"Pekerjaan Atap",                     color:"#4C1D95",
    items:[], // diisi dinamis dari pilihan jenis atap
    dynamic: true,
  },
  { id:"kusen", roman:"VIII", label:"Kusen, Pintu & Jendela",           color:"#065F46",
    items:[
      { kode:"A.4.6.1.2",  uraian:"Kusen kayu kelas II (5/12)",        satuan:"M³", harga:10054189, mat:0.78, volume_fn:(L,lnt,km,kt)=>(kt+km+2)*0.018*lnt },
      { kode:"A.4.6.1.5",  uraian:"Daun pintu panel kayu",             satuan:"M²", harga:902665,   mat:0.78, volume_fn:(L,lnt,km,kt)=>(kt+km+1)*1.95*lnt },
      { kode:"A.4.6.1.6",  uraian:"Daun jendela kaca kayu",            satuan:"M²", harga:680859,   mat:0.75, volume_fn:(L,lnt,km,kt)=>kt*1.2*lnt },
      { kode:"A.4.6.2.2",  uraian:"Kunci tanam biasa",                 satuan:"BH", harga:269775,   mat:0.82, volume_fn:(L,lnt,km,kt)=>(kt+1)*lnt },
      { kode:"A.4.6.2.5",  uraian:"Engsel pintu",                      satuan:"BH", harga:53246,    mat:0.85, volume_fn:(L,lnt,km,kt)=>(kt+km+2)*3*lnt },
    ]},
  { id:"lantai", roman:"IX", label:"Lantai & Finishing",                color:"#BE185D",
    items:[], // diisi dinamis dari gaya arsitektur
    dynamic: true,
  },
  { id:"plafon", roman:"X", label:"Pekerjaan Plafon",                   color:"#0369A1",
    items:[
      { kode:"A.4.2.1.21", uraian:"Rangka plafon besi hollow 40×40",   satuan:"M²", harga:423593,   mat:0.60, volume_fn:(L)=>L*0.85 },
      { kode:"A.4.5.1.7",  uraian:"Plafon gypsum board 9mm",           satuan:"M²", harga:64700,    mat:0.58, volume_fn:(L)=>L*0.85 },
      { kode:"A.4.5.1.8",  uraian:"List plafon profil gypsum",         satuan:"M'", harga:41910,    mat:0.55, volume_fn:(L)=>4*Math.sqrt(L)*1.1*0.85 },
    ]},
  { id:"sanitasi", roman:"XI", label:"Sanitasi & Plumbing",             color:"#0E7490",
    items:[
      { kode:"A.5.1.1.1",  uraian:"Kloset duduk / monoblock",          satuan:"BH", harga:2407185,  mat:0.78, volume_fn:(L,lnt,km)=>km*lnt },
      { kode:"A.5.1.1.10", uraian:"Bak air fibreglass 1m³",            satuan:"BH", harga:611387,   mat:0.80, volume_fn:(L,lnt,km)=>km*lnt },
      { kode:"A.5.1.1.19", uraian:"Kran air ½\"-¾\"",                  satuan:"BH", harga:110331,   mat:0.82, volume_fn:(L,lnt,km)=>km*2*lnt },
      { kode:"A.5.1.1.14", uraian:"Floor drain stainless",             satuan:"BH", harga:328625,   mat:0.80, volume_fn:(L,lnt,km)=>km*lnt },
      { kode:"A.5.1.1.32", uraian:"Pipa PVC AW Ø4\" air kotor",        satuan:"M'", harga:154222,   mat:0.65, volume_fn:(L,lnt,km)=>km*8*lnt },
    ]},
  { id:"listrik", roman:"XII", label:"Instalasi Listrik",               color:"#D97706",
    items:[
      { kode:"A.8.4.6.2",  uraian:"Titik instalasi penerangan",        satuan:"Ttk",harga:306611,   mat:0.62, volume_fn:(L,lnt)=>Math.ceil(L/8)*lnt },
      { kode:"A.8.4.6.5",  uraian:"Stop kontak 2P + arde",             satuan:"BH", harga:70697,    mat:0.70, volume_fn:(L,lnt)=>Math.ceil(L/10)*lnt },
      { kode:"A.8.4.6.6",  uraian:"Panel MCB box",                     satuan:"BH", harga:496870,   mat:0.72, volume_fn:(L,lnt)=>lnt },
    ]},
  { id:"cat", roman:"XIII", label:"Pengecatan",                         color:"#DC2626",
    items:[], dynamic: true,
  },
  { id:"lainlain", roman:"XIV", label:"Pekerjaan Lain-Lain",            color:"#475569",
    items:[
      { kode:"-", uraian:"Pembersihan akhir & buang sisa material",    satuan:"M²", harga:7700,     mat:0.20, volume_fn:(L)=>L*1.5 },
      { kode:"-", uraian:"K3 (APD, rambu, direksi keet)",              satuan:"LS", harga:1500000,  mat:0.75, volume_fn:()=>1 },
      { kode:"-", uraian:"As-built drawing & manual pemeliharaan",     satuan:"LS", harga:750000,   mat:0.15, volume_fn:()=>1 },
    ]},
];

// Item atap dinamis per jenis atap
const ATAP_ITEMS = {
  dak_beton:[
    { kode:"A.4.1.1.8",  uraian:"Cor dak beton bertulang K-250 t=12cm", satuan:"M³", harga:1802958,  mat:0.67, volume_fn:(L)=>L*0.12 },
    { kode:"A.4.1.1.18", uraian:"Pembesian dak beton",                  satuan:"Kg", harga:17692,    mat:0.80, volume_fn:(L)=>L*8 },
    { kode:"A.4.1.1.25", uraian:"Bekisting dak beton",                  satuan:"M²", harga:700265,   mat:0.55, volume_fn:(L)=>L },
    { kode:"-",          uraian:"Waterproofing coating 2 lapis",        satuan:"M²", harga:125000,   mat:0.70, volume_fn:(L)=>L*1.1 },
  ],
  genteng_keramik:[
    { kode:"A.4.2.1.24", uraian:"Kuda-kuda kayu + reng",               satuan:"M²", harga:320000,   mat:0.68, volume_fn:(L)=>L*1.25 },
    { kode:"A.4.5.2.10", uraian:"Genteng keramik glazed",               satuan:"M²", harga:185000,   mat:0.72, volume_fn:(L)=>L*1.25 },
    { kode:"A.4.6.1.21", uraian:"Lisplank kayu kelas II 3×20cm",       satuan:"M'", harga:107851,   mat:0.70, volume_fn:(L)=>4*Math.sqrt(L)*0.55 },
  ],
  genteng_metal:[
    { kode:"A.4.2.1.24", uraian:"Kuda-kuda baja ringan + reng",        satuan:"M²", harga:396201,   mat:0.68, volume_fn:(L)=>L*1.25 },
    { kode:"A.4.5.2.32", uraian:"Genteng metal 80×100 cm",             satuan:"M²", harga:114665,   mat:0.72, volume_fn:(L)=>L*1.25 },
    { kode:"A.4.6.1.21", uraian:"Lisplank GRC / fiber semen",          satuan:"M'", harga:85000,    mat:0.68, volume_fn:(L)=>4*Math.sqrt(L)*0.55 },
  ],
  upvc:[
    { kode:"-",          uraian:"Rangka baja hollow 60×60mm",           satuan:"M²", harga:280000,   mat:0.65, volume_fn:(L)=>L*1.1 },
    { kode:"-",          uraian:"UPVC double layer anti UV",            satuan:"M²", harga:320000,   mat:0.78, volume_fn:(L)=>L*1.1 },
  ],
  bitumen:[
    { kode:"A.4.2.1.24", uraian:"Kuda-kuda baja ringan + reng",        satuan:"M²", harga:396201,   mat:0.68, volume_fn:(L)=>L*1.2 },
    { kode:"-",          uraian:"Underlayer plywood t=9mm",             satuan:"M²", harga:95000,    mat:0.80, volume_fn:(L)=>L*1.2 },
    { kode:"-",          uraian:"Aspal shingle bitumen",                satuan:"M²", harga:145000,   mat:0.78, volume_fn:(L)=>L*1.2 },
  ],
  polycarbonate:[
    { kode:"-",          uraian:"Rangka baja hollow 40×40mm",           satuan:"M²", harga:200000,   mat:0.60, volume_fn:(L)=>L*1.05 },
    { kode:"-",          uraian:"Polycarbonate 8mm UV coating",         satuan:"M²", harga:85000,    mat:0.82, volume_fn:(L)=>L*1.05 },
  ],
  spandek:[
    { kode:"A.4.2.1.24", uraian:"Gording baja ringan",                 satuan:"M²", harga:220000,   mat:0.68, volume_fn:(L)=>L*1.15 },
    { kode:"-",          uraian:"Atap spandek galvalum 0.35mm",         satuan:"M²", harga:95000,    mat:0.75, volume_fn:(L)=>L*1.15 },
  ],
  green_roof:[
    { kode:"A.4.1.1.8",  uraian:"Cor dak beton ekstra kuat K-300",     satuan:"M³", harga:2100000,  mat:0.67, volume_fn:(L)=>L*0.15 },
    { kode:"-",          uraian:"Waterproofing membrane green roof",    satuan:"M²", harga:320000,   mat:0.78, volume_fn:(L)=>L*1.1 },
    { kode:"-",          uraian:"Drainase + growing medium + tanaman",  satuan:"M²", harga:550000,   mat:0.85, volume_fn:(L)=>L },
  ],
};

// Item lantai & cat dinamis per gaya arsitektur
const LANTAI_ITEMS = {
  default:[
    { kode:"A.4.4.3.35", uraian:"Keramik lantai 30×30 cm",             satuan:"M²", harga:302112,   mat:0.68, volume_fn:(L,lnt,km)=>(L-km*3.5)*lnt },
    { kode:"A.4.4.3.36", uraian:"Keramik lantai KM/WC 20×20 cm",       satuan:"M²", harga:351087,   mat:0.68, volume_fn:(L,lnt,km)=>km*3.5*lnt },
  ],
  modern_minimalis:[
    { kode:"-",          uraian:"Homogeneous tile 60×60 polos",         satuan:"M²", harga:420000,   mat:0.70, volume_fn:(L,lnt,km)=>(L-km*3.5)*lnt },
    { kode:"A.4.4.3.36", uraian:"Keramik KM/WC 30×30 cm",              satuan:"M²", harga:351087,   mat:0.68, volume_fn:(L,lnt,km)=>km*3.5*lnt },
  ],
  industrial:[
    { kode:"-",          uraian:"Polished concrete / epoxy lantai",     satuan:"M²", harga:380000,   mat:0.65, volume_fn:(L,lnt,km)=>(L-km*3.5)*lnt },
    { kode:"A.4.4.3.36", uraian:"Keramik antislip KM 30×30",           satuan:"M²", harga:351087,   mat:0.68, volume_fn:(L,lnt,km)=>km*3.5*lnt },
  ],
  klasik_colonial:[
    { kode:"-",          uraian:"Keramik teraso / marmer imitasi",      satuan:"M²", harga:680000,   mat:0.72, volume_fn:(L,lnt,km)=>(L-km*3.5)*lnt },
    { kode:"-",          uraian:"Keramik KM/WC motif klasik",           satuan:"M²", harga:450000,   mat:0.70, volume_fn:(L,lnt,km)=>km*3.5*lnt },
  ],
  tropis_kontemporer:[
    { kode:"-",          uraian:"Dekton / keramik motif batu alam",     satuan:"M²", harga:450000,   mat:0.70, volume_fn:(L,lnt,km)=>(L-km*3.5)*lnt },
    { kode:"A.4.4.3.36", uraian:"Keramik antislip KM 30×30",           satuan:"M²", harga:351087,   mat:0.68, volume_fn:(L,lnt,km)=>km*3.5*lnt },
  ],
  mediterania:[
    { kode:"-",          uraian:"Keramik motif terracotta / encaustic",  satuan:"M²", harga:520000,   mat:0.72, volume_fn:(L,lnt,km)=>(L-km*3.5)*lnt },
    { kode:"-",          uraian:"Keramik KM mosaic mediterania",         satuan:"M²", harga:480000,   mat:0.70, volume_fn:(L,lnt,km)=>km*3.5*lnt },
  ],
  japandi:[
    { kode:"-",          uraian:"Keramik motif kayu / wood plank tile",  satuan:"M²", harga:460000,   mat:0.70, volume_fn:(L,lnt,km)=>(L-km*3.5)*lnt },
    { kode:"A.4.4.3.36", uraian:"Keramik KM natural stone look",        satuan:"M²", harga:380000,   mat:0.68, volume_fn:(L,lnt,km)=>km*3.5*lnt },
  ],
  art_deco:[
    { kode:"-",          uraian:"Marmer / granit poles premium",         satuan:"M²", harga:820000,   mat:0.75, volume_fn:(L,lnt,km)=>(L-km*3.5)*lnt },
    { kode:"-",          uraian:"Keramik KM hexagonal motif gold",       satuan:"M²", harga:560000,   mat:0.72, volume_fn:(L,lnt,km)=>km*3.5*lnt },
  ],
  vernakular:[
    { kode:"-",          uraian:"Tegel motif tradisional / teraso",      satuan:"M²", harga:480000,   mat:0.70, volume_fn:(L,lnt,km)=>(L-km*3.5)*lnt },
    { kode:"A.4.4.3.36", uraian:"Keramik antislip KM",                  satuan:"M²", harga:351087,   mat:0.68, volume_fn:(L,lnt,km)=>km*3.5*lnt },
  ],
};

const CAT_ITEMS = {
  default:[
    { kode:"A.4.7.1.10", uraian:"Cat tembok 2 lapis eksterior",        satuan:"M²", harga:37532,    mat:0.52, volume_fn:(L,lnt)=>4*Math.sqrt(L)*1.1*3.2*0.65*lnt*2 },
    { kode:"A.4.7.1.10", uraian:"Cat plafon",                          satuan:"M²", harga:37532,    mat:0.52, volume_fn:(L,lnt)=>L*0.85*lnt },
  ],
  modern_minimalis:[
    { kode:"-",          uraian:"Cat eksterior weathershield putih/abu",satuan:"M²", harga:55000,    mat:0.55, volume_fn:(L,lnt)=>4*Math.sqrt(L)*1.1*3.2*0.65*lnt },
    { kode:"A.4.7.1.10", uraian:"Cat interior premium",                satuan:"M²", harga:42000,    mat:0.52, volume_fn:(L,lnt)=>4*Math.sqrt(L)*1.1*3.2*0.65*lnt+L*0.85*lnt },
  ],
  industrial:[
    { kode:"-",          uraian:"Cat beton ekspos / clear coat",        satuan:"M²", harga:45000,    mat:0.55, volume_fn:(L,lnt)=>4*Math.sqrt(L)*1.1*3.2*0.65*lnt },
    { kode:"A.4.7.1.10", uraian:"Cat interior charcoal/abu tua",       satuan:"M²", harga:37532,    mat:0.52, volume_fn:(L,lnt)=>L*0.85*lnt },
  ],
  klasik_colonial:[
    { kode:"-",          uraian:"Cat eksterior pastel (Dulux Heritage)", satuan:"M²", harga:72000,    mat:0.57, volume_fn:(L,lnt)=>4*Math.sqrt(L)*1.1*3.2*0.65*lnt },
    { kode:"-",          uraian:"Cat interior dinding + ornamen profil", satuan:"M²", harga:58000,    mat:0.55, volume_fn:(L,lnt)=>4*Math.sqrt(L)*1.1*3.2*0.65*lnt+L*0.85*lnt },
  ],
};

// ENGINE KALKULASI
function buildDivisiWithOptions(gaya, atap) {
  return AHSP_DIVISI.map(div => {
    if(!div.dynamic) return div;
    const items = (() => {
      if(div.id==='atap')   return ATAP_ITEMS[atap] || ATAP_ITEMS['genteng_metal'];
      if(div.id==='lantai') return LANTAI_ITEMS[gaya] || LANTAI_ITEMS['default'];
      if(div.id==='cat')    return CAT_ITEMS[gaya] || CAT_ITEMS['default'];
      return [];
    })();
    return { ...div, items };
  });
}

function calcRABDetail(input) {
  const { luas, lantai, kelas, wilayahId, kamarMandi, kamarTidur, gaya='modern_minimalis', atap='genteng_metal', ohp=10 } = input;
  const L = Number(luas)||0, lnt=Number(lantai)||1, km=Number(kamarMandi)||1, kt=Number(kamarTidur)||2;
  const wilayah = WILAYAH.find(w=>w.id===wilayahId)||WILAYAH[1];
  const gayaData = GAYA_ARSITEKTUR.find(g=>g.id===gaya)||GAYA_ARSITEKTUR[0];
  const kelMult = KELAS_MULT[kelas]||1;
  const indeks = wilayah.indeks * FAKTOR_LANTAI[lnt] * kelMult * gayaData.finishing_mult;
  const divisiDef = buildDivisiWithOptions(gaya, atap);
  let grandTotal=0;
  const divisi = divisiDef.map(div=>{
    let divTotal=0,divMat=0,divJasa=0;
    const items = div.items.map(item=>{
      const vol = Math.max(0, item.volume_fn(L,lnt,km,kt));
      const harga = item.harga * indeks;
      const subtotal = vol * harga;
      const mat = subtotal * item.mat, jasa = subtotal*(1-item.mat);
      divTotal+=subtotal; divMat+=mat; divJasa+=jasa;
      return {...item, vol:Math.round(vol*100)/100, harga:Math.round(harga), subtotal, mat, jasa};
    });
    grandTotal+=divTotal;
    return {...div, items, total:divTotal, mat:divMat, jasa:divJasa};
  });
  const ohpAmt = grandTotal * (Number(ohp)||10) / 100;
  const totalMat=divisi.reduce((s,d)=>s+d.mat,0);
  const totalJasa=divisi.reduce((s,d)=>s+d.jasa,0);
  return { grandTotal, grandTotalWithOhp: grandTotal+ohpAmt, ohpAmt, hargaPerM2:L>0?grandTotal/L:0, totalMat, totalJasa, divisi, wilayah, indeks, gayaData };
}

function calcRABCepat(luas, lantai, kelas, wilayahId) {
  const wilayah = WILAYAH.find(w=>w.id===wilayahId)||WILAYAH[1];
  const hargaPerM2 = HARGA_M2_BASE[kelas] * wilayah.indeks * FAKTOR_LANTAI[lantai];
  return { grandTotal: hargaPerM2*luas, hargaPerM2, wilayah };
}

Object.assign(window, {
  WILAYAH, FAKTOR_LANTAI, KELAS_MULT, AHSP_DIVISI, SPEC_NOTES,
  HARGA_M2_BASE, GAYA_ARSITEKTUR, JENIS_ATAP, ATAP_ITEMS, LANTAI_ITEMS,
  buildDivisiWithOptions, calcRABDetail, calcRABCepat
});
