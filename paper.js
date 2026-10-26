// ตัวแสดงแบบฟอร์มหน้ากระดาษ (ใช้ร่วมกันทั้ง index.html และ admin.html)
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
document.head.insertAdjacentHTML('beforeend', `<link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap" rel="stylesheet"><style>
body{font-family:Sarabun,system-ui,sans-serif;background:#e9ebf0;margin:0;padding:10px}
.paper{width:210mm;max-width:100%;min-height:297mm;margin:10px auto;padding:14mm 16mm;background:#fff;box-sizing:border-box;font-size:15px;line-height:1.9;box-shadow:0 2px 10px #0003}
.paper p{margin:0}.hd{text-align:center;font-weight:700}.hd img{height:70px}.r{text-align:right}
.in{border:0;border-bottom:1px dotted #000;font:inherit;background:#eef3ff;padding:0 4px;box-sizing:border-box;vertical-align:baseline}
textarea.in{width:100%;line-height:1.7}
.v{border-bottom:1px dotted #000;display:inline-block;min-width:60px;padding:0 6px;font-weight:700;color:#124}
div.v{display:block}
.g{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:10px;font-size:14px}
.ab{border:1px solid #000;padding:8px;margin-bottom:12px;text-align:center}
.sgb{min-height:48px;border-bottom:1px dotted #000;width:75%}
.sg{max-height:56px;max-width:100%;mix-blend-mode:multiply}
.np{margin:6px auto;max-width:210mm}
.view .v{display:inline-block;box-sizing:border-box;min-height:1.5em;padding:0 4px;color:#000;font-weight:400;border-bottom:1px dotted #000;vertical-align:bottom}
.view .va{display:block;min-height:3.8em;white-space:pre-wrap;background:repeating-linear-gradient(90deg,#000 0 1px,transparent 1px 3px) 0 calc(1.9em - 1px)/100% 1px no-repeat,repeating-linear-gradient(90deg,#000 0 1px,transparent 1px 3px) 0 calc(3.8em - 1px)/100% 1px no-repeat}
.view .ab{text-align:left;padding:6px 10px;font-size:13px;line-height:1.75;break-inside:avoid}.view .ck{text-align:center}.view .ctr{text-align:center}
.view .dl{border-bottom:1px dotted #000;min-height:1.75em}
.view .sgl{display:inline-block;width:46%;min-height:1.9em;border-bottom:1px dotted #000;text-align:center;vertical-align:bottom;margin:0 3px}
.view .sg{max-height:44px}
.sb{display:grid;grid-template-columns:auto minmax(0,1fr) auto;column-gap:6px;align-items:end}
.sb .sgl,.sb .sgu{display:block;width:auto;margin:0;min-height:1.9em;border-bottom:1px dotted #000;text-align:center}
.sb .sgu input{width:100%;font-size:12px}.sb .sc{grid-column:2;text-align:center;margin-top:2px}.nw{white-space:nowrap}
@media(min-width:701px){.g{grid-template-columns:1.2fr 1fr}}
@media(max-width:700px){.g{grid-template-columns:1fr}.paper{padding:10px}.nw{white-space:normal}}
@media print{body{background:#fff;padding:0}.np{display:none!important}.paper{box-shadow:none;margin:0;padding:10mm 14mm;min-height:0;font-size:13.5px;line-height:1.75}*{-webkit-print-color-adjust:exact;print-color-adjust:exact}.in{background:none}@page{size:A4;margin:0}}
</style>`);

