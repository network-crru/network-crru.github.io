// ตัวแสดงแบบฟอร์มหน้ากระดาษ A4 (794x1122px) จัดวางตามต้นแบบ ใช้ร่วมกันทั้ง index/admin/view
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
document.head.insertAdjacentHTML('beforeend', `<link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap" rel="stylesheet"><style>
body{font-family:Sarabun,'Leelawadee UI',Tahoma,sans-serif;background:#e9ebf0;margin:0;padding:10px}
.np{margin:6px auto;max-width:794px}
.paper{position:relative;width:794px;height:1122px;margin:10px auto;background:#fff;box-shadow:0 2px 10px #0003;font-size:var(--fs,12.5px);line-height:21px;color:#000;overflow:hidden;text-align:left}
.paper small{font-size:.75em}
.R{display:flex;align-items:flex-start;height:21px;line-height:21px;white-space:nowrap}
.F{position:relative;display:block;height:16px;box-sizing:border-box;border-bottom:1px dotted #000;margin-left:2px;white-space:nowrap}
.F>input,.AR>textarea{position:absolute;left:0;top:0;width:100%;height:21px;box-sizing:border-box;border:0;background:#f1f5ff;padding:0 2px;font:inherit;line-height:21px;outline:0;color:#000}
.F>input[type=file]{font-size:10px;background:none;padding:0}
.A{position:absolute}
.LB{margin-left:2px}
.DS{display:flex;margin-left:2px}.DS .F{flex:1;margin:0;text-align:center}.DS .F:last-child{flex:1.2}.SL{padding:0 2px}
.AR{position:relative;height:46px;margin-top:-9px}
.AR i{position:absolute;left:0;right:0;border-bottom:1px dotted #000}
.AR>div,.AR>textarea{position:absolute;left:0;top:0;width:100%;height:50px;padding:8px 0 0;overflow:hidden;resize:none;line-height:21px;font:inherit;line-height:21px;box-sizing:border-box;border:0;background:none}
.AR>textarea{background:#f1f5ff;top:9px;height:44px;padding:0 2px}
.RO{display:inline-flex;align-items:center;height:24px;position:relative;white-space:nowrap}
.RO input{position:absolute;opacity:0;left:10px;top:10px}
.RO i{flex:none;width:24px;height:24px;border:1.5px solid #000;border-radius:50%;box-sizing:border-box;margin-right:12px}
.RO b{display:none;width:12px;height:12px;margin:4px;border-radius:50%;background:#000}
.RO b.on,.RO input:checked+i b{display:block}
.CB{display:inline-block;width:14px;height:14px;border:1px solid #000;box-sizing:border-box;vertical-align:middle;margin-right:5px;font-size:12px;line-height:12px;text-align:center}
.AB{position:relative;width:302px;border:1px solid #000;box-sizing:border-box}
.SG{position:absolute;left:0;right:0;bottom:0;margin:0 auto;max-height:44px;max-width:100%;mix-blend-mode:multiply}
.PV{bottom:22px;left:0;right:auto}.PV:not([src]){display:none}
.view .F{line-height:15px;padding-left:6px}.view .DS .F{padding-left:0}
@media print{body{background:#fff;padding:0}.np{display:none!important}.paper{box-shadow:none;margin:0;zoom:1!important;width:793px;height:1121px}*{-webkit-print-color-adjust:exact;print-color-adjust:exact}@page{size:A4;margin:0}}
</style>`);

const dp = v => { v = String(v || ''); let m;
  if (m = v.match(/^(\d{4})-(\d\d)-(\d\d)$/)) return [m[3], m[2], m[1]];
  if (m = v.match(/^(\d\d)\/(\d\d)\/(\d{4})$/)) return [m[1], m[2], m[3]];
  return v ? null : ['', '', '']; };
const dseg = (v, w) => { const p = dp(v); return p ? `<span class="DS" style="${w}">${p.map(x => `<span class="F">${x}</span>`).join('<span class="SL">/</span>')}</span>` : `<span class="F" style="${w}">${esc(v)}</span>`; };

