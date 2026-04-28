
// rab-hasil.jsx — Tab Hasil RAB: editable table, OHP slider, SVG denah, ilustrasi 3D
const { useState, useEffect, useRef, useCallback } = React;

const fmt  = n => new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n);
const fmtS = n => { if(n>=1e9) return `Rp ${(n/1e9).toFixed(2)} M`; if(n>=1e6) return `Rp ${(n/1e6).toFixed(2)} Jt`; return fmt(n); };

// ── Denah Struktural SVG ──────────────────────────────────────
function DenahSVG({ panjang=9, lebar=7, lantai=1 }) {
  const W=480, H=360, PAD=40;
  const scaleX = (W - PAD*2) / panjang;
  const scaleY = (H - PAD*2) / lebar;
  const S = Math.min(scaleX, scaleY);
  const bW = panjang * S, bH = lebar * S;
  const ox = (W - bW) / 2, oy = (H - bH) / 2;

  // Kolom utama: grid max 4m jarak
  const nCX = Math.max(2, Math.ceil(panjang / 3.5));
  const nCY = Math.max(2, Math.ceil(lebar / 3.5));
  const cols = [];
  for(let i=0;i<=nCX;i++) for(let j=0;j<=nCY;j++) {
    cols.push({ x: ox + (i/nCX)*bW, y: oy + (j/nCY)*bH, type: (i===0||i===nCX||j===0||j===nCY)?'K1':'K2' });
  }

  const ukK1 = lantai===1?'20×20':lantai===2?'25×25':'30×30';
  const ukK2 = lantai===1?'15×15':lantai===2?'20×20':'25×25';

  return (
    <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'auto',display:'block'}}>
      <rect width={W} height={H} fill="#FAFAFA"/>
      {/* Grid lines */}
      {Array.from({length:nCX+1}).map((_,i)=>(
        <line key={`gx${i}`} x1={ox+(i/nCX)*bW} y1={oy} x2={ox+(i/nCX)*bW} y2={oy+bH} stroke="#E0E8F0" strokeWidth="1" strokeDasharray="4,4"/>
      ))}
      {Array.from({length:nCY+1}).map((_,j)=>(
        <line key={`gy${j}`} x1={ox} y1={oy+(j/nCY)*bH} x2={ox+bW} y2={oy+(j/nCY)*bH} stroke="#E0E8F0" strokeWidth="1" strokeDasharray="4,4"/>
      ))}
      {/* Sloof / pondasi outline */}
      <rect x={ox-4} y={oy-4} width={bW+8} height={bH+8} fill="none" stroke="#1E3A8A" strokeWidth="4" strokeDasharray="8,4"/>
      {/* Dinding luar */}
      <rect x={ox} y={oy} width={bW} height={bH} fill="rgba(180,200,230,0.08)" stroke="#1A3260" strokeWidth="2.5"/>
      {/* Balok induk garis */}
      {Array.from({length:nCX-1}).map((_,i)=>(
        <line key={`bi${i}`} x1={ox+((i+1)/nCX)*bW} y1={oy} x2={ox+((i+1)/nCX)*bW} y2={oy+bH} stroke="#374151" strokeWidth="2.5" opacity="0.5"/>
      ))}
      {Array.from({length:nCY-1}).map((_,j)=>(
        <line key={`bj${j}`} x1={ox} y1={oy+((j+1)/nCY)*bH} x2={ox+bW} y2={oy+((j+1)/nCY)*bH} stroke="#374151" strokeWidth="2.5" opacity="0.5"/>
      ))}
      {/* Ring balok top */}
      <rect x={ox} y={oy} width={bW} height={bH} fill="none" stroke="#7C3AED" strokeWidth="1.5" strokeDasharray="6,3" opacity="0.6"/>
      {/* Kolom */}
      {cols.map((c,i)=>(
        <g key={i}>
          <rect x={c.x-7} y={c.y-7} width={14} height={14}
            fill={c.type==='K1'?'#DC2626':'#F59E0B'}
            stroke={c.type==='K1'?'#991B1B':'#D97706'}
            strokeWidth="1.5" rx="2"/>
          {c.type==='K1'&&<text x={c.x} y={c.y+4} textAnchor="middle" fontSize="8" fill="white" fontWeight="700">K1</text>}
          {c.type==='K2'&&<text x={c.x} y={c.y+4} textAnchor="middle" fontSize="7" fill="white" fontWeight="700">K2</text>}
        </g>
      ))}
      {/* Dimensi labels */}
      <text x={ox+bW/2} y={oy-14} textAnchor="middle" fontSize="12" fill="#374151" fontWeight="700">{panjang} m</text>
      <text x={ox+bW+16} y={oy+bH/2} textAnchor="middle" fontSize="12" fill="#374151" fontWeight="700" transform={`rotate(90,${ox+bW+16},${oy+bH/2})`}>{lebar} m</text>
      <text x={ox} y={oy-14} textAnchor="start" fontSize="10" fill="#6B7280">DENAH STRUKTURAL ESTIMASI — {lantai} LANTAI</text>
      {/* Legend */}
      <g transform={`translate(${ox},${oy+bH+20})`}>
        {[
          {color:'#DC2626',label:`Kolom Utama K1 (${ukK1})`},
          {color:'#F59E0B',label:`Kolom Praktis K2 (${ukK2})`},
          {color:'#1E3A8A',label:'Sloof / Pondasi'},
          {color:'#374151',label:'Balok Induk'},
          {color:'#7C3AED',label:'Ring Balok'},
        ].map((l,i)=>(
          <g key={i} transform={`translate(${i*88},0)`}>
            <rect x={0} y={0} width={10} height={10} fill={l.color} rx="2"/>
            <text x={14} y={9} fontSize="9" fill="#374151">{l.label}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}

// ── 3D Isometric Illustration ────────────────────────────────
function Isometric3D({ gaya='modern_minimalis', atap='genteng_metal', panjang=9, lebar=7, lantai=1 }) {
  const gayaData = GAYA_ARSITEKTUR.find(g=>g.id===gaya)||GAYA_ARSITEKTUR[0];
  const atapData = JENIS_ATAP.find(a=>a.id===atap)||JENIS_ATAP[0];
  const w=480, h=360;
  // Simple isometric box
  const sc=24, hsc=sc*0.5;
  const bx=Math.min(panjang,12)*sc, bd=Math.min(lebar,10)*sc*0.5, bh=(3+lantai*2.2)*sc;
  const ox=w/2, oy=h-60;
  // Colors based on gaya
  const colors = {
    modern_minimalis:{wall:'#EEEEEE',roof:'#78909C',accent:'#CFD8DC'},
    industrial:{wall:'#9E9E9E',roof:'#546E7A',accent:'#BDBDBD'},
    klasik_colonial:{wall:'#FFF9C4',roof:'#D4722A',accent:'#F5F0E8'},
    tropis_kontemporer:{wall:'#D7CCC8',roof:'#6D4C41',accent:'#A1887F'},
    mediterania:{wall:'#FFF9C4',roof:'#D4722A',accent:'#FFFDE7'},
    japandi:{wall:'#F5F0E8',roof:'#5D4037',accent:'#D7CCC8'},
    art_deco:{wall:'#1A1A2E',roof:'#424242',accent:'#C9A84C'},
    vernakular:{wall:'#F5DEB3',roof:'#8B4513',accent:'#DEB887'},
  }[gaya]||{wall:'#EEEEEE',roof:'#78909C',accent:'#CFD8DC'};

  const roofH = atap==='dak_beton'?0:sc*1.5;
  const pts = {
    // Front face
    fl: [ox-bx, oy],
    fr: [ox, oy+bd],
    br: [ox, oy+bd-bh],
    bl: [ox-bx, oy-bh],
    // Right face
    rr: [ox+bx*0.5, oy+bd*1.5],
    rrTop: [ox+bx*0.5, oy+bd*1.5-bh],
    // Top face
  };
  const poly = arr => arr.map(([x,y])=>`${x},${y}`).join(' ');

  // Front face
  const frontFace = [[ox-bx,oy],[ox,oy+bd],[ox,oy+bd-bh],[ox-bx,oy-bh]];
  // Right face
  const rightFace = [[ox,oy+bd],[ox+bx*0.5,oy+bd*1.5],[ox+bx*0.5,oy+bd*1.5-bh],[ox,oy+bd-bh]];
  // Top face
  const topFace = [[ox-bx,oy-bh],[ox,oy+bd-bh],[ox+bx*0.5,oy+bd*1.5-bh],[ox-bx*0.5,oy+bd*0.5-bh]];
  // Roof
  const roofPeak1 = [ox-bx*0.5, oy+bd*0.25-bh-roofH];
  const roofPeak2 = [ox+bx*0, oy+bd*0.75-bh-roofH];
  const roofFront = [[ox-bx,oy-bh],roofPeak1,[ox,oy+bd-bh]];
  const roofRight = [[ox,oy+bd-bh],roofPeak2,[ox+bx*0.5,oy+bd*1.5-bh]];
  const roofTop   = [roofPeak1,roofPeak2,[ox+bx*0.5,oy+bd*1.5-bh],[ox,oy+bd-bh],[ox-bx,oy-bh]];

  // Windows - front
  const winY = oy - bh*0.55;
  const windows = [
    [[ox-bx*0.75, winY],[ox-bx*0.55, winY],[ox-bx*0.55, winY+sc*0.8],[ox-bx*0.75, winY+sc*0.8]],
    [[ox-bx*0.45, winY],[ox-bx*0.25, winY],[ox-bx*0.25, winY+sc*0.8],[ox-bx*0.45, winY+sc*0.8]],
  ];
  // Door
  const doorX = ox-bx*0.5, doorW=sc*0.7, doorH=sc*1.1;
  const door = [[doorX-doorW/2,oy],[doorX+doorW/2,oy],[doorX+doorW/2,oy-doorH],[doorX-doorW/2,oy-doorH]];

  return (
    <svg viewBox={`0 0 ${w} ${h}`} xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'auto',display:'block'}}>
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E3F2FD"/>
          <stop offset="100%" stopColor="#FAFAFA"/>
        </linearGradient>
      </defs>
      <rect width={w} height={h} fill="url(#skyGrad)"/>
      {/* Ground */}
      <ellipse cx={ox} cy={oy+bd*0.7} rx={bx+bd*0.5} ry={bd*0.5} fill="rgba(0,0,0,0.06)"/>
      {/* Front face */}
      <polygon points={poly(frontFace)} fill={colors.wall} stroke="#ccc" strokeWidth="1"/>
      {/* Right face */}
      <polygon points={poly(rightFace)} fill={colors.accent} stroke="#ccc" strokeWidth="1"/>
      {/* Top / roof base */}
      {atap==='dak_beton'?
        <polygon points={poly(topFace)} fill="#90A4AE" stroke="#ccc" strokeWidth="1"/>:
        <>
          <polygon points={poly(roofTop)} fill={atapData.warna||colors.roof} stroke="#888" strokeWidth="1" opacity="0.9"/>
          <polygon points={poly(roofFront)} fill={colors.roof} stroke="#888" strokeWidth="1"/>
          <polygon points={poly(roofRight)} fill={atapData.warna||colors.roof} stroke="#888" strokeWidth="1" opacity="0.8"/>
        </>
      }
      {/* Windows */}
      {windows.map((pts,i)=>(
        <polygon key={i} points={poly(pts)} fill="#B0C4D8" stroke="#888" strokeWidth="0.8" opacity="0.85"/>
      ))}
      {/* Door */}
      <polygon points={poly(door)} fill="#7B5E4A" stroke="#555" strokeWidth="0.8"/>
      <circle cx={doorX+doorW/2-4} cy={oy-doorH/2} r={2} fill="#C9A84C"/>
      {/* Lantai 2 if any */}
      {lantai>=2 && (
        <line x1={ox-bx} y1={oy-bh*0.5} x2={ox} y2={oy+bd-bh*0.5} stroke="#aaa" strokeWidth="1.5" strokeDasharray="4,3"/>
      )}
      {/* Label */}
      <text x={16} y={20} fontSize="11" fill="#546E7A" fontWeight="700">{gayaData.label} — {atapData.label}</text>
      <text x={16} y={34} fontSize="9" fill="#90A4AE">{panjang}m × {lebar}m · {lantai} lantai · Ilustrasi tidak proporsional</text>
    </svg>
  );
}

