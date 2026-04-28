
// rab-gambar.jsx — Tab Gambar Kerja: Upload PDF/Image + Analisis AI + Rekomendasi Struktur SNI
// Requires: React, rab-data.js, pdfjsLib

const { useState, useEffect, useRef, useCallback } = React;

function GambarKerjaTab({ input, setInput, onApply }) {
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(0);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [status, setStatus] = useState('idle');
  const [aiResult, setAiResult] = useState(null);
  const [strukturResult, setStrukturResult] = useState(null);
  const [streamText, setStreamText] = useState('');
  const [analysisMode, setAnalysisMode] = useState('denah'); // denah | struktur
  const [batchResults, setBatchResults] = useState([]);
  const [batchProgress, setBatchProgress] = useState(0);
  const [batchRunning, setBatchRunning] = useState(false);
  const [drag, setDrag] = useState(false);
  const fileRef = useRef();
  const pdfRef = useRef(null);
  const batchCancelRef = useRef(false);

  useEffect(() => {
    if (window.pdfjsLib) {
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }
  }, []);

  const renderPdfPages = async (arrayBuffer) => {
    setLoadingPdf(true);
    setLoadProgress(0);
    try {
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      pdfRef.current = pdf;
      const total = pdf.numPages;
      const rendered = [];
      for (let i = 1; i <= total; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.55 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
        rendered.push({ url: canvas.toDataURL('image/jpeg', 0.75), pageNum: i, total });
        if (i % 3 === 0 || i === total) {
          setPages([...rendered]);
          setLoadProgress(Math.round(i / total * 100));
        }
      }
      setPages(rendered);
      setSelectedPage(0);
    } catch (e) {
      alert('Gagal membaca PDF: ' + e.message);
    }
    setLoadingPdf(false);
  };

  const renderPageHiRes = async (pageNum) => {
    if (!pdfRef.current) return null;
    const page = await pdfRef.current.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2.0 });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
    return canvas.toDataURL('image/jpeg', 0.88).split(',')[1];
  };

  const handleFile = async (f) => {
    if (!f) return;
    // Allow up to 200MB
    if (f.size > 200 * 1024 * 1024) { alert('File terlalu besar (maks. 200MB)'); return; }
    const isImg = f.type.startsWith('image/');
    const isPdf = f.type === 'application/pdf';
    if (!isImg && !isPdf) { alert('Format: JPG, PNG, WebP, atau PDF'); return; }
    setFile(f); setAiResult(null); setStrukturResult(null);
    setStreamText(''); setStatus('idle'); setPages([]); setBatchResults([]);
    if (isImg) {
      const url = URL.createObjectURL(f);
      setPages([{ url, pageNum: 1, total: 1 }]);
      setSelectedPage(0);
    } else {
      const buf = await f.arrayBuffer();
      await renderPdfPages(buf);
    }
  };

  const getB64 = async (pageNum) => {
    const pg = pages.find(p => p.pageNum === pageNum) || pages[selectedPage];
    if (!pg) return null;
    if (file?.type === 'application/pdf' && pdfRef.current) return await renderPageHiRes(pg.pageNum);
    // For image: read as base64
    return pg.url.split(',')[1];
  };

  const PROMPT_DENAH = `Kamu adalah ahli teknik sipil dan arsitek Indonesia berpengalaman membaca gambar kerja / denah rumah.

Analisis gambar ini secara mendalam. Ekstrak SEMUA informasi yang dapat dibaca:
- Jenis gambar (denah lantai, tampak, potongan, detail, site plan, dll)
- Luas bangunan total (m²) — hitung dari dimensi yang tertulis
- Jumlah lantai (1/2/3)
- Jumlah kamar tidur dan kamar mandi
- Dimensi utama panjang × lebar (m) — baca dari notasi dimensi
- List semua ruangan yang teridentifikasi
- Kelas bangunan (ekonomi/menengah/mewah) berdasarkan layout
- Fitur khusus: carport, teras, balkon, tangga, void, dll

Catatan: notasi dimensi bisa dalam mm (3000=3m) atau m (3.00).

Jawab HANYA dalam format JSON:
\`\`\`json
{
  "valid": true,
  "jenisGambar": "Denah Lantai 1",
  "luas": 72,
  "lantai": 1,
  "kamarTidur": 3,
  "kamarMandi": 2,
  "panjang": 9.0,
  "lebar": 8.0,
  "ruangan": ["Ruang Tamu","Ruang Makan","Dapur","KT Utama","KT 2","KT 3","KM 1","KM 2"],
  "kelas": "menengah",
  "catatan": "Carport 1 mobil, teras depan 2m",
  "confidence": "tinggi",
  "pesan": "Denah lantai 1 type 72, dimensi 9×8m, 3KT 2KM."
}
\`\`\``;

  const PROMPT_STRUKTUR = (lantai) => `Kamu adalah ahli teknik sipil Indonesia berpengalaman membaca gambar kerja dan merencanakan struktur rumah sesuai SNI 03-2847-2019 dan SNI 1726-2019.

Analisis gambar denah ini dan berikan rekomendasi SISTEM STRUKTUR LENGKAP:

KETENTUAN SNI:
- Jarak kolom maksimum: 3.5m untuk bangunan ${lantai} lantai
- Kolom utama (K1): pertemuan as utama, ukuran min ${lantai===1?'20×20':lantai===2?'25×25':'30×30'} cm
- Kolom praktis (K2): max setiap 3m dinding panjang, ukuran ${lantai===1?'15×15':lantai===2?'20×20':'25×25'} cm  
- Sloof: keliling bangunan + as dalam, min 20×25 cm
- Balok induk: bentang ≤ 6m, min tinggi L/12
- Ring balok: keliling atas dinding, min 15×20 cm
- Balok latei: di atas setiap bukaan pintu/jendela, min 10×15 cm

Analisis posisi kolom, sloof, balok dari denah.

Jawab HANYA JSON:
\`\`\`json
{
  "valid": true,
  "dimensiBangunan": {"panjang": 9, "lebar": 8},
  "kolom_utama": {"ukuran": "20×20 cm", "jumlah": 9, "posisi": ["sudut 4 titik","pertemuan as tengah"], "mutu": "K-250"},
  "kolom_praktis": {"ukuran": "15×15 cm", "jumlah": 12, "posisi": ["tiap 3m dinding panjang","sekitar bukaan"]},
  "sloof": {"ukuran": "20×25 cm", "panjang_total_m": 42, "keterangan": "keliling + 1 as dalam"},
  "ring_balok": {"ukuran": "15×20 cm", "panjang_total_m": 42},
  "balok_induk": [
    {"label": "B1", "ukuran": "20×40 cm", "bentang_m": 9, "jumlah": 2},
    {"label": "B2", "ukuran": "15×30 cm", "bentang_m": 8, "jumlah": 3}
  ],
  "balok_latei": {"ukuran": "10×15 cm", "panjang_total_m": 28, "keterangan": "di atas bukaan pintu & jendela"},
  "pondasi": {"tipe": "Pondasi batu kali", "kedalaman": "80-100 cm", "lebar_dasar": "70 cm"},
  "warnings": ["Bentang B1 9m termasuk panjang, pertimbangkan kolom tengah atau perkuat penampang"],
  "catatan_sni": "Sesuai SNI 03-2847-2019, bangunan 1 lantai zona gempa rendah-menengah"
}
\`\`\``;

  const runAnalysis = async () => {
    const b64 = await getB64(pages[selectedPage]?.pageNum);
    if (!b64) return;
    setStatus('analyzing'); setStreamText(''); setAiResult(null); setStrukturResult(null);
    try {
      const prompt = analysisMode === 'denah' ? PROMPT_DENAH : PROMPT_STRUKTUR(Number(input.lantai)||1);
      const response = await window.claude.complete({
        messages: [{ role: 'user', content: [
          { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: b64 } },
          { type: 'text', text: prompt }
        ]}]
      });
      setStreamText(response);
      const m = response.match(/```json\s*([\s\S]*?)\s*```/);
      if (m) {
        try {
          const parsed = JSON.parse(m[1]);
          if (analysisMode === 'denah') setAiResult(parsed);
          else setStrukturResult(parsed);
          setStatus('done');
        } catch (e) { setStatus('done'); }
      } else setStatus('done');
    } catch (err) {
      setStreamText('Error: ' + err.message); setStatus('error');
    }
  };

  const runBatchAll = async () => {
    if (!pages.length) return;
    setBatchRunning(true); setBatchResults([]); setBatchProgress(0);
    batchCancelRef.current = false;
    const results = [];
    for (let i = 0; i < pages.length; i++) {
      if (batchCancelRef.current) break;
      setBatchProgress(i + 1);
      const pageNum = pages[i].pageNum;
      try {
        const b64 = await getB64(pageNum);
        const response = await window.claude.complete({
          messages: [{ role: 'user', content: [
            { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: b64 } },
            { type: 'text', text: `Halaman ${pageNum}/${pages.length}.\n` + PROMPT_DENAH }
          ]}]
        });
        const m = response.match(/```json\s*([\s\S]*?)\s*```/);
        let parsed = null;
        if (m) { try { parsed = JSON.parse(m[1]); } catch(e){} }
        results.push({ pageNum, result: parsed, raw: response });
        setBatchResults([...results]);
      } catch (err) {
        results.push({ pageNum, result: null, raw: 'Error: ' + err.message });
        setBatchResults([...results]);
      }
    }
    setBatchRunning(false);
  };

  const applyResult = (r) => {
    const u = {};
    if (r.luas > 0) u.luas = r.luas;
    if (r.lantai) u.lantai = r.lantai;
    if (r.kamarTidur > 0) u.kamarTidur = r.kamarTidur;
    if (r.kamarMandi > 0) u.kamarMandi = r.kamarMandi;
    if (r.kelas) u.kelas = r.kelas;
    if (r.catatan) u.catatan = r.catatan;
    if (r.panjang > 0) u.panjang = r.panjang;
    if (r.lebar > 0) u.lebar = r.lebar;
    setInput(p => ({ ...p, ...u }));
    if (onApply) onApply();
  };

  const curPage = pages[selectedPage];

  return (
    <div>
      <div className="info-box mb20">
        <strong>📂 Upload Gambar Kerja / Denah — JPG · PNG · WebP · PDF (maks. 200MB, semua halaman)</strong><br/>
        AI menganalisis gambar secara otomatis: baca dimensi, hitung luas, identifikasi ruangan, rekomendasi struktur SNI.
      </div>

      <div style={{display:'grid',gridTemplateColumns:'340px 1fr',gap:20,alignItems:'start'}}>
        {/* Kiri: Upload + thumbnail */}
        <div>
          {/* Upload zone */}
          <div
            className={`upload-zone ${drag?'drag':''}`}
            style={{padding:curPage?'12px':'36px',cursor:'pointer',minHeight:120}}
            onDragOver={e=>{e.preventDefault();setDrag(true)}}
            onDragLeave={()=>setDrag(false)}
            onDrop={e=>{e.preventDefault();setDrag(false);handleFile(e.dataTransfer.files[0])}}
            onClick={()=>!loadingPdf&&fileRef.current?.click()}
          >
            <input ref={fileRef} type="file" accept="image/*,.pdf" style={{display:'none'}}
              onChange={e=>handleFile(e.target.files[0])}/>
            {loadingPdf ? (
              <div style={{textAlign:'center',padding:'8px 0'}}>
                <div style={{height:6,background:'var(--gray2)',borderRadius:3,overflow:'hidden',marginBottom:10}}>
                  <div style={{height:'100%',background:'var(--accent)',width:loadProgress+'%',transition:'width .3s',borderRadius:3}}/>
                </div>
                <div style={{fontSize:13,color:'var(--gray5)'}}>Memuat PDF... {loadProgress}%</div>
                <div style={{fontSize:11,color:'var(--gray4)',marginTop:3}}>{pages.length} dari ? halaman dirender</div>
              </div>
            ) : curPage ? (
              <>
                <img src={curPage.url} style={{width:'100%',borderRadius:6,display:'block',marginBottom:8}} alt={`Hal ${curPage.pageNum}`}/>
                <div style={{fontSize:11,color:'var(--gray4)',textAlign:'center'}}>
                  {file?.name} • Hal. {curPage.pageNum}/{curPage.total}
                  <span style={{color:'var(--accent)',marginLeft:8}}>Klik ganti</span>
                </div>
              </>
            ) : (
              <>
                <div className="uz-icon">🗺</div>
                <div className="uz-title">Klik atau drag & drop</div>
                <div className="uz-sub">JPG · PNG · WebP · PDF · Maks 200MB</div>
              </>
            )}
          </div>

          {/* Thumbnail strip PDF */}
          {pages.length > 1 && (
            <div style={{marginTop:10}}>
              <div style={{fontSize:11,fontWeight:700,color:'var(--gray5)',textTransform:'uppercase',letterSpacing:.5,marginBottom:6}}>
                {pages.length} Halaman
              </div>
              <div style={{display:'flex',flexWrap:'wrap',gap:5,maxHeight:200,overflowY:'auto'}}>
                {pages.map((p,i)=>(
                  <div key={i} onClick={()=>{setSelectedPage(i);setStatus('idle');setAiResult(null);setStrukturResult(null);}}
                    style={{cursor:'pointer',border:`2px solid ${selectedPage===i?'var(--accent)':'var(--gray2)'}`,
                      borderRadius:5,overflow:'hidden',width:50,flexShrink:0,transition:'all .1s',
                      background:selectedPage===i?'#FFF7ED':'white'}}>
                    <img src={p.url} style={{width:'100%',display:'block'}} alt={`Hal ${p.pageNum}`}/>
                    <div style={{fontSize:9,textAlign:'center',padding:'2px 0',
                      fontWeight:selectedPage===i?700:400,color:selectedPage===i?'var(--accent)':'var(--gray4)'}}>
                      {p.pageNum}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mode selector + action buttons */}
          {pages.length > 0 && (
            <div style={{marginTop:12}}>
              <div style={{display:'flex',gap:6,marginBottom:8}}>
                {[{id:'denah',label:'📐 Analisis Denah'},{id:'struktur',label:'🏛 Rekomendasi Struktur'}].map(m=>(
                  <button key={m.id} className={`btn btn-sm ${analysisMode===m.id?'btn-navy':'btn-outline'}`}
                    style={{flex:1,fontSize:11}} onClick={()=>setAnalysisMode(m.id)}>
                    {m.label}
                  </button>
                ))}
              </div>
              {!batchRunning && (
                <div style={{display:'flex',gap:6}}>
                  <button className="btn btn-primary" style={{flex:1,fontSize:12}} disabled={status==='analyzing'}
                    onClick={runAnalysis}>
                    🤖 Analisis Hal. {curPage?.pageNum}
                  </button>
                  {analysisMode==='denah' && pages.length>1 && (
                    <button className="btn btn-navy btn-sm" onClick={runBatchAll} style={{fontSize:11}}>
                      📋 Semua ({pages.length})
                    </button>
                  )}
                </div>
              )}
              {batchRunning && (
                <div>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'var(--gray6)',marginBottom:5}}>
                    <span>Hal. {batchProgress}/{pages.length}</span>
                    <button className="btn btn-outline btn-sm" onClick={()=>batchCancelRef.current=true} style={{fontSize:10}}>⏹ Stop</button>
                  </div>
                  <div style={{height:6,background:'var(--gray2)',borderRadius:3,overflow:'hidden'}}>
                    <div style={{height:'100%',background:'var(--accent)',borderRadius:3,
                      width:`${(batchProgress/pages.length)*100}%`,transition:'width .3s'}}/>
                  </div>
                </div>
              )}
              {(status==='done'||status==='error') && (
                <button className="btn btn-outline btn-sm mt8" style={{width:'100%'}}
                  onClick={()=>{setStatus('idle');setAiResult(null);setStrukturResult(null);setStreamText('')}}>
                  🔄 Analisis Ulang
                </button>
              )}
            </div>
          )}
        </div>

        {/* Kanan: Hasil AI */}
        <div>
          {/* Idle state */}
          {status==='idle' && !aiResult && !strukturResult && (
            <div className="card text-center" style={{padding:'48px 24px',boxShadow:'none',border:'1.5px dashed var(--gray2)'}}>
              <div style={{fontSize:48,marginBottom:12}}>🤖</div>
              <div style={{fontWeight:700,color:'var(--gray6)',fontSize:15}}>Siap Menganalisis</div>
              <div className="text-sm text-muted mt8">Upload gambar/PDF, pilih mode analisis, klik tombol</div>
              <div style={{marginTop:16,textAlign:'left',background:'var(--gray0)',borderRadius:8,padding:12}}>
                <div style={{fontSize:12,fontWeight:700,color:'var(--gray6)',marginBottom:8}}>Mode Analisis:</div>
                {[
                  ['📐 Denah','Baca luas, dimensi, ruangan, KT/KM → auto-isi form kalkulator'],
                  ['🏛 Struktur SNI','Rekomendasi kolom, sloof, balok sesuai SNI 03-2847-2019'],
                ].map(([t,d])=>(
                  <div key={t} style={{display:'flex',gap:8,marginBottom:6}}>
                    <span style={{fontWeight:700,fontSize:12,color:'var(--accent)',flexShrink:0}}>{t}</span>
                    <span style={{fontSize:11,color:'var(--gray5)'}}>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analyzing */}
          {status==='analyzing' && (
            <div className="ai-result-box">
              <div className="ai-result-header">
                <div className="typing-dots"><span/><span/><span/></div>
                AI membaca gambar {analysisMode==='struktur'?'— analisis struktur SNI':'— analisis denah'}...
              </div>
              <div className="ai-result-body">
                <div className="ai-streaming" style={{minHeight:140}}>{streamText||'Memproses...'}</div>
              </div>
            </div>
          )}

          {/* Denah result */}
          {aiResult && (
            <div className="ai-result-box">
              <div className="ai-result-header" style={{background:aiResult.valid?'var(--navy)':'#92400E'}}>
                {aiResult.valid?'✅ Denah Teranalisis':'⚠️ Gambar Tidak Terbaca'}
                {aiResult.confidence&&<span style={{marginLeft:'auto',fontSize:11,opacity:.7}}>Akurasi: {aiResult.confidence}</span>}
              </div>
              <div className="ai-result-body">
                {!aiResult.valid ? <div className="warn-box">{aiResult.pesan}</div> : (
                  <>
                    <div style={{background:'var(--gray0)',borderRadius:6,padding:'8px 10px',marginBottom:12,fontSize:12}}>
                      <strong>Jenis:</strong> {aiResult.jenisGambar} &nbsp;·&nbsp; <em>{aiResult.pesan}</em>
                    </div>
                    <div className="ai-field-grid">
                      {[
                        ['LUAS',`${aiResult.luas} m²`],['LANTAI',`${aiResult.lantai} Lt`],
                        ['KT',`${aiResult.kamarTidur} KT`],['KM',`${aiResult.kamarMandi} KM`],
                        ...(aiResult.panjang&&aiResult.lebar?[['DIMENSI',`${aiResult.panjang}×${aiResult.lebar} m`],['KELAS',aiResult.kelas]]:[['KELAS',aiResult.kelas]]),
                      ].map(([l,v])=>(
                        <div key={l} className="ai-field">
                          <label>{l}</label>
                          <div className="af-val" style={{fontSize:16}}>{v}</div>
                        </div>
                      ))}
                    </div>
                    {aiResult.ruangan?.length>0&&(
                      <div style={{marginBottom:12}}>
                        <div style={{fontSize:11,fontWeight:700,color:'var(--gray5)',textTransform:'uppercase',marginBottom:6}}>Ruangan ({aiResult.ruangan.length})</div>
                        <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                          {aiResult.ruangan.map((r,i)=>(
                            <span key={i} className="chip" style={{background:'var(--gray1)',color:'var(--gray7)',fontSize:11}}>{r}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {aiResult.catatan&&<div className="info-box mb12" style={{fontSize:11}}><strong>Fitur:</strong> {aiResult.catatan}</div>}
                    <button className="btn btn-green" style={{width:'100%'}} onClick={()=>applyResult(aiResult)}>
                      ✅ Terapkan ke Kalkulator RAB
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Struktur result */}
          {strukturResult && (
            <div className="ai-result-box">
              <div className="ai-result-header" style={{background:'#1E3A8A'}}>
                🏛 Rekomendasi Struktur — SNI 03-2847-2019
              </div>
              <div className="ai-result-body">
                {!strukturResult.valid ? <div className="warn-box">{strukturResult.pesan||'Gambar tidak cukup jelas untuk analisis struktur.'}</div> : (
                  <>
                    <table className="rab-table" style={{marginBottom:12}}>
                      <thead>
                        <tr>
                          <th>Elemen Struktur</th>
                          <th>Ukuran</th>
                          <th className="tar">Jml/Pjg</th>
                          <th>Mutu / Keterangan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {strukturResult.kolom_utama&&(
                          <tr>
                            <td><strong>Kolom Utama (K1)</strong></td>
                            <td>{strukturResult.kolom_utama.ukuran}</td>
                            <td className="tar">{strukturResult.kolom_utama.jumlah} bh</td>
                            <td style={{fontSize:11}}>{strukturResult.kolom_utama.mutu} · {strukturResult.kolom_utama.posisi?.join(', ')}</td>
                          </tr>
                        )}
                        {strukturResult.kolom_praktis&&(
                          <tr>
                            <td><strong>Kolom Praktis (K2)</strong></td>
                            <td>{strukturResult.kolom_praktis.ukuran}</td>
                            <td className="tar">{strukturResult.kolom_praktis.jumlah} bh</td>
                            <td style={{fontSize:11}}>{strukturResult.kolom_praktis.posisi?.join(', ')}</td>
                          </tr>
                        )}
                        {strukturResult.sloof&&(
                          <tr>
                            <td><strong>Sloof</strong></td>
                            <td>{strukturResult.sloof.ukuran}</td>
                            <td className="tar">{strukturResult.sloof.panjang_total_m} m'</td>
                            <td style={{fontSize:11}}>{strukturResult.sloof.keterangan}</td>
                          </tr>
                        )}
                        {strukturResult.ring_balok&&(
                          <tr>
                            <td><strong>Ring Balok</strong></td>
                            <td>{strukturResult.ring_balok.ukuran}</td>
                            <td className="tar">{strukturResult.ring_balok.panjang_total_m} m'</td>
                            <td style={{fontSize:11}}>Keliling atas dinding</td>
                          </tr>
                        )}
                        {strukturResult.balok_induk?.map((b,i)=>(
                          <tr key={i}>
                            <td>Balok Induk {b.label}</td>
                            <td>{b.ukuran}</td>
                            <td className="tar">{b.jumlah} bh · {b.bentang_m}m</td>
                            <td style={{fontSize:11}}>Bentang {b.bentang_m}m</td>
                          </tr>
                        ))}
                        {strukturResult.balok_latei&&(
                          <tr>
                            <td>Balok Latei</td>
                            <td>{strukturResult.balok_latei.ukuran}</td>
                            <td className="tar">{strukturResult.balok_latei.panjang_total_m} m'</td>
                            <td style={{fontSize:11}}>{strukturResult.balok_latei.keterangan}</td>
                          </tr>
                        )}
                        {strukturResult.pondasi&&(
                          <tr>
                            <td>Pondasi</td>
                            <td>{strukturResult.pondasi.lebar_dasar}</td>
                            <td className="tar">kedalaman {strukturResult.pondasi.kedalaman}</td>
                            <td style={{fontSize:11}}>{strukturResult.pondasi.tipe}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                    {strukturResult.warnings?.length>0&&(
                      <div className="warn-box mb12">
                        <strong>⚠️ Perhatian:</strong>
                        <ul style={{marginTop:6,paddingLeft:16}}>
                          {strukturResult.warnings.map((w,i)=><li key={i} style={{fontSize:12}}>{w}</li>)}
                        </ul>
                      </div>
                    )}
                    {strukturResult.catatan_sni&&(
                      <div className="info-box" style={{fontSize:11}}>{strukturResult.catatan_sni}</div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Error fallback */}
          {status==='done' && streamText && !aiResult && !strukturResult && (
            <div className="ai-result-box">
              <div className="ai-result-header" style={{background:'#92400E'}}>⚠️ Parse gagal</div>
              <div className="ai-result-body">
                <div className="ai-streaming">{streamText}</div>
                <div className="warn-box mt12" style={{fontSize:11}}>Coba analisis ulang atau gunakan gambar lebih jelas.</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Batch results */}
      {batchResults.length > 0 && (
        <div className="card mt20">
          <div className="card-title">
            📋 Hasil Analisis Per Halaman
            <span style={{marginLeft:'auto',fontSize:12,fontWeight:400,color:'var(--gray5)'}}>
              {batchResults.length}/{pages.length} halaman
              {batchRunning&&<span style={{marginLeft:8,color:'var(--accent)'}}>⏳ sedang proses...</span>}
            </span>
          </div>
          <div style={{overflowX:'auto'}}>
            <table className="rab-table">
              <thead>
                <tr>
                  <th style={{width:55}}>Hal.</th>
                  <th style={{width:130}}>Jenis</th>
                  <th className="tar" style={{width:75}}>Luas m²</th>
                  <th className="tar" style={{width:55}}>Lt</th>
                  <th className="tar" style={{width:55}}>KT</th>
                  <th className="tar" style={{width:55}}>KM</th>
                  <th style={{width:80}}>Dimensi</th>
                  <th>Ruangan / Catatan</th>
                  <th style={{width:65}}>Akurasi</th>
                  <th className="no-print" style={{width:70}}>Pakai</th>
                </tr>
              </thead>
              <tbody>
                {batchResults.map((br,i)=>{
                  const r=br.result;
                  return (
                    <tr key={i} style={{background:selectedPage===pages.findIndex(p=>p.pageNum===br.pageNum)?'#FFF7ED':''}}>
                      <td>
                        <button style={{all:'unset',cursor:'pointer',color:'var(--accent)',fontWeight:700,fontSize:12}}
                          onClick={()=>setSelectedPage(pages.findIndex(p=>p.pageNum===br.pageNum))}>
                          {br.pageNum}
                        </button>
                      </td>
                      <td style={{fontSize:11}}>{r?.jenisGambar||'—'}</td>
                      <td className="tar font-bold">{r?.luas>0?r.luas:'—'}</td>
                      <td className="tar">{r?.lantai||'—'}</td>
                      <td className="tar">{r?.kamarTidur>0?r.kamarTidur:'—'}</td>
                      <td className="tar">{r?.kamarMandi>0?r.kamarMandi:'—'}</td>
                      <td style={{fontSize:11}}>{r?.panjang&&r?.lebar?`${r.panjang}×${r.lebar}m`:'—'}</td>
                      <td style={{fontSize:11,maxWidth:240}}>
                        {r?.valid?(
                          <span>{r.ruangan?.slice(0,4).join(', ')}{r.ruangan?.length>4?'…':''}</span>
                        ):<span style={{color:'var(--gray4)'}}>{br.raw?.slice(0,50)}</span>}
                      </td>
                      <td>
                        {r?.confidence&&<span className="chip" style={{fontSize:10,
                          background:r.confidence==='tinggi'?'#DCFCE7':r.confidence==='sedang'?'#FEF3C7':'var(--gray1)',
                          color:r.confidence==='tinggi'?'#166534':r.confidence==='sedang'?'#92400E':'var(--gray5)'}}>
                          {r.confidence}
                        </span>}
                      </td>
                      <td className="no-print">
                        {r?.valid&&r?.luas>0&&(
                          <button className="btn btn-green btn-sm" style={{padding:'4px 8px',fontSize:11}}
                            onClick={()=>applyResult(r)}>Pakai</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {batchResults.some(r=>r.result?.valid)&&(
            <div className="success-box mt12">
              <strong>{batchResults.filter(r=>r.result?.valid&&r.result?.luas>0).length} halaman valid</strong> ditemukan.
              Klik <strong>Pakai</strong> pada halaman denah lantai untuk mengisi form kalkulator.
            </div>
          )}
        </div>
      )}

      {/* Volume override */}
      <div className="card mt16">
        <div className="card-title">📏 Input Volume Manual (opsional)</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))',gap:10}}>
          {[
            {k:'volDinding',l:'Luas Dinding (m²)',u:'m²'},{k:'volAtap',l:'Luas Atap (m²)',u:'m²'},
            {k:'volLantai',l:'Luas Lantai (m²)',u:'m²'},{k:'volPlafon',l:'Luas Plafon (m²)',u:'m²'},
            {k:'keliling',l:'Keliling Bangunan (m)',u:'m'},{k:'volPondasi',l:'Vol. Pondasi (m³)',u:'m³'},
          ].map(f=>(
            <div key={f.k} className="form-group">
              <label>{f.l}</label>
              <div className="input-with-unit">
                <input type="number" value={input[f.k]||''} onChange={e=>setInput(p=>({...p,[f.k]:e.target.value}))}/>
                <span className="input-unit">{f.u}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { GambarKerjaTab });