// เทมเพลตมาตรฐาน (ใช้อัตโนมัติถ้าฟอร์มในชีตยังเป็นเทมเพลตเก่า)
const DEFAULT_TPL = `<div class="A" style="left:356px;top:55px"><img src="logo.png" style="width:70px" onerror="this.remove()"></div>
<div class="A" style="left:46px;top:143px;width:692px;text-align:center;font-size:var(--ft,17px);font-weight:700;line-height:27px">แบบฟอร์มขอใช้บริการพื้นที่สร้าง Homepage<br>สำนักบริการเทคโนโลยีสารสนเทศ มหาวิทยาลัยราชภัฏเชียงราย</div>
<div class="A" style="left:46px;top:216px;width:689px">
<div class="R" style="justify-content:flex-end">วันที่{{date|date|144px}}</div>
<div class="R">ชื่อ – นามสกุล (ภาษาไทย){{thName|text}}</div>
<div class="R">ชื่อ - นามสกุล&nbsp; (ภาษาอังกฤษ){{enName|text}}</div>
<div class="R">วัน เดือน ปี เกิด{{dob|date|236px}}</div>
<div class="R">รหัสประจำตัวนักศึกษา{{sid|text}}</div>
<div class="R">โปรแกรมวิชา{{prog|text|236px}}&nbsp;คณะ{{fac|text}}</div>
<div class="R">หมายเลขบัตรประจำตัวประชาชน{{nid|text}}</div>
<div class="R">ที่อยู่ปัจจุบัน ที่ติดต่อได้จริง{{addr|text}}</div>
<div class="R">จังหวัด{{prov|text|170px}}&nbsp;รหัสไปรษณีย์{{zip|text|100px}}&nbsp;&nbsp;หมายเลขโทรศัพท์{{tel|tel}}</div>
<div class="R">E-Mail Address{{email|email|503px}}</div>
<div class="R" style="margin-top:1px">ประเภทของ&nbsp;<small>Homepage</small></div>
{{type|radio|นำเสนอผลงาน,การเรียนการสอน,ส่วนตัว,หน่วยงาน}}
<div class="R" style="margin-top:17px">วัตถุประสงค์ในการขอใช้บริการ</div>
{{purpose|area}}
<div style="margin-top:6px;white-space:nowrap">ข้าพเจ้าขอรับรองว่าข้อมูลข้างต้นเป็นความจริงและยอมรับเงื่อนไขในการขอใช้บริการทุกประการ ข้าพเจ้าจะขอรับผิดชอบ<br>ข้อมูลหรือข้อความใดที่ปรากฏบนเว็บไซต์แต่เพียงผู้เดียว</div>
</div>
<div class="A" style="left:46px;top:611px;line-height:20px">** หมายเหตุ **</div>
<div class="A" style="left:46px;top:632px;white-space:nowrap">- กรณีเป็นนักศึกษาต้องให้อาจารย์ที่ปรึกษารับรองด้วย<br>- สำนักวิทยบริการฯ จะคงการให้บริการพื้นที่สร้าง <small>homepage</small><br>แก่นักศึกษาเป็นระยะเวลา 1 ปี นับแต่สำเร็จการศึกษา<br>และจะดำเนินการลบข้อมูลภายหลังครบกำหนดระยะเวลาดังกล่าว</div>
<div class="A" style="left:46px;top:788px">{{applicant|sig|ผู้ขอใช้บริการ}}</div>
<div class="A" style="left:46px;top:918px">{{advisor|sig|อาจารย์ที่ปรึกษา/หัวหน้าหน่วยงาน}}</div>
<div class="A" style="left:415px;top:579px">{{1|appr}}</div>
<div class="A" style="left:415px;top:808px">{{2|appr}}</div>`;