// ── Chart Components ──────────────────────────────────────────
function DonutChart({ data }) {
  const ref=useRef(); const cRef=useRef();
  useEffect(()=>{
    if(cRef.current) cRef.current.destroy();
    const ctx=ref.current.getContext('2d');
    cRef.current=new Chart(ctx,{type:'doughnut',data:{labels:data.map(d=>d.label),datasets:[{data:data.map(d=>d.total),backgroundColor:data.map(d=>d.color),borderWidth:2,borderColor:'#fff',hoverOffset:6}]},options:{responsive:true,maintainAspectRatio:false,cutout:'62%',plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>` ${c.label}: ${fmtS(c.raw)}`}}}}});
    return()=>cRef.current?.destroy();
  },[JSON.stringify(data)]);
  return <canvas ref={ref}/>;
}

function BarChart({ data }) {
  const ref=useRef(); const cRef=useRef();
  useEffect(()=>{
    if(cRef.current) cRef.current.destroy();
    const ctx=ref.current.getContext('2d');
    cRef.current=new Chart(ctx,{type:'bar',data:{labels:data.map(d=>d.label.length>14?d.label.slice(0,12)+'…':d.label),datasets:[{label:'Material',data:data.map(d=>d.mat),backgroundColor:'#1E3A8A',borderRadius:4},{label:'Jasa',data:data.map(d=>d.jasa),backgroundColor:'#E07B28',borderRadius:4}]},options:{responsive:true,maintainAspectRatio:false,scales:{x:{stacked:true,ticks:{font:{size:9},maxRotation:38},grid:{display:false}},y:{stacked:true,ticks:{callback:v=>fmtS(v),font:{size:9}},grid:{color:'#E2E8F0'}}},plugins:{legend:{position:'top',labels:{font:{size:10},boxWidth:10}},tooltip:{callbacks:{label:c=>` ${c.dataset.label}: ${fmtS(c.raw)}`}}}}});
    return()=>cRef.current?.destroy();
  },[JSON.stringify(data)]);
  return <canvas ref={ref}/>;
}

