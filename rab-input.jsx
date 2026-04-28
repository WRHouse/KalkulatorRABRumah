
// rab-input.jsx — Tab Input Data: P×L, Gaya Arsitektur, Jenis Atap
// Requires: React, rab-data.js loaded globally

function InputTab({ input, setInput, onCalc }) {
  const [step, setStep] = React.useState(1);
  const upd = (k, v) => setInput(p => ({ ...p, [k]: v }));

  // Auto-compute luas from P×L
  React.useEffect(() => {
    const p = Number(input.panjang), l = Number(input.lebar);
    if (p > 0 && l > 0) upd('luas', Math.round(p * l * 10) / 10);
  }, [input.panjang, input.lebar]);

  const wilayah = WILAYAH.find(w => w.id === input.wilayahId);
  const gayaData = GAYA_ARSITEKTUR.find(g => g.id === input.gaya);
  const atapData = JENIS_ATAP.find(a => a.id === input.atap);

  const step1Ok = input.namaProyek && Number(input.luas) > 0;
  const step2Ok = !!input.kelas && !!input.gaya && !!input.atap;
  const step3Ok = !!input.wilayahId;

  const CLASSES = [
    { id:'ekonomi',  badge:'EKONOMI',  bBg:'#DCFCE7', bCol:'#166534', name:'Tipe Ekonomi',  range:'Tipe 21–36 m²',  price:HARGA_M2_BASE.ekonomi,  desc:'Spec sederhana & fungsional' },
    { id:'menengah', badge:'MENENGAH', bBg:'#DBEAFE', bCol:'#1E40AF', name:'Tipe Menengah', range:'Tipe 45–70 m²',  price:HARGA_M2_BASE.menengah, desc:'Spec menengah, material baik' },
    { id:'mewah',    badge:'MEWAH',    bBg:'#FEF3C7', bCol:'#92400E', name:'Tipe Mewah',    range:'Tipe 100 m²+',   price:HARGA_M2_BASE.mewah,    desc:'Spec premium, finishing tinggi' },
  ];

  const fmtS = n => {
    if(n>=1e9) return `Rp ${(n/1e9).toFixed(2)} M`;
    if(n>=1e6) return `Rp ${(n/1e6).toFixed(1)} Jt`;
    return `Rp ${n.toLocaleString('id-ID')}`;
  };

  return (
    <div>
      {/* Step bar */}
      <div className="step-bar">
        {[{n:1,l:'Data Proyek'},{n:2,l:'Gaya & Material'},{n:3,l:'Wilayah & Metode'}].map((s,i)=>(
          <React.Fragment key={s.n}>
            {i>0 && <div className={`step-sep ${step>s.n?'done':''}`}/>}
            <div className="step-item">
              <div className={`step-circle ${step>s.n?'done':step===s.n?'active':'todo'}`}>{step>s.n?'✓':s.n}</div>
              <span className={`step-label ${step===s.n?'active':''}`}>{s.l}</span>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* ── STEP 1: Data Proyek ── */}
      {step === 1 && (
        <div className="card">
          <div className="section-title">Informasi Proyek</div>
          <div className="form-grid mt12">
            <div className="form-group" style={{gridColumn:'1/-1'}}>
              <label>NAMA PROYEK</label>
              <input type="text" value={input.namaProyek} onChange={e=>upd('namaProyek',e.target.value)}
                placeholder="Contoh: Rumah Pak Budi — Depok 2025"/>
            </div>
          </div>

          {/* P × L input */}
          <div className="section-title mt20">Dimensi Bangunan</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr auto 1fr auto 1fr',gap:10,alignItems:'end',marginTop:12}}>
            <div className="form-group">
              <label>PANJANG BANGUNAN</label>
              <div className="input-with-unit">
                <input type="number" value={input.panjang||''} onChange={e=>upd('panjang',e.target.value)}
                  placeholder="mis. 10" min="1" max="200"/>
                <span className="input-unit">m</span>
              </div>
            </div>
            <div style={{textAlign:'center',fontWeight:800,fontSize:22,color:'var(--gray4)',paddingBottom:10}}>×</div>
            <div className="form-group">
              <label>LEBAR BANGUNAN</label>
              <div className="input-with-unit">
                <input type="number" value={input.lebar||''} onChange={e=>upd('lebar',e.target.value)}
                  placeholder="mis. 8" min="1" max="100"/>
                <span className="input-unit">m</span>
              </div>
            </div>
            <div style={{textAlign:'center',fontWeight:800,fontSize:22,color:'var(--gray4)',paddingBottom:10}}>=</div>
            <div className="form-group">
              <label>LUAS BANGUNAN (auto)</label>
              <div className="input-with-unit">
                <input type="number" value={input.luas||''} onChange={e=>upd('luas',e.target.value)}
                  placeholder="0" min="10" max="10000"
                  style={{background: (Number(input.panjang)>0&&Number(input.lebar)>0)?'#F0FDF4':'white',
                    borderColor:(Number(input.panjang)>0&&Number(input.lebar)>0)?'#22C55E':'var(--gray2)',fontWeight:700}}/>
                <span className="input-unit">m²</span>
              </div>
            </div>
          </div>
          {Number(input.panjang)>0 && Number(input.lebar)>0 && (
            <div className="success-box mt8" style={{fontSize:11}}>
              Luas dihitung otomatis: {input.panjang} × {input.lebar} = <strong>{input.luas} m²</strong>
              {Number(input.lantai)>1&&` × ${input.lantai} lantai = ${Number(input.luas)*Number(input.lantai)} m² total`}
            </div>
          )}

          <div className="divider"/>
          <div className="form-grid">
            <div className="form-group">
              <label>JUMLAH LANTAI</label>
              <div style={{display:'flex',gap:8}}>
                <select value={input.lantai} onChange={e=>upd('lantai',Number(e.target.value))} style={{flex:1}}>
                  <option value={1}>1 Lantai</option>
                  <option value={2}>2 Lantai (hemat ~8%/m²)</option>
                  <option value={3}>3 Lantai (hemat ~13%/m²)</option>
                </select>
                <input type="number" min={1} max={20} value={input.lantai||''} onChange={e=>upd('lantai',Number(e.target.value))} style={{width:72}} placeholder="jml"/>
              </div>
            </div>
            <div className="form-group">
              <label>KAMAR TIDUR</label>
              <div style={{display:'flex',gap:8}}>
                <select value={[1,2,3,4,5,6].includes(Number(input.kamarTidur))?input.kamarTidur:'c'} onChange={e=>e.target.value!=='c'&&upd('kamarTidur',Number(e.target.value))} style={{flex:1}}>
                  {[1,2,3,4,5,6].map(n=><option key={n} value={n}>{n} KT</option>)}
                  <option value="c">Lainnya…</option>
                </select>
                <input type="number" min={1} max={20} value={input.kamarTidur||''} onChange={e=>upd('kamarTidur',Number(e.target.value))} style={{width:72}} placeholder="jml"/>
              </div>
            </div>
            <div className="form-group">
              <label>KAMAR MANDI</label>
              <div style={{display:'flex',gap:8}}>
                <select value={[1,2,3,4,5].includes(Number(input.kamarMandi))?input.kamarMandi:'c'} onChange={e=>e.target.value!=='c'&&upd('kamarMandi',Number(e.target.value))} style={{flex:1}}>
                  {[1,2,3,4,5].map(n=><option key={n} value={n}>{n} KM</option>)}
                  <option value="c">Lainnya…</option>
                </select>
                <input type="number" min={1} max={20} value={input.kamarMandi||''} onChange={e=>upd('kamarMandi',Number(e.target.value))} style={{width:72}} placeholder="jml"/>
              </div>
            </div>
            <div className="form-group" style={{gridColumn:'1/-1'}}>
              <label>CATATAN KHUSUS</label>
              <textarea rows={2} value={input.catatan} onChange={e=>upd('catatan',e.target.value)}
                placeholder="Carport, kolam, teras, dll..." style={{resize:'vertical'}}/>
            </div>
          </div>
          <div className="flex-row mt20" style={{justifyContent:'flex-end'}}>
            <button className="btn btn-primary" disabled={!step1Ok} onClick={()=>setStep(2)}>Lanjut — Gaya & Material ›</button>
          </div>
        </div>
      )}

      {/* ── STEP 2: Kelas + Gaya + Atap ── */}
      {step === 2 && (
        <div className="card">
          {/* Kelas */}
          <div className="section-title">Kelas / Tipe Bangunan</div>
          <div className="class-grid mt12">
            {CLASSES.map(c=>(
              <div key={c.id} className={`class-card ${input.kelas===c.id?'selected':''}`} onClick={()=>upd('kelas',c.id)}>
                <span className="cc-badge" style={{background:c.bBg,color:c.bCol}}>{c.badge}</span>
                <div className="cc-name">{c.name}</div>
                <div className="cc-range">{c.range}</div>
                <div className="cc-price">{fmtS(c.price)}/m²</div>
                <div className="text-xs text-muted mt4">{c.desc}</div>
              </div>
            ))}
          </div>

          {/* Gaya Arsitektur */}
          <div className="section-title mt24">Gaya Arsitektur</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,marginTop:12}}>
            {GAYA_ARSITEKTUR.map(g=>(
              <div key={g.id}
                onClick={()=>upd('gaya',g.id)}
                style={{border:`2px solid ${input.gaya===g.id?'var(--accent)':'var(--gray2)'}`,
                  borderRadius:10, cursor:'pointer', overflow:'hidden',
                  background:input.gaya===g.id?'#FFF7ED':'white',
                  transition:'all .15s', boxShadow:input.gaya===g.id?'0 0 0 3px rgba(224,123,40,.15)':'none'}}>
                <div dangerouslySetInnerHTML={{__html:g.svg}} style={{lineHeight:0}}/>
                <div style={{padding:'8px 10px'}}>
                  <div style={{fontSize:12,fontWeight:700,color:'var(--gray8)'}}>{g.label}</div>
                  <div style={{fontSize:10,color:'var(--gray4)',marginTop:2,lineHeight:1.3}}>{g.keywords}</div>
                  {g.finishing_mult!==1.0&&(
                    <div style={{fontSize:10,marginTop:4,fontWeight:600,
                      color:g.finishing_mult>1?'#991B1B':'#166534'}}>
                      {g.finishing_mult>1?`+${((g.finishing_mult-1)*100).toFixed(0)}%`:
                       `-${((1-g.finishing_mult)*100).toFixed(0)}%`} biaya finishing
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          {gayaData && (
            <div className="info-box mt12" style={{fontSize:11}}>
              <strong>Material rekomendasi {gayaData.label}:</strong> {gayaData.material_hint}
            </div>
          )}

          {/* Jenis Atap */}
          <div className="section-title mt24">Jenis Atap</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,marginTop:12}}>
            {JENIS_ATAP.map(a=>{
              const isRecommended = gayaData?.atap_cocok?.includes(a.id);
              return (
                <div key={a.id}
                  onClick={()=>upd('atap',a.id)}
                  style={{border:`2px solid ${input.atap===a.id?'var(--accent)':'var(--gray2)'}`,
                    borderRadius:10, cursor:'pointer', padding:'12px',
                    background:input.atap===a.id?'#FFF7ED':'white',
                    transition:'all .15s', position:'relative'}}>
                  {isRecommended && (
                    <div style={{position:'absolute',top:6,right:6,background:'#DCFCE7',color:'#166534',
                      fontSize:9,fontWeight:700,padding:'1px 5px',borderRadius:10}}>✓ Cocok</div>
                  )}
                  <div style={{width:24,height:24,borderRadius:6,background:a.warna,marginBottom:8}}/>
                  <div style={{fontSize:12,fontWeight:700,color:'var(--gray8)'}}>{a.label}</div>
                  <div style={{fontSize:11,fontWeight:700,color:'var(--accent)',marginTop:2}}>
                    {fmtS(a.harga_m2)}/m²
                  </div>
                  <div style={{fontSize:10,color:'var(--gray5)',marginTop:4,lineHeight:1.4}}>{a.desc}</div>
                </div>
              );
            })}
          </div>
          {atapData && (
            <div className="warn-box mt12" style={{fontSize:11}}>
              <strong>Catatan struktur:</strong> {atapData.struktur_hint}
            </div>
          )}

          {/* OHP Slider */}
          <div className="section-title mt24">Overhead & Profit (OHP)</div>
          <div style={{display:'flex',alignItems:'center',gap:16,marginTop:12}}>
            <input type="range" min={5} max={25} step={1} value={input.ohp||10}
              onChange={e=>upd('ohp',Number(e.target.value))}
              style={{flex:1,accentColor:'var(--accent)'}}/>
            <div style={{fontSize:18,fontWeight:800,color:'var(--accent)',width:56,textAlign:'right'}}>
              {input.ohp||10}%
            </div>
          </div>
          <div className="text-xs text-muted mt4">
            Standar: Kontraktor 10–15% · Proyek pemerintah maks 15% · Premium 20%
          </div>

          <div className="flex-row mt20" style={{justifyContent:'space-between'}}>
            <button className="btn btn-outline" onClick={()=>setStep(1)}>‹ Kembali</button>
            <button className="btn btn-primary" disabled={!step2Ok} onClick={()=>setStep(3)}>Lanjut — Wilayah ›</button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Wilayah ── */}
      {step === 3 && (
        <div className="card">
          <div className="section-title">Wilayah & Metode Pelaksanaan</div>
          <div className="form-grid mt12">
            <div className="form-group" style={{gridColumn:'1/-1'}}>
              <label>KOTA / WILAYAH</label>
              <select value={input.wilayahId} onChange={e=>upd('wilayahId',e.target.value)}>
                {WILAYAH.map(w=><option key={w.id} value={w.id}>{w.label} — Indeks {w.indeks.toFixed(2)}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>TAHUN ANGGARAN</label>
              <select value={input.tahun} onChange={e=>upd('tahun',e.target.value)}>
                {['2024','2025','2026'].map(y=><option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>METODE PELAKSANAAN</label>
              <select value={input.metode} onChange={e=>upd('metode',e.target.value)}>
                <option value="kontraktor">Kontraktor (lump sum)</option>
                <option value="mandor">Mandor + beli material sendiri</option>
                <option value="harian">Upah harian + material sendiri</option>
              </select>
            </div>
          </div>
          {wilayah && (
            <div className="warn-box mt16">
              <strong>Indeks {wilayah.label}: {wilayah.indeks.toFixed(2)}</strong> —{' '}
              {wilayah.indeks>1?`${((wilayah.indeks-1)*100).toFixed(0)}% lebih mahal dari Jabodetabek`:
               wilayah.indeks<1?`${((1-wilayah.indeks)*100).toFixed(0)}% lebih murah dari Jabodetabek`:
               'Referensi baseline AHSP'}
            </div>
          )}

          {/* Summary box before calc */}
          <div style={{background:'var(--navy)',borderRadius:10,padding:16,marginTop:16,color:'white'}}>
            <div style={{fontSize:12,opacity:.6,marginBottom:8}}>RINGKASAN PROYEK</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
              {[
                ['Proyek', input.namaProyek||'—'],
                ['Dimensi', input.panjang&&input.lebar?`${input.panjang}×${input.lebar}m = ${input.luas}m²`:input.luas?`${input.luas} m²`:'—'],
                ['Lantai', `${input.lantai} lantai`],
                ['KT / KM', `${input.kamarTidur} KT / ${input.kamarMandi} KM`],
                ['Kelas', {ekonomi:'Ekonomi',menengah:'Menengah',mewah:'Mewah'}[input.kelas]||'—'],
                ['Gaya', GAYA_ARSITEKTUR.find(g=>g.id===input.gaya)?.label||'—'],
                ['Atap', JENIS_ATAP.find(a=>a.id===input.atap)?.label||'—'],
                ['OHP', `${input.ohp||10}%`],
                ['Wilayah', wilayah?.label||'—'],
              ].map(([k,v])=>(
                <div key={k}><div style={{fontSize:10,opacity:.5,textTransform:'uppercase',letterSpacing:.5}}>{k}</div>
                <div style={{fontSize:13,fontWeight:700,marginTop:2}}>{v}</div></div>
              ))}
            </div>
          </div>

          <div className="flex-row mt20" style={{justifyContent:'space-between'}}>
            <button className="btn btn-outline" onClick={()=>setStep(2)}>‹ Kembali</button>
            <button className="btn btn-primary" disabled={!step3Ok} onClick={onCalc}>⚡ Hitung RAB Sekarang</button>
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { InputTab });