function renderPaper(form, o) {
  const edit = o.mode == 'edit', d = o.data || {}, ap = o.approvals || [];
  const W = x => x && x != 'fill' ? 'width:' + (/[a-z%]$/.test(x) ? x : x + '%') : 'flex:1;min-width:0';
  const fld = (k, t, x) => edit ? `<span class="F" style="${W(x)}"><input type="${t}" name="${k}" required></span>` : `<span class="F" style="${W(x)}">${esc(d[k])}</span>`;
  return `<div class="paper${edit ? '' : ' view'}">` + (!form.template || /class="(hd|g)"/.test(form.template) ? DEFAULT_TPL : form.template).replace(/\{\{(\w+)\|(\w+)(?:\|([^}]*))?\}\}/g, (m, k, t, x) => {
    if (t == 'appr') {
      const A = (form.approvers || [])[k - 1] || {}, R = ap[k - 1] || {}, ck = on => `<i class="CB">${on ? '✔' : ''}</i>`;
      return `<div class="AB" style="height:${k == 1 ? 209 : 205}px"><div class="A" style="left:11px;top:9px;font-weight:700">${esc(A.title)}</div>
<div class="A" style="left:37px;top:36px">${ck(R.status == 'approved')}อนุมัติ</div><div class="A" style="left:122px;top:36px">${ck(R.status == 'rejected')}ไม่อนุมัติ</div>
<div class="A F" style="left:11px;width:275px;top:61px;margin:0">${esc(R.reason)}</div><div class="A F" style="left:11px;width:275px;top:84px;margin:0"></div>
<div class="A R" style="left:46px;top:131px">ลงชื่อ<span class="F" style="width:178px">${R.sig ? `<img class="SG" src="${R.sig}">` : ''}</span></div>
<div class="A" style="left:0;right:0;top:156px;text-align:center">${esc(A.name)}</div><div class="A" style="left:0;right:0;top:181px;text-align:center">${esc(A.pos)}</div></div>`;
    }
    if (t == 'sig') return `<div class="R">ลงชื่อ<span class="F" style="width:130px">${edit ? `<input type="file" name="${k}" accept="image/*" required onchange="this.nextElementSibling.src=URL.createObjectURL(this.files[0])"><img class="SG PV">` : d[k] ? `<img class="SG" src="${d[k]}">` : ''}</span><span class="LB">${esc(x)}</span></div>
<div class="R" style="height:19px;margin-left:24px">(${fld(k + 'Name', 'text', '126px')})</div>
<div class="R" style="height:19px;margin-left:24px">${edit ? `<span class="F" style="width:128px"><input name="${k}Date" required inputmode="numeric" maxlength="10" pattern="\\d{2}/\\d{2}/\\d{4}" placeholder="วว/ดด/ปปปป" oninput="fmtD(this)"></span>` : dseg(d[k + 'Date'], 'width:128px')}</div>`;
    if (t == 'radio') return `<div class="R" style="height:24px;align-items:center;margin-top:-2px">` + (x || '').split(',').map((s, i) => `<label class="RO" style="width:${[163, 147, 112][i] ? [163, 147, 112][i] + 'px' : 'auto'}">${edit ? `<input type="radio" name="${k}" value="${esc(s)}" ${i ? '' : 'required'}>` : ''}<i><b${!edit && d[k] == s ? ' class="on"' : ''}></b></i>${esc(s)}</label>`).join('') + `</div>`;
    if (t == 'area') return `<div class="AR"><i style="top:24px"></i><i style="top:45px"></i>${edit ? `<textarea name="${k}" maxlength="200" required></textarea>` : `<div>${esc(d[k])}</div>`}</div>`;
    if (t == 'date') return edit ? `<span class="F" style="${W(x)}"><input name="${k}" required inputmode="numeric" maxlength="10" pattern="\\d{2}/\\d{2}/\\d{4}" placeholder="วว/ดด/ปปปป" oninput="fmtD(this)"></span>` : dseg(d[k], W(x));
    return fld(k, t, x);
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
// จอเล็กให้ย่อกระดาษให้พอดีความกว้าง
function fitPaper() { const k = Math.min(1, (innerWidth - 20) / 794); document.querySelectorAll('.paper').forEach(p => p.style.zoom = k); }
addEventListener('resize', fitPaper); new MutationObserver(fitPaper).observe(document.body, { childList: true, subtree: true });

// ดาวน์โหลดเป็นไฟล์ PDF โดยตรง
const loadJs = u => new Promise((ok, no) => { const e = document.createElement('script'); e.src = u; e.onload = ok; e.onerror = no; document.head.appendChild(e); });
async function savePdf(name) {
  const b = document.getElementById('pdfbtn'); if (b) { b.disabled = true; b.textContent = 'กำลังสร้าง PDF...'; }
  try {
    if (!window.html2canvas) await loadJs('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
    if (!window.jspdf) await loadJs('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
    await document.fonts.ready;
    const p = document.querySelector('.paper'); p.style.zoom = 1;
    const c = await html2canvas(p, { scale: 2, useCORS: true, backgroundColor: '#fff', windowWidth: 900 });
    fitPaper();
    const pdf = new jspdf.jsPDF('p', 'mm', 'a4'); let w = 210, h = c.height * w / c.width;
    if (h > 297) { w = w * 297 / h; h = 297; }
    pdf.addImage(c.toDataURL('image/jpeg', .95), 'JPEG', (210 - w) / 2, 0, w, h); pdf.save((name || 'form') + '.pdf');
  } catch (e) { fitPaper(); alert('สร้าง PDF ไม่สำเร็จ ลองใช้ปุ่มพิมพ์แล้วเลือก Save as PDF แทน'); }
  if (b) { b.disabled = false; b.textContent = '⬇ ดาวน์โหลด PDF'; }
}

// ปรับขนาดตัวอักษรให้ความกว้างบรรทัดเท่าต้นแบบ (ต้นแบบใช้ TH Sarabun PSK ซึ่งเล็กกว่า Sarabun)
function calib() {
  const m = (t, css) => { const s = document.createElement('span'); s.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;font:' + css; s.textContent = t; document.body.appendChild(s); const w = s.getBoundingClientRect().width; s.remove(); return w; };
  const f = "Sarabun,'Leelawadee UI',Tahoma,sans-serif", r = document.documentElement.style, c = v => Math.max(9, Math.min(24, v));
  const a = m('ข้าพเจ้าขอรับรองว่าข้อมูลข้างต้นเป็นความจริงและยอมรับเงื่อนไขในการขอใช้บริการทุกประการ ข้าพเจ้าจะขอรับผิดชอบ', '14px ' + f);
  const b = m('สำนักบริการเทคโนโลยีสารสนเทศ มหาวิทยาลัยราชภัฏเชียงราย', '700 20px ' + f);
  if (a) r.setProperty('--fs', c(14 * 583 / a).toFixed(2) + 'px');
  if (b) r.setProperty('--ft', c(20 * 412 / b).toFixed(2) + 'px');
}
calib(); document.fonts.load('14px Sarabun').then(calib, calib); document.fonts.load('700 20px Sarabun').then(calib, calib); document.fonts.ready.then(calib);