// ── Results Tab ───────────────────────────────────────────────
function ResultsTab({ result, input, onOhpChange }) {
  const [expanded, setExpanded] = useState({});
  const [editedItems, setEditedItems] = useState({});
  const [visTab, setVisTab] = useState('denah'); // denah | iso3d | chart
  const toggle = k => setExpanded(p=>({...p,[k]:!p[k]}));

  if (!result) return (
    <div className="card text-center" style={{padding:'60px 24px'}}>
      <div style={{fontSize:48,marginBottom:16}}>📐</div>
      <div style={{fontSize:18,fontWeight:700,color:'var(--gray6)'}}>Belum ada perhitungan</div>
      <div className="text-muted text-sm mt8">Lengkapi form di tab "Input Data" → klik "Hitung RAB"</div>
    </div>
  );

  const editItem = (divId, idx, field, val) => {
    const key = `${divId}_${idx}`;
    setEditedItems(p=>({...p,[key]:{...p[key],[field]:Number(val)}}));
  };
  const getItem = (divId, idx, item) => {
    const key=`${divId}_${idx}`, e=editedItems[key]||{};
    const harga = e.harga??item.harga, vol = e.vol??item.vol;
    const subtotal = vol*harga, mat=subtotal*item.mat, jasa=subtotal*(1-item.mat);
    return {...item, harga, vol, subtotal, mat, jasa, edited:!!(e.harga||e.vol)};
  };

  // Recalculate with edits
  let grandTotal=0;
  const divisi = result.divisi.map(div=>{
    let dTotal=0,dMat=0,dJasa=0;
    const items = div.items.map((item,idx)=>{
      const it=getItem(div.id,idx,item);
      dTotal+=it.subtotal; dMat+=it.mat; dJasa+=it.jasa;
      return it;
    });
    grandTotal+=dTotal;
    return {...div, items, total:dTotal, mat:dMat, jasa:dJasa};
  });
  const ohpPct = Number(input.ohp)||10;
  const ohpAmt = grandTotal*ohpPct/100;
  const grandWithOhp = grandTotal+ohpAmt;
  const totalMat = divisi.reduce((s,d)=>s+d.mat,0);
  const totalJasa = divisi.reduce((s,d)=>s+d.jasa,0);
  const pctMat=(totalMat/grandTotal*100).toFixed(1);
  const pctJasa=(totalJasa/grandTotal*100).toFixed(1);

  const { wilayah, gayaData } = result;
  const panjang=Number(input.panjang)||Math.sqrt(Number(input.luas)||60);
  const lebar=Number(input.lebar)||Math.sqrt(Number(input.luas)||60);
  const gayaLabel = gayaData?.label||'—';
  const atapLabel = JENIS_ATAP.find(a=>a.id===input.atap)?.label||'—';

  return (
    <div>
      {/* Summary cards */}
      <div className="summary-grid">
        {[
          {icon:'🏠',bg:'#EFF6FF',label:'TOTAL + OHP',val:fmtS(grandWithOhp),sub:fmt(grandWithOhp),cls:'accent'},
          {icon:'📐',bg:'#F0FDF4',label:'BIAYA PER M²',val:fmtS(grandTotal/Math.max(1,Number(input.luas))),sub:`sebelum OHP ${ohpPct}%`,cls:'navy'},
          {icon:'🧱',bg:'#F0F4FF',label:'MATERIAL',val:fmtS(totalMat),sub:`${pctMat}% dari total`,cls:''},
          {icon:'👷',bg:'#FFF7ED',label:'JASA/UPAH',val:fmtS(totalJasa),sub:`${pctJasa}% dari total`,cls:''},
        ].map((c,i)=>(
          <div key={i} className="sum-card">
            <div className="sc-icon" style={{background:c.bg}}>{c.icon}</div>
            <div className="sc-label">{c.label}</div>
            <div className={`sc-value ${c.cls}`} style={{fontSize:'clamp(14px,2vw,21px)'}}>{c.val}</div>
            <div className="sc-sub">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Info bar */}
      <div className="card" style={{padding:'12px 20px',display:'flex',flexWrap:'wrap',gap:18,alignItems:'center',marginBottom:0}}>
        {[['Proyek',input.namaProyek],['Dimensi',input.panjang&&input.lebar?`${input.panjang}×${input.lebar}m`:input.luas+'m²'],
          ['Lantai',input.lantai+' lt'],['KT/KM',`${input.kamarTidur}/${input.kamarMandi}`],
          ['Kelas',{ekonomi:'Ekonomi',menengah:'Menengah',mewah:'Mewah'}[input.kelas]],
          ['Gaya',gayaLabel],['Atap',atapLabel],['Wilayah',wilayah?.label],['OHP',ohpPct+'%'],
        ].map(([k,v])=>(
          <div key={k}><div style={{fontSize:9,fontWeight:700,color:'var(--gray4)',textTransform:'uppercase',letterSpacing:.5}}>{k}</div>
          <div style={{fontSize:12,fontWeight:700,color:'var(--gray7)'}}>{v||'—'}</div></div>
        ))}
        <div className="no-print" style={{marginLeft:'auto',display:'flex',gap:8}}>
          <button className="btn btn-outline btn-sm" onClick={()=>window.print()}>🖨 Cetak PDF</button>
        </div>
      </div>

      {/* OHP Slider */}
      <div className="card mt16" style={{padding:'16px 20px'}}>
        <div style={{display:'flex',alignItems:'center',gap:16}}>
          <div style={{fontSize:13,fontWeight:700,color:'var(--gray7)',whiteSpace:'nowrap'}}>OHP (Overhead & Profit)</div>
          <input type="range" min={5} max={25} step={1} value={ohpPct}
            onChange={e=>onOhpChange(Number(e.target.value))} style={{flex:1,accentColor:'var(--accent)'}}/>
          <div style={{fontSize:20,fontWeight:800,color:'var(--accent)',width:52,textAlign:'right'}}>{ohpPct}%</div>
          <div style={{fontSize:13,fontWeight:700,color:'var(--navy)',whiteSpace:'nowrap'}}>{fmtS(ohpAmt)}</div>
        </div>
        <div style={{display:'flex',gap:24,marginTop:10}}>
          <div><span style={{fontSize:11,color:'var(--gray4)'}}>Subtotal RAB: </span><strong>{fmtS(grandTotal)}</strong></div>
          <div><span style={{fontSize:11,color:'var(--gray4)'}}>OHP {ohpPct}%: </span><strong style={{color:'var(--accent)'}}>{fmtS(ohpAmt)}</strong></div>
          <div><span style={{fontSize:11,color:'var(--gray4)'}}>TOTAL: </span><strong style={{color:'var(--navy)',fontSize:15}}>{fmtS(grandWithOhp)}</strong></div>
        </div>
      </div>

      {/* Visualisasi tabs */}
      <div className="card mt16">
        <div style={{display:'flex',gap:8,marginBottom:16}}>
          {[{id:'denah',l:'🏗 Denah Struktural'},{id:'iso3d',l:'🏠 Ilustrasi 3D'},{id:'chart',l:'📊 Grafik Biaya'}].map(t=>(
            <button key={t.id} className={`btn btn-sm ${visTab===t.id?'btn-navy':'btn-outline'}`}
              onClick={()=>setVisTab(t.id)} style={{fontSize:12}}>{t.l}</button>
          ))}
        </div>
        {visTab==='denah'&&(
          <>
            <DenahSVG panjang={panjang} lebar={lebar} lantai={Number(input.lantai)||1}/>
            <div className="info-box mt12" style={{fontSize:11}}>
              Denah struktural estimasi berdasarkan SNI 03-2847-2019. Posisi dan jumlah elemen bersifat ilustratif — konsultasikan dengan insinyur struktur untuk perencanaan aktual.
            </div>
          </>
        )}
        {visTab==='iso3d'&&(
          <>
            <Isometric3D gaya={input.gaya} atap={input.atap} panjang={panjang} lebar={lebar} lantai={Number(input.lantai)||1}/>
            <div className="info-box mt12" style={{fontSize:11}}>
              Ilustrasi 3D isometrik — gaya <strong>{gayaLabel}</strong>, atap <strong>{atapLabel}</strong>. Tidak proporsional, hanya sebagai referensi visual.
            </div>
          </>
        )}
        {visTab==='chart'&&(
          <div className="chart-grid">
            <div>
              <div style={{fontWeight:700,fontSize:13,marginBottom:12,color:'var(--gray7)'}}>Distribusi per Divisi</div>
              <div style={{height:260}}>
                <DonutChart data={divisi.map(d=>({label:d.label.replace('Pekerjaan ',''),total:d.total,color:d.color}))}/>
              </div>
              <div className="legend-grid mt12">
                {divisi.map(d=>(
                  <div key={d.id} className="legend-item">
                    <div className="legend-dot" style={{background:d.color}}/>
                    <span style={{flex:1,fontSize:10}}>{d.label.replace('Pekerjaan ','')}</span>
                    <strong style={{fontSize:10}}>{fmtS(d.total)}</strong>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{fontWeight:700,fontSize:13,marginBottom:12,color:'var(--gray7)'}}>Material vs Jasa per Divisi</div>
              <div style={{height:260}}><BarChart data={divisi.map(d=>({label:d.label.replace('Pekerjaan ',''),mat:d.mat,jasa:d.jasa}))}/></div>
              <div className="flex-row mt12" style={{justifyContent:'center',gap:20}}>
                <div className="legend-item"><div className="legend-dot" style={{background:'#1E3A8A'}}/> Material ({pctMat}%)</div>
                <div className="legend-item"><div className="legend-dot" style={{background:'#E07B28'}}/> Jasa ({pctJasa}%)</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RAB Detail Editable */}
      <div className="card mt20">
        <div className="flex-row spread mb16">
          <div className="card-title" style={{marginBottom:0}}>📋 RAB Detail (klik item untuk edit volume/harga)</div>
          {Object.keys(editedItems).length>0&&(
            <button className="btn btn-outline btn-sm" onClick={()=>setEditedItems({})}>↺ Reset Edit</button>
          )}
        </div>
        <div style={{overflowX:'auto'}}>
          <table className="rab-table">
            <thead>
              <tr>
                <th style={{width:90}}>Kode</th>
                <th>Uraian Pekerjaan</th>
                <th style={{width:50}}>Sat.</th>
                <th className="tar" style={{width:90}}>Volume</th>
                <th className="tar" style={{width:120}}>Harga Sat.</th>
                <th className="tar" style={{width:120}}>Material</th>
                <th className="tar" style={{width:120}}>Jasa</th>
                <th className="tar" style={{width:130}}>Sub Total</th>
              </tr>
            </thead>
            <tbody>
              {divisi.map(div=>(
                <React.Fragment key={div.id}>
                  <tr className="cat-header" onClick={()=>toggle(div.id)}>
                    <td colSpan={7}>
                      <div style={{display:'flex',alignItems:'center',gap:8}}>
                        <div style={{width:8,height:8,borderRadius:2,background:div.color,flexShrink:0}}/>
                        <strong>{div.roman}. {div.label}</strong>
                        <span style={{fontSize:11,color:'var(--gray4)',marginLeft:'auto'}}>{expanded[div.id]?'▲':'▼'} {div.items.length} item</span>
                      </div>
                    </td>
                    <td className="tar"><strong>{fmtS(div.total)}</strong></td>
                  </tr>
                  {expanded[div.id]&&div.items.map((item,idx)=>(
                    <tr key={idx} style={{background:item.edited?'#FFFBEB':''}}>
                      <td style={{fontSize:10,color:'var(--gray4)',paddingLeft:18}}>{item.kode}</td>
                      <td style={{paddingLeft:18,fontSize:12}}>{item.uraian}{item.edited&&<span style={{marginLeft:6,fontSize:9,color:'var(--accent)',fontWeight:700}}>✏ EDITED</span>}</td>
                      <td style={{color:'var(--gray5)',fontSize:11}}>{item.satuan}</td>
                      <td className="tar">
                        <input type="number" value={item.vol||0} min={0} step={0.01}
                          onChange={e=>editItem(div.id,idx,'vol',e.target.value)}
                          style={{width:72,textAlign:'right',border:'1px solid var(--gray2)',borderRadius:4,padding:'3px 5px',fontSize:12,fontFamily:'inherit'}}/>
                      </td>
                      <td className="tar">
                        <input type="number" value={Math.round(item.harga)||0} min={0}
                          onChange={e=>editItem(div.id,idx,'harga',e.target.value)}
                          style={{width:100,textAlign:'right',border:'1px solid var(--gray2)',borderRadius:4,padding:'3px 5px',fontSize:12,fontFamily:'inherit'}}/>
                      </td>
                      <td className="tar text-sm">{fmtS(item.mat)}</td>
                      <td className="tar text-sm">{fmtS(item.jasa)}</td>
                      <td className="tar font-bold text-sm">{fmtS(item.subtotal)}</td>
                    </tr>
                  ))}
                  <tr className="subtotal-row">
                    <td colSpan={5} style={{paddingLeft:18,fontSize:11}}>Subtotal {div.label}</td>
                    <td className="tar text-sm">{fmtS(div.mat)}</td>
                    <td className="tar text-sm">{fmtS(div.jasa)}</td>
                    <td className="tar font-bold">{fmtS(div.total)}</td>
                  </tr>
                </React.Fragment>
              ))}
              <tr style={{background:'var(--gray1)'}}>
                <td colSpan={5} style={{fontWeight:700,padding:'10px 14px'}}>Subtotal RAB (sebelum OHP)</td>
                <td className="tar font-bold">{fmtS(totalMat)}</td>
                <td className="tar font-bold">{fmtS(totalJasa)}</td>
                <td className="tar font-bold">{fmtS(grandTotal)}</td>
              </tr>
              <tr style={{background:'#FFF7ED'}}>
                <td colSpan={7} style={{fontWeight:700,padding:'10px 14px',color:'var(--accent)'}}>OHP {ohpPct}% (Overhead & Profit)</td>
                <td className="tar font-bold" style={{color:'var(--accent)'}}>{fmtS(ohpAmt)}</td>
              </tr>
              <tr className="total-row">
                <td colSpan={7}><strong>TOTAL RENCANA ANGGARAN BIAYA</strong></td>
                <td className="tar"><strong>{fmtS(grandWithOhp)}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="warn-box mt16" style={{fontSize:11}}>
          <strong>Catatan:</strong> Volume otomatis berdasarkan proporsi standar AHSP. Klik langsung pada angka volume/harga untuk mengedit. 
          Disarankan tambahkan <strong>contingency 10–15%</strong> untuk biaya tak terduga. 
          Konsultasikan RAB ini dengan quantity surveyor atau kontraktor sebelum pelaksanaan.
        </div>
      </div>
    </div>
  );
}

// ── Compare Tab ───────────────────────────────────────────────
function CompareTab({ input }) {
  const kelas=['ekonomi','menengah','mewah'];
  const labels={ekonomi:'Ekonomi',menengah:'Menengah',mewah:'Mewah'};
  const wilayah=WILAYAH.find(w=>w.id===input.wilayahId)||WILAYAH[1];
  const L=Number(input.luas)||60, lnt=Number(input.lantai)||1;
  const detResults=kelas.map(k=>calcRABDetail({...input,kelas:k}));
  const canvasRef=useRef(); const cRef=useRef();
  useEffect(()=>{
    if(cRef.current) cRef.current.destroy();
    const ctx=canvasRef.current.getContext('2d');
    cRef.current=new Chart(ctx,{type:'bar',data:{
      labels:detResults[0].divisi.map(d=>d.label.replace('Pekerjaan ','')),
      datasets:detResults.map((r,i)=>({label:labels[kelas[i]],data:r.divisi.map(d=>d.total),
        backgroundColor:['#1E3A8A88','#0E749088','#E07B2888'][i],borderColor:['#1E3A8A','#0E7490','#E07B28'][i],borderWidth:2,borderRadius:3}))
    },options:{responsive:true,maintainAspectRatio:false,scales:{x:{ticks:{font:{size:9},maxRotation:45},grid:{display:false}},y:{ticks:{callback:v=>fmtS(v),font:{size:10}}}},plugins:{legend:{position:'top',labels:{font:{size:11},boxWidth:10}}}}});
    return()=>cRef.current?.destroy();
  },[L,lnt,input.wilayahId,input.gaya,input.atap]);

  return (
    <div>
      <div className="info-box mb20">
        Perbandingan untuk <strong>{L} m²</strong>, <strong>{lnt} lantai</strong>,
        wilayah <strong>{wilayah.label}</strong>, gaya <strong>{GAYA_ARSITEKTUR.find(g=>g.id===input.gaya)?.label||'—'}</strong>,
        atap <strong>{JENIS_ATAP.find(a=>a.id===input.atap)?.label||'—'}</strong>
      </div>
      <div className="compare-grid mb20">
        {detResults.map((r,i)=>{
          const k=kelas[i];
          const hdr={ekonomi:'#0F1F3D',menengah:'#1A3260',mewah:'#E07B28'}[k];
          const badge={ekonomi:['#DCFCE7','#166534'],menengah:['#DBEAFE','#1E40AF'],mewah:['#FEF3C7','#92400E']}[k];
          const ohpAmt=r.grandTotal*(Number(input.ohp)||10)/100;
          return (
            <div key={k} className="compare-col">
              <div className="compare-header" style={{background:hdr}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                  <div><h3>{labels[k]}</h3><p style={{fontSize:11,opacity:.6}}>× {wilayah.indeks.toFixed(2)}</p></div>
                  <span style={{background:badge[0],color:badge[1],fontSize:10,fontWeight:800,padding:'3px 8px',borderRadius:20}}>{k.toUpperCase()}</span>
                </div>
              </div>
              <div className="compare-body">
                {r.divisi.slice(0,7).map(d=>(
                  <div key={d.id} className="compare-row">
                    <span style={{color:'var(--gray5)',display:'flex',alignItems:'center',gap:5,fontSize:11}}>
                      <span style={{width:6,height:6,background:d.color,display:'inline-block',borderRadius:1}}/>
                      {d.label.replace('Pekerjaan ','')}
                    </span>
                    <span style={{fontWeight:700,fontSize:12}}>{fmtS(d.total)}</span>
                  </div>
                ))}
              </div>
              <div className="compare-total">
                <div style={{fontSize:10,fontWeight:700,color:'var(--gray4)',textTransform:'uppercase'}}>Total + OHP {input.ohp||10}%</div>
                <div style={{fontSize:19,fontWeight:800,color:hdr,marginTop:2}}>{fmtS(r.grandTotal+ohpAmt)}</div>
                <div style={{fontSize:12,color:'var(--accent)',fontWeight:600,marginTop:1}}>{fmtS((r.grandTotal+ohpAmt)/Math.max(1,L))}/m²</div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="card">
        <div className="card-title">📊 Perbandingan per Divisi</div>
        <div style={{height:340}}><canvas ref={canvasRef}/></div>
      </div>
      <div className="card mt16">
        <div className="card-title">📋 Ringkasan Selisih</div>
        <div style={{overflowX:'auto'}}>
          <table className="rab-table">
            <thead><tr><th>Kelas</th><th className="tar">Total + OHP</th><th className="tar">Per m²</th><th className="tar">Selisih vs Ekonomi</th><th className="tar">Material</th><th className="tar">Jasa</th></tr></thead>
            <tbody>
              {detResults.map((r,i)=>{
                const tot=r.grandTotal*(1+(Number(input.ohp)||10)/100);
                return (
                  <tr key={kelas[i]}>
                    <td><strong>{labels[kelas[i]]}</strong></td>
                    <td className="tar font-bold">{fmtS(tot)}</td>
                    <td className="tar">{fmtS(tot/Math.max(1,L))}</td>
                    <td className="tar">{i===0?<span className="chip" style={{background:'var(--gray1)',color:'var(--gray5)'}}>Acuan</span>:
                      <span className="chip" style={{background:'#FEE2E2',color:'#991B1B'}}>+{fmtS(tot-detResults[0].grandTotal*(1+(Number(input.ohp)||10)/100))}</span>}</td>
                    <td className="tar text-sm">{fmtS(r.totalMat)}</td>
                    <td className="tar text-sm">{fmtS(r.totalJasa)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ResultsTab, CompareTab, DenahSVG, Isometric3D });