function renderPaper(form, o) {
  const edit = o.mode == 'edit', d = o.data || {};
  return `<div class="paper${edit ? '' : ' view'}">` + (form.template || '').replace(/\{\{(\w+)\|(\w+)(?:\|([^}]*))?\}\}/g, (m, k, t, x) => {
    if (!edit) { // โหมดดู/พิมพ์: จัดหน้าให้เหมือนต้นฉบับ
      const D8 = v => /^\d{4}-\d\d-\d\d$/.test(v) ? v.slice(8) + '/' + v.slice(5, 7) + '/' + v.slice(0, 4) : v;
      const sl = img => `<span class="sgl">${img ? `<img class="sg" src="${img}">` : ''}</span>`;
      if (t == 'appr') {
        const A = (form.approvers || [])[k - 1] || {}, R = (o.approvals || [])[k - 1] || {};
        return `<div class="ab"><div>${esc(A.title)}</div><div class="ck">${R.status == 'approved' ? '☑' : '☐'} อนุมัติ &emsp;&emsp; ${R.status == 'rejected' ? '☑' : '☐'} ไม่อนุมัติ</div><div class="dl">${esc(R.reason)}</div><div class="dl"></div><div style="padding-left:20%;margin-top:6px">ลงชื่อ${sl(R.sig)}</div><div class="ctr">${esc(A.name)}</div><div class="ctr">${esc(A.pos)}</div></div>`;
      }
      if (t == 'sig') return `<div class="sb"><span>ลงชื่อ</span>${sl(d[k])}<span class="nw">${esc(x)}</span><div class="sc">( <span class="v" style="min-width:75%;text-align:center">${esc(d[k + 'Name'])}</span> )</div><div class="sc"><span class="v" style="min-width:55%;text-align:center">${esc(D8(d[k + 'Date'] || ''))}</span></div></div>`;
      if (t == 'area') return `<div class="dl" style="white-space:pre-wrap">${esc(d[k])}</div><div class="dl"></div>`;
      if (t != 'radio') return `<span class="v" style="width:${x || 60}%">${esc(t == 'date' ? D8(d[k]) : d[k])}</span>`;
    }
    if (t == 'appr') {
      const A = (form.approvers || [])[k - 1] || {}, R = (o.approvals || [])[k - 1] || {};
      return `<div class="ab"><b>${esc(A.title)}</b><br>${R.status == 'approved' ? '☑' : '☐'} อนุมัติ &nbsp; ${R.status == 'rejected' ? '☑' : '☐'} ไม่อนุมัติ<br><i>${esc(R.reason)}</i><br>${R.sig ? `<img class="sg" src="${R.sig}">` : '<br>'}<br>ลงชื่อ.........................<br>${esc(A.name)}<br>${esc(A.pos)}</div>`;
    }
    if (t == 'sig') return `<div class="sb"><span>ลงชื่อ</span><span class="sgu"><input type="file" name="${k}" accept="image/*" required onchange="this.nextElementSibling.src=URL.createObjectURL(this.files[0])"><img class="sg"></span><span class="nw">${esc(x)}</span><div class="sc">( <input class="in" name="${k}Name" required style="width:70%" placeholder="ชื่อ-นามสกุล"> )</div><div class="sc"><input class="in" type="date" name="${k}Date" required style="width:60%"></div></div>`;
    if (t == 'radio') return (x || '').split(',').map((s, i) => edit ? `<label><input type="radio" name="${k}" value="${esc(s)}" ${i ? '' : 'required'}> ${esc(s)}</label> &nbsp;` : `${d[k] == s ? '◉' : '○'} ${esc(s)} &nbsp;`).join('');
    if (t == 'date') return `<input class="in" name="${k}" required inputmode="numeric" maxlength="10" pattern="\\d{2}/\\d{2}/\\d{4}" placeholder="วว/ดด/ปปปป" title="dd/mm/yyyy" oninput="fmtD(this)" style="width:${x || 30}%">`;
    if (t == 'area') return edit ? `<textarea class="in" name="${k}" rows="3" required></textarea>` : `<div class="v">${esc(d[k])}</div>`;
    return edit ? `<input class="in" type="${t}" name="${k}" required style="width:${x || 60}%">` : `<span class="v">${esc(d[k])}</span>`;
  }) + `</div>`;
}

// ย่อรูปลายเซ็นให้เล็กพอเก็บใน Google Sheet
function sigData(file) {
  return new Promise(res => {
    const im = new Image();
    im.onload = () => {
      const k = Math.min(1, 300 / im.width), c = document.createElement('canvas');
      c.width = im.width * k; c.height = im.height * k;
      const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(im, 0, 0, c.width, c.height);
      res(c.toDataURL('image/jpeg', .6));
    };
    im.src = URL.createObjectURL(file);
  });
}

// พิมพ์วันที่แล้วเติม / ให้อัตโนมัติ เป็น dd/mm/yyyy
function fmtD(e) { let v = e.value.replace(/\D/g, '').slice(0, 8); if (v.length > 4) v = v.slice(0, 2) + '/' + v.slice(2, 4) + '/' + v.slice(4); else if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2); e.value = v; }

// ดาวน์โหลดเป็นไฟล์ PDF โดยตรง (ไม่ต้องผ่านหน้าต่างพิมพ์)
const loadJs = u => new Promise((ok, no) => { const e = document.createElement('script'); e.src = u; e.onload = ok; e.onerror = no; document.head.appendChild(e); });
async function savePdf(name) {
  const b = document.getElementById('pdfbtn'); if (b) { b.disabled = true; b.textContent = 'กำลังสร้าง PDF...'; }
  try {
    if (!window.html2canvas) await loadJs('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
    if (!window.jspdf) await loadJs('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
    await document.fonts.ready;
    const c = await html2canvas(document.querySelector('.paper'), { scale: 2, useCORS: true, backgroundColor: '#fff', windowWidth: 900 });
    const pdf = new jspdf.jsPDF('p', 'mm', 'a4'); let w = 210, h = c.height * w / c.width;
    if (h > 297) { w = w * 297 / h; h = 297; }
    pdf.addImage(c.toDataURL('image/jpeg', .95), 'JPEG', (210 - w) / 2, 0, w, h); pdf.save((name || 'form') + '.pdf');
  } catch (e) { alert('สร้าง PDF ไม่สำเร็จ ลองใช้ปุ่มพิมพ์แล้วเลือก Save as PDF แทน'); }
  if (b) { b.disabled = false; b.textContent = '⬇ ดาวน์โหลด PDF'; }
}
