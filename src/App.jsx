import { useState, useEffect, useMemo, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { createClient } from "@supabase/supabase-js";

// ═══════════════════════════════════════════════════════════════════════════════
// KONFIGURASI
// ═══════════════════════════════════════════════════════════════════════════════
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";
const supabase = SUPABASE_URL && SUPABASE_KEY ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

// ═══════════════════════════════════════════════════════════════════════════════
// DATA DEMO
// ═══════════════════════════════════════════════════════════════════════════════
const DEMO_MEETINGS = [
  {
    id: "1", judul: "Rapat Koordinasi Tim Pengembangan Q1 2026", tanggal: "2026-04-10", waktu: "09:00",
    peserta_internal: ["Budi Santoso", "Rina Wati", "Ahmad Fauzi"], peserta_eksternal: [],
    kategori: "Internal",
    ringkasan: "Pembahasan progres pengembangan sistem internal dan evaluasi target Q1. Tim sepakat untuk mempercepat timeline modul laporan.",
    keputusan: "1. Deadline modul laporan dimajukan 2 minggu. 2. Penambahan 1 developer untuk tim backend.",
    link_dokumen: "https://docs.google.com/document/d/example1", tags: ["pengembangan", "Q1", "evaluasi"],
    notulensi: `<h2>Meeting Notes: Koordinasi Tim Pengembangan Q1</h2>
<p><strong>Peserta:</strong> Budi Santoso, Rina Wati, Ahmad Fauzi</p>
<h3>1. Update Progres Modul</h3>
<ul>
<li><strong>Modul Laporan (Ahmad):</strong> Progres 65%. Backend sudah selesai, tinggal integrasi frontend. Estimasi selesai 2 minggu lagi jika tidak ada blocker.</li>
<li><strong>Modul Dashboard (Rina):</strong> Progres 80%. Grafik dan chart sudah jalan. Tinggal optimasi performa untuk dataset besar.</li>
<li><strong>API Gateway (Budi):</strong> Sudah deploy ke staging. Rate limiting sudah aktif. Perlu testing load sebelum go-live.</li>
</ul>
<h3>2. Evaluasi Target Q1</h3>
<p>Dari 5 target utama Q1, 3 sudah tercapai dan 2 masih in progress. Tim sepakat bahwa timeline modul laporan perlu dipercepat karena ada kebutuhan dari divisi keuangan untuk audit bulan depan.</p>
<h3>3. Keputusan</h3>
<ol>
<li>Deadline modul laporan dimajukan dari 30 April ke 15 April</li>
<li>Budi akan merekrut 1 developer tambahan untuk backend</li>
<li>Weekly sync dipindah ke hari Selasa jam 10 pagi</li>
</ol>
<h3>4. Action Items</h3>
<table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%">
<tr><th>Item</th><th>PIC</th><th>Deadline</th></tr>
<tr><td>Finalisasi API documentation</td><td>Budi</td><td>12 April</td></tr>
<tr><td>Load testing staging</td><td>Ahmad</td><td>14 April</td></tr>
<tr><td>Demo ke divisi keuangan</td><td>Rina</td><td>16 April</td></tr>
</table>`,
    created_at: "2026-04-10T09:00:00Z",
  },
  {
    id: "2", judul: "Meeting dengan Dinas Kominfo Kota", tanggal: "2026-04-08", waktu: "13:30",
    peserta_internal: ["Budi Santoso", "Siti Nurhaliza"],
    peserta_eksternal: ["Pak Joko Widodo (Kominfo)", "Ibu Ratna (Kominfo)"],
    kategori: "Eksternal – Pemerintah",
    ringkasan: "Diskusi kerja sama digitalisasi layanan publik. Pihak Kominfo tertarik dengan solusi yang ditawarkan organisasi.",
    keputusan: "1. Akan disiapkan proposal resmi dalam 2 minggu. 2. Meeting lanjutan dijadwalkan akhir April.",
    link_dokumen: "https://docs.google.com/document/d/example2", tags: ["kominfo", "digitalisasi", "kerja sama"],
    notulensi: `<h2>Meeting Notes: Diskusi Kerja Sama Digitalisasi</h2>
<p><strong>Peserta:</strong> Budi Santoso, Siti Nurhaliza, Pak Joko (Kominfo), Ibu Ratna (Kominfo)</p>
<h3>1. Pembukaan</h3>
<p>Pak Joko membuka meeting dengan menjelaskan bahwa Dinas Kominfo sedang mencari mitra teknologi untuk program digitalisasi layanan publik tahap 2. Fokus utama adalah sistem antrian online dan dashboard monitoring pelayanan.</p>
<h3>2. Presentasi Solusi</h3>
<p>Budi mempresentasikan portfolio organisasi, khususnya:</p>
<ul>
<li>Sistem antrian digital yang sudah diimplementasi di 3 kecamatan</li>
<li>Dashboard real-time monitoring dengan kapabilitas analytics</li>
<li>Integrasi dengan sistem existing Kominfo</li>
</ul>
<p>Ibu Ratna menanyakan soal <strong>timeline implementasi</strong> dan <strong>biaya maintenance tahunan</strong>. Siti menjelaskan bahwa implementasi bisa dilakukan dalam 3-4 bulan.</p>
<h3>3. Next Steps</h3>
<p>Organisasi akan menyiapkan <strong>proposal resmi</strong> beserta RAB dalam 2 minggu. Meeting lanjutan untuk presentasi proposal dijadwalkan akhir April 2026.</p>`,
    created_at: "2026-04-08T13:30:00Z",
  },
  {
    id: "3", judul: "Kick-off Partnership dengan PT Mitra Digital", tanggal: "2026-04-05", waktu: "10:00",
    peserta_internal: ["Ahmad Fauzi", "Dewi Lestari"],
    peserta_eksternal: ["Hendri (PT Mitra Digital)", "Lisa (PT Mitra Digital)"],
    kategori: "Eksternal – Mitra Bisnis",
    ringkasan: "Pertemuan awal untuk membahas potensi kolaborasi pengembangan produk bersama di bidang AI.",
    keputusan: "1. NDA akan ditandatangani minggu depan. 2. Tim teknis kedua belah pihak akan meeting terpisah.",
    link_dokumen: "https://docs.google.com/document/d/example3", tags: ["partnership", "AI", "kick-off"],
    notulensi: "", created_at: "2026-04-05T10:00:00Z",
  },
  {
    id: "4", judul: "Review Anggaran Semester 1", tanggal: "2026-03-28", waktu: "14:00",
    peserta_internal: ["Budi Santoso", "Rina Wati", "Dewi Lestari", "Ahmad Fauzi"], peserta_eksternal: [],
    kategori: "Internal",
    ringkasan: "Evaluasi penggunaan anggaran semester 1 dan perencanaan alokasi semester 2.",
    keputusan: "1. Budget marketing ditambah 15%. 2. Efisiensi operasional di bagian logistik.",
    link_dokumen: "https://docs.google.com/spreadsheets/d/example4", tags: ["anggaran", "keuangan", "semester"],
    notulensi: "", created_at: "2026-03-28T14:00:00Z",
  },
  {
    id: "5", judul: "Workshop Peningkatan Kapasitas SDM", tanggal: "2026-03-20", waktu: "08:30",
    peserta_internal: ["Seluruh Staff"], peserta_eksternal: ["Dr. Maya (Konsultan HR)"],
    kategori: "Lainnya",
    ringkasan: "Workshop sehari penuh tentang leadership dan manajemen waktu untuk seluruh karyawan.",
    keputusan: "1. Program mentoring bulanan dimulai April. 2. Evaluasi efektivitas workshop dalam 3 bulan.",
    link_dokumen: "https://docs.google.com/document/d/example5", tags: ["workshop", "SDM", "pelatihan"],
    notulensi: "", created_at: "2026-03-20T08:30:00Z",
  },
  {
    id: "6", judul: "Rapat Persiapan Audit Tahunan", tanggal: "2026-03-15", waktu: "10:00",
    peserta_internal: ["Rina Wati", "Dewi Lestari"], peserta_eksternal: [],
    kategori: "Internal",
    ringkasan: "Persiapan dokumen dan data untuk audit tahunan yang dijadwalkan bulan Mei.",
    keputusan: "1. Semua divisi wajib submit laporan paling lambat 15 April. 2. Tim audit internal melakukan pre-audit minggu depan.",
    link_dokumen: "https://docs.google.com/document/d/example6", tags: ["audit", "keuangan", "persiapan"],
    notulensi: "", created_at: "2026-03-15T10:00:00Z",
  },
];

const DEMO_DOKUMEN = [
  { id: "1", nama: "SOP Rapat Organisasi", deskripsi: "Standar operasional prosedur pelaksanaan rapat internal dan eksternal", tipe: "docs", link: "https://docs.google.com/document/d/sop-rapat", created_at: "2026-01-15T00:00:00Z" },
  { id: "2", nama: "Template Notulensi Meeting", deskripsi: "Format standar notulensi yang digunakan untuk semua meeting", tipe: "docs", link: "https://docs.google.com/document/d/template-notulensi", created_at: "2026-01-10T00:00:00Z" },
  { id: "3", nama: "Daftar Kontak Mitra & Stakeholder", deskripsi: "Spreadsheet berisi kontak mitra bisnis dan instansi pemerintah", tipe: "sheets", link: "https://docs.google.com/spreadsheets/d/kontak-mitra", created_at: "2026-02-01T00:00:00Z" },
  { id: "4", nama: "Kalender Meeting 2026", deskripsi: "Jadwal meeting organisasi sepanjang tahun 2026", tipe: "sheets", link: "https://docs.google.com/spreadsheets/d/kalender-2026", created_at: "2026-01-05T00:00:00Z" },
  { id: "5", nama: "Panduan Penggunaan Repositori", deskripsi: "Dokumentasi cara menggunakan sistem repositori meeting ini", tipe: "docs", link: "https://docs.google.com/document/d/panduan", created_at: "2026-03-01T00:00:00Z" },
];

const KATEGORI_OPTIONS = ["Internal", "Eksternal \u2013 Pemerintah", "Eksternal \u2013 Mitra Bisnis", "Lainnya"];
const BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const PIE_COLORS = ["#000170", "#D9001B", "#2563eb", "#7c3aed"];

function formatTanggal(d) { if (!d) return "-"; return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }); }
function formatWaktu(w) { return w ? w.slice(0, 5) : ""; }
function stripHtml(html) { const t = document.createElement("div"); t.innerHTML = html; return t.textContent || ""; }

// ═══ Icons ═══
const IconSearch = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>;
const IconCalendar = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>;
const IconUsers = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IconDoc = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>;
const IconExternalLink = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3"/></svg>;
const IconPlus = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>;
const IconTrash = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
const IconEdit = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IconLock = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IconBarChart = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>;
const IconHome = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg>;
const IconFolder = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>;
const IconMenu = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12h18M3 6h18M3 18h18"/></svg>;
const IconX = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>;
const IconTag = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>;
const IconEye = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const IconClipboard = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>;
const IconPrint = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>;

// ═══ Clean HTML utility ═══
function cleanHtml(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  // Allowed tags
  const ALLOWED = ["H1","H2","H3","H4","P","BR","STRONG","B","EM","I","U","UL","OL","LI","TABLE","THEAD","TBODY","TR","TH","TD","A","SPAN","DIV","BLOCKQUOTE","HR","SUP","SUB"];
  function walk(node) {
    if (node.nodeType === 3) return; // text node, keep
    if (node.nodeType === 1) {
      // Remove all inline styles (background, color, font-family, font-size, etc)
      node.removeAttribute("style");
      node.removeAttribute("class");
      node.removeAttribute("id");
      node.removeAttribute("bgcolor");
      node.removeAttribute("color");
      node.removeAttribute("face");
      node.removeAttribute("size");
      // Keep href on links
      if (node.tagName === "A") {
        const href = node.getAttribute("href");
        Array.from(node.attributes).forEach(a => node.removeAttribute(a.name));
        if (href) { node.setAttribute("href", href); node.setAttribute("target", "_blank"); }
      }
      // Keep border/cellpadding on tables for structure
      if (node.tagName === "TABLE") {
        Array.from(node.attributes).forEach(a => node.removeAttribute(a.name));
        node.setAttribute("border", "1");
        node.setAttribute("cellpadding", "6");
        node.setAttribute("cellspacing", "0");
        node.setAttribute("style", "border-collapse:collapse;width:100%");
      }
      // If tag not allowed, unwrap (keep children)
      if (!ALLOWED.includes(node.tagName)) {
        const parent = node.parentNode;
        while (node.firstChild) parent.insertBefore(node.firstChild, node);
        parent.removeChild(node);
        return;
      }
      // Convert SPAN with bold/italic to proper tags
      Array.from(node.childNodes).forEach(walk);
    }
  }
  walk(div);
  // Remove empty elements (except BR, HR, TD, TH)
  div.querySelectorAll("*").forEach(el => {
    if (!["BR","HR","TD","TH","TABLE","TR","THEAD","TBODY"].includes(el.tagName) && !el.textContent.trim() && !el.querySelector("img,br,hr,table")) {
      el.remove();
    }
  });
  // Clean up Google Docs artifacts
  let result = div.innerHTML;
  result = result.replace(/<!--[\s\S]*?-->/g, ""); // remove comments
  result = result.replace(/<google-sheets-html-origin[\s\S]*?>/gi, "");
  result = result.replace(/<\/google-sheets-html-origin>/gi, "");
  result = result.replace(/\s*dir="[^"]*"/gi, "");
  result = result.replace(/\s*role="[^"]*"/gi, "");
  result = result.replace(/\s*aria-[a-z-]*="[^"]*"/gi, "");
  result = result.replace(/\s*data-[a-z-]*="[^"]*"/gi, "");
  result = result.replace(/<b>/gi, "<strong>").replace(/<\/b>/gi, "</strong>");
  result = result.replace(/<i>/gi, "<em>").replace(/<\/i>/gi, "</em>");
  return result;
}

// ═══ Rich Text Editor ═══
function RichTextEditor({ value, onChange }) {
  const ref = useRef(null);
  const skip = useRef(false);
  const [cleaned, setCleaned] = useState(false);

  useEffect(() => { if (ref.current && !skip.current && ref.current.innerHTML !== value) ref.current.innerHTML = value || ""; skip.current = false; }, [value]);
  const fire = () => { skip.current = true; onChange(ref.current.innerHTML); };
  const exec = (cmd, val = null) => { document.execCommand(cmd, false, val); ref.current?.focus(); fire(); };

  const handleClean = () => {
    if (!ref.current) return;
    const cleaned = cleanHtml(ref.current.innerHTML);
    ref.current.innerHTML = cleaned;
    fire();
    setCleaned(true);
    setTimeout(() => setCleaned(false), 2000);
  };

  const handlePaste = () => {
    // Auto-clean after paste from Google Docs
    setTimeout(() => {
      if (ref.current) {
        const cleaned = cleanHtml(ref.current.innerHTML);
        ref.current.innerHTML = cleaned;
        fire();
      }
    }, 100);
  };

  const TB = (label, cmd, val = null) => <button key={cmd+(val||"")} type="button" onMouseDown={e => { e.preventDefault(); exec(cmd, val); }} style={{ background: "#f0f2fa", border: "1px solid #dde0ef", borderRadius: 4, padding: "4px 8px", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#333", minWidth: 28, lineHeight: 1 }} title={label}>{label}</button>;

  return (
    <div style={{ border: "2px solid #e0e4ef", borderRadius: 10, overflow: "hidden", background: "#fff" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, padding: "8px 10px", borderBottom: "1px solid #e0e4ef", background: "#f8f9fd", alignItems: "center" }}>
        {TB("B","bold")}{TB("I","italic")}{TB("U","underline")}
        <span style={{ width: 1, background: "#dde0ef", margin: "0 4px", height: 20 }}/>
        {TB("H2","formatBlock","h2")}{TB("H3","formatBlock","h3")}{TB("P","formatBlock","p")}
        <span style={{ width: 1, background: "#dde0ef", margin: "0 4px", height: 20 }}/>
        {TB("• List","insertUnorderedList")}{TB("1. List","insertOrderedList")}
        <span style={{ width: 1, background: "#dde0ef", margin: "0 4px", height: 20 }}/>
        {TB("Tabel","insertHTML",'<table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%"><tr><th>Kolom 1</th><th>Kolom 2</th><th>Kolom 3</th></tr><tr><td>Data</td><td>Data</td><td>Data</td></tr></table>')}
        <span style={{ width: 1, background: "#dde0ef", margin: "0 4px", height: 20 }}/>
        <button type="button" onMouseDown={e => { e.preventDefault(); handleClean(); }} style={{ background: cleaned ? "#16a34a" : "#fff3cd", border: "1px solid " + (cleaned ? "#16a34a" : "#ffc107"), borderRadius: 4, padding: "4px 10px", cursor: "pointer", fontSize: 13, fontWeight: 600, color: cleaned ? "#fff" : "#856404", lineHeight: 1, transition: "all 0.3s" }} title="Bersihkan semua formatting aneh dari Google Docs">
          {cleaned ? "✓ Bersih!" : "🧹 Bersihkan Format"}
        </button>
      </div>
      <div style={{ padding: "0 10px", background: "#fffdf5", borderBottom: "1px solid #f0e8d0", fontSize: 12, color: "#888", lineHeight: "28px" }}>
        💡 Paste dari Google Docs akan otomatis dibersihkan. Klik "Bersihkan Format" jika masih ada formatting aneh.
      </div>
      <div ref={ref} contentEditable onInput={fire} onPaste={handlePaste} style={{ minHeight: 250, maxHeight: 500, overflow: "auto", padding: "16px 18px", fontSize: 14, lineHeight: 1.7, outline: "none", fontFamily: "inherit", color: "#333" }} data-placeholder="Tulis atau paste notulensi meeting di sini..."/>
      <style>{`[contenteditable]:empty:before{content:attr(data-placeholder);color:#aaa}[contenteditable] h2{font-size:18px;font-weight:700;color:#000170;margin:16px 0 8px}[contenteditable] h3{font-size:16px;font-weight:700;color:#333;margin:12px 0 6px}[contenteditable] ul,[contenteditable] ol{padding-left:24px;margin:8px 0}[contenteditable] li{margin:4px 0}[contenteditable] table{margin:12px 0;border-collapse:collapse}[contenteditable] th{background:#f0f2fa;font-weight:600;text-align:left}[contenteditable] td,[contenteditable] th{border:1px solid #dde0ef;padding:6px 10px}`}</style>
    </div>
  );
}

// ═══ Notulensi Viewer ═══
function NotulensiViewer({ meeting: m, onClose }) {
  const handlePrint = () => {
    const w = window.open("", "_blank");
    w.document.write(`<!DOCTYPE html><html><head><title>${m.judul}</title><style>body{font-family:'Segoe UI',sans-serif;max-width:800px;margin:40px auto;padding:0 20px;color:#333;line-height:1.7}h1{color:#000170;font-size:22px;border-bottom:3px solid #000170;padding-bottom:10px}h2{color:#000170;font-size:18px;margin-top:24px}h3{font-size:16px;margin-top:16px}.meta{color:#666;font-size:14px;margin:12px 0 24px}table{border-collapse:collapse;width:100%;margin:12px 0}th,td{border:1px solid #ddd;padding:8px 12px;text-align:left}th{background:#f5f5f5}ul,ol{padding-left:24px}@media print{body{margin:20px}}</style></head><body><h1>${m.judul}</h1><div class="meta">${formatTanggal(m.tanggal)} ${m.waktu ? "\u2022 " + formatWaktu(m.waktu) : ""} \u2022 ${m.kategori}</div><p><strong>Peserta Internal:</strong> ${(m.peserta_internal||[]).join(", ")||"-"}</p>${(m.peserta_eksternal||[]).length>0?`<p><strong>Peserta Eksternal:</strong> ${m.peserta_eksternal.join(", ")}</p>`:""}<hr style="margin:20px 0;border:none;border-top:1px solid #eee"/>${m.notulensi||"<p>Belum ada notulensi.</p>"}</body></html>`);
    w.document.close(); w.print();
  };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,20,0.6)", zIndex: 300, display: "flex", justifyContent: "center", overflow: "auto", padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 16, maxWidth: 860, width: "100%", margin: "20px auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)", display: "flex", flexDirection: "column", maxHeight: "calc(100vh - 40px)" }}>
        {/* Header */}
        <div style={{ padding: "20px 28px", borderBottom: "2px solid #f0f2fa", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexShrink: 0 }}>
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: 8 }}><span style={badgeStyle(m.kategori)}>{m.kategori}</span></div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#000170", lineHeight: 1.3 }}>{m.judul}</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 8, fontSize: 13, color: "#666" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}><IconCalendar /> {formatTanggal(m.tanggal)} {m.waktu && `\u2022 ${formatWaktu(m.waktu)}`}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}><IconUsers /> {[...(m.peserta_internal||[]),...(m.peserta_eksternal||[])].length} peserta</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <button onClick={handlePrint} style={btnSecondaryStyle} title="Cetak"><IconPrint /> Cetak</button>
            {m.link_dokumen && <a href={m.link_dokumen} target="_blank" rel="noopener noreferrer" style={{ ...btnSecondaryStyle, textDecoration: "none", color: "#000170" }}><IconExternalLink /> Sumber</a>}
            <button onClick={onClose} style={{ background: "#f0f2fa", border: "none", borderRadius: 8, padding: 8, cursor: "pointer", display: "flex", alignItems: "center" }}><IconX /></button>
          </div>
        </div>
        {/* Peserta */}
        <div style={{ padding: "16px 28px", background: "#f8f9fd", borderBottom: "1px solid #f0f2fa", fontSize: 14, flexShrink: 0 }}>
          <div style={{ marginBottom: 4 }}><strong style={{ color: "#000170" }}>Peserta Internal:</strong> <span style={{ color: "#444" }}>{(m.peserta_internal||[]).join(", ")||"-"}</span></div>
          {(m.peserta_eksternal||[]).length > 0 && <div><strong style={{ color: "#D9001B" }}>Peserta Eksternal:</strong> <span style={{ color: "#444" }}>{m.peserta_eksternal.join(", ")}</span></div>}
        </div>
        {/* Ringkasan/Keputusan */}
        {(m.ringkasan || m.keputusan) && (
          <div style={{ padding: "16px 28px", borderBottom: "1px solid #f0f2fa", display: "flex", gap: 16, flexWrap: "wrap", flexShrink: 0 }}>
            {m.ringkasan && <div style={{ flex: 1, minWidth: 200 }}><div style={sectionLabelStyle}>Ringkasan</div><div style={{ fontSize: 14, color: "#444", lineHeight: 1.6 }}>{m.ringkasan}</div></div>}
            {m.keputusan && <div style={{ flex: 1, minWidth: 200 }}><div style={sectionLabelStyle}>Keputusan</div><div style={{ fontSize: 14, color: "#444", lineHeight: 1.6, background: "#fffbeb", padding: "10px 14px", borderRadius: 8, borderLeft: "3px solid #f59e0b" }}>{m.keputusan}</div></div>}
          </div>
        )}
        {/* Content */}
        <div style={{ flex: 1, overflow: "auto", padding: "24px 28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}><IconClipboard /><h3 style={{ fontSize: 16, fontWeight: 700, color: "#000170" }}>Notulensi Lengkap</h3></div>
          {m.notulensi && stripHtml(m.notulensi).trim() ? (
            <div className="notulensi-content" dangerouslySetInnerHTML={{ __html: m.notulensi }} />
          ) : (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "#aaa" }}><div style={{ fontSize: 40, marginBottom: 8 }}>📝</div><div>Belum ada notulensi untuk meeting ini</div></div>
          )}
        </div>
        {/* Tags */}
        {m.tags && m.tags.length > 0 && (
          <div style={{ padding: "12px 28px", borderTop: "1px solid #f0f2fa", display: "flex", gap: 6, flexWrap: "wrap", flexShrink: 0 }}>
            {m.tags.map(t => <span key={t} style={tagStyle}><IconTag />{t}</span>)}
          </div>
        )}
      </div>
      <style>{`.notulensi-content{font-size:14px;line-height:1.8;color:#333}.notulensi-content h2{font-size:18px;font-weight:700;color:#000170;margin:20px 0 10px;padding-bottom:6px;border-bottom:2px solid #f0f2fa}.notulensi-content h3{font-size:16px;font-weight:700;color:#1a1a2e;margin:16px 0 8px}.notulensi-content p{margin:8px 0}.notulensi-content ul,.notulensi-content ol{padding-left:28px;margin:8px 0}.notulensi-content li{margin:4px 0}.notulensi-content strong{color:#1a1a2e}.notulensi-content table{border-collapse:collapse;width:100%;margin:14px 0;font-size:13px}.notulensi-content th{background:#f0f2fa;font-weight:600;text-align:left;padding:8px 12px;border:1px solid #dde0ef;color:#000170}.notulensi-content td{padding:8px 12px;border:1px solid #dde0ef}.notulensi-content tr:hover td{background:#f8f9fd}`}</style>
    </div>
  );
}

// ═══ Global CSS ═══
const GlobalStyle = () => <style>{`@import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@300;400;500;600;700;800;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}html,body,#root{margin:0;padding:0;min-height:100vh}body{font-family:'Source Sans 3','Segoe UI',sans-serif;background:#eef1f8;color:#1a1a2e}input:focus,select:focus,textarea:focus{border-color:#000170!important;outline:none}button{font-family:inherit}button:hover{opacity:.92}.card-hover:hover{box-shadow:0 4px 16px rgba(0,1,112,.1)!important;transform:translateY(-1px)}::placeholder{color:#aaa}@media(max-width:900px){.content-grid{grid-template-columns:1fr!important}.dash-grid{grid-template-columns:1fr!important}.filter-row{flex-direction:column!important}.nav-desktop{display:none!important}.mobile-menu-btn{display:flex!important}.form-grid-3{grid-template-columns:1fr!important}}@media(min-width:901px){.mobile-menu-btn{display:none!important}.mobile-overlay{display:none!important}}`}</style>;

// ═══ APP ═══
export default function App() {
  const [page, setPage] = useState("beranda");
  const [meetings, setMeetings] = useState(DEMO_MEETINGS);
  const [dokumen, setDokumen] = useState(DEMO_DOKUMEN);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewNotulensi, setViewNotulensi] = useState(null);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    (async () => {
      const [mR, dR] = await Promise.all([supabase.from("meetings").select("*").order("tanggal", { ascending: false }), supabase.from("dokumen").select("*").order("created_at", { ascending: false })]);
      if (mR.data?.length) setMeetings(mR.data);
      if (dR.data?.length) setDokumen(dR.data);
      setLoading(false);
    })();
  }, []);

  const nav = (p) => { setPage(p); setMobileMenu(false); window.scrollTo(0, 0); };
  const navItems = [{ id: "beranda", label: "Beranda", icon: <IconHome /> }, { id: "katalog", label: "Katalog", icon: <IconSearch /> }, { id: "dokumen", label: "Dokumen", icon: <IconDoc /> }, { id: "dashboard", label: "Dashboard", icon: <IconBarChart /> }, { id: "admin", label: "Admin", icon: <IconLock /> }];

  if (loading) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "#000170", fontSize: 18 }}><GlobalStyle />Memuat data...</div>;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <GlobalStyle />
      {viewNotulensi && <NotulensiViewer meeting={viewNotulensi} onClose={() => setViewNotulensi(null)} />}
      <header style={{ background: "#000170", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 12px rgba(0,1,112,0.25)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => nav("beranda")}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#D9001B", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 14, letterSpacing: 1 }}>ORG</div>
            <div><div style={{ color: "#fff", fontSize: 16, fontWeight: 700, lineHeight: 1.2 }}>Repositori Meeting</div><div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>Sistem Temu Kembali Informasi Organisasi</div></div>
          </div>
          <div className="nav-desktop" style={{ display: "flex", gap: 4 }}>
            {navItems.map(n => <button key={n.id} onClick={() => nav(n.id)} style={{ background: page === n.id ? "rgba(255,255,255,0.15)" : "transparent", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: page === n.id ? 600 : 400, display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>{n.icon} {n.label}</button>)}
          </div>
          <button className="mobile-menu-btn" onClick={() => setMobileMenu(!mobileMenu)} style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer", padding: 4, display: "none", alignItems: "center" }}>{mobileMenu ? <IconX /> : <IconMenu />}</button>
        </div>
      </header>
      {mobileMenu && <div className="mobile-overlay" style={{ position: "fixed", inset: 0, top: 64, background: "#000170", zIndex: 99, padding: 20, display: "flex", flexDirection: "column", gap: 8 }}>
        {navItems.map(n => <button key={n.id} onClick={() => nav(n.id)} style={{ background: page === n.id ? "rgba(255,255,255,0.15)" : "transparent", color: "#fff", border: "none", padding: "14px 20px", borderRadius: 8, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", gap: 10 }}>{n.icon} {n.label}</button>)}
      </div>}
      <div style={{ flex: 1, maxWidth: 1280, margin: "0 auto", padding: "24px 24px 60px", width: "100%" }}>
        {page === "beranda" && <PageBeranda meetings={meetings} dokumen={dokumen} navigate={nav} onView={setViewNotulensi} />}
        {page === "katalog" && <PageKatalog meetings={meetings} onView={setViewNotulensi} />}
        {page === "dokumen" && <PageDokumen dokumen={dokumen} />}
        {page === "dashboard" && <PageDashboard meetings={meetings} dokumen={dokumen} />}
        {page === "admin" && <PageAdmin isAdmin={isAdmin} setIsAdmin={setIsAdmin} meetings={meetings} setMeetings={setMeetings} dokumen={dokumen} setDokumen={setDokumen} />}
      </div>
      <footer style={{ background: "#000170", color: "rgba(255,255,255,0.5)", textAlign: "center", padding: 20, fontSize: 13 }}>&copy; 2026 Repositori Meeting &mdash; Sistem Temu Kembali Informasi Organisasi</footer>
    </div>
  );
}

// ═══ Page: Beranda ═══
function PageBeranda({ meetings, dokumen, navigate, onView }) {
  const [q, setQ] = useState("");
  const recent = useMemo(() => [...meetings].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal)).slice(0, 3), [meetings]);
  const thisMonth = meetings.filter(m => { const d = new Date(m.tanggal), n = new Date(); return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear(); }).length;
  return (
    <div>
      <div style={{ background: "#fff", borderRadius: 16, padding: "48px 32px 40px", marginBottom: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", textAlign: "center", border: "1px solid rgba(0,1,112,0.06)" }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#000170", marginBottom: 8 }}>Repositori Meeting Organisasi</h1>
        <p style={{ color: "#666", marginBottom: 28, fontSize: 15 }}>Telusuri kembali notulensi, keputusan, dan dokumen meeting organisasi Anda</p>
        <div style={{ display: "flex", gap: 12, maxWidth: 640, margin: "0 auto" }}>
          <input style={inputStyle} placeholder="Cari meeting berdasarkan judul, peserta, atau kata kunci..." value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === "Enter" && navigate("katalog")} />
          <button style={btnRedStyle} onClick={() => navigate("katalog")}><IconSearch /> Cari</button>
        </div>
      </div>
      <div className="content-grid" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "start" }}>
        <div>
          <h2 style={pageTitleStyle}>Meeting Terbaru</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>{recent.map(m => <MeetingCard key={m.id} meeting={m} onView={onView} />)}</div>
          <button style={{ ...btnPrimaryStyle, marginTop: 20 }} onClick={() => navigate("katalog")}>Lihat Semua Meeting &rarr;</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={sideCardStyle}>
            <div style={sideTitleStyle}><IconBarChart /> Statistik Ringkas</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <SB n={meetings.length} l="Total Meeting" c="#000170" /><SB n={thisMonth} l="Bulan Ini" c="#D9001B" />
              <SB n={meetings.filter(m => m.kategori === "Internal").length} l="Internal" c="#000170" /><SB n={meetings.filter(m => m.kategori !== "Internal").length} l="Eksternal" c="#000170" />
            </div>
          </div>
          <div style={sideCardStyle}>
            <div style={sideTitleStyle}><IconDoc /> Dokumen Cepat</div>
            {dokumen.slice(0, 3).map(d => <a key={d.id} href={d.link} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid #f0f2fa", textDecoration: "none", color: "#333", fontSize: 14 }}><span style={docBadge(d.tipe)}>{d.tipe === "docs" ? "Docs" : "Sheets"}</span><span style={{ fontWeight: 500, flex: 1 }}>{d.nama}</span><IconExternalLink /></a>)}
            <button style={{ ...btnSecondaryStyle, marginTop: 12, width: "100%", justifyContent: "center" }} onClick={() => navigate("dokumen")}>Lihat Semua Dokumen</button>
          </div>
        </div>
      </div>
    </div>
  );
}
function SB({ n, l, c }) { return <div style={{ background: "#f4f6ff", borderRadius: 10, padding: "14px 12px", textAlign: "center" }}><div style={{ fontSize: 24, fontWeight: 800, color: c }}>{n}</div><div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{l}</div></div>; }

// ═══ Meeting Card ═══
function MeetingCard({ meeting: m, onView }) {
  const has = m.notulensi && stripHtml(m.notulensi).trim().length > 0;
  return (
    <div className="card-hover" style={cardStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: "#000170", lineHeight: 1.4 }}>{m.judul}</h3>
        <span style={badgeStyle(m.kategori)}>{m.kategori}</span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, fontSize: 13, color: "#666", margin: "8px 0 12px", alignItems: "center" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}><IconCalendar /> {formatTanggal(m.tanggal)} {m.waktu && `\u2022 ${formatWaktu(m.waktu)}`}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}><IconUsers /> {[...(m.peserta_internal||[]),...(m.peserta_eksternal||[])].length} peserta</span>
        {has && <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#16a34a", fontWeight: 600 }}><IconClipboard /> Notulensi tersedia</span>}
      </div>
      {m.ringkasan && <div style={{ marginBottom: 8 }}><div style={sectionLabelStyle}>Ringkasan</div><div style={{ fontSize: 14, color: "#444", lineHeight: 1.6 }}>{m.ringkasan}</div></div>}
      {m.keputusan && <div style={{ marginBottom: 8 }}><div style={sectionLabelStyle}>Keputusan</div><div style={{ fontSize: 14, color: "#444", lineHeight: 1.6, background: "#fffbeb", padding: "10px 14px", borderRadius: 8, borderLeft: "3px solid #f59e0b" }}>{m.keputusan}</div></div>}
      {m.tags?.length > 0 && <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>{m.tags.map(t => <span key={t} style={tagStyle}><IconTag />{t}</span>)}</div>}
      <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
        <button onClick={() => onView(m)} style={{ ...openBtnStyle, background: has ? "#D9001B" : "#666" }}><IconEye /> {has ? "Lihat Notulensi" : "Detail Meeting"}</button>
        {m.link_dokumen && <a href={m.link_dokumen} target="_blank" rel="noopener noreferrer" style={{ ...openBtnStyle, background: "#000170" }}><IconDoc /> Google Drive <IconExternalLink /></a>}
      </div>
    </div>
  );
}

// ═══ Page: Katalog ═══
function PageKatalog({ meetings, onView }) {
  const [mode, setMode] = useState("simple");
  const [q, setQ] = useState("");
  const [fK, setFK] = useState("");
  const [fP, setFP] = useState("");
  const [dF, setDF] = useState("");
  const [dT, setDT] = useState("");
  const allP = useMemo(() => { const s = new Set(); meetings.forEach(m => { (m.peserta_internal||[]).forEach(p => s.add(p)); (m.peserta_eksternal||[]).forEach(p => s.add(p)); }); return [...s].sort(); }, [meetings]);
  const filtered = useMemo(() => {
    let r = [...meetings];
    if (fK) r = r.filter(m => m.kategori === fK);
    if (fP) r = r.filter(m => [...(m.peserta_internal||[]),...(m.peserta_eksternal||[])].some(p => p.toLowerCase().includes(fP.toLowerCase())));
    if (dF) r = r.filter(m => m.tanggal >= dF);
    if (dT) r = r.filter(m => m.tanggal <= dT);
    if (q.trim()) {
      if (mode === "simple") { const ql = q.toLowerCase(); r = r.filter(m => [m.judul, m.ringkasan, m.keputusan, ...(m.tags||[]), ...(m.peserta_internal||[]), ...(m.peserta_eksternal||[]), m.notulensi ? stripHtml(m.notulensi) : ""].join(" ").toLowerCase().includes(ql)); }
      else r = boolSearch(r, q);
    }
    return r.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
  }, [meetings, q, mode, fK, fP, dF, dT]);
  return (
    <div>
      <div style={sectionCardStyle}>
        <h2 style={{ ...pageTitleStyle, marginBottom: 20 }}><IconSearch /> Katalog Meeting</h2>
        <div style={{ display: "flex", marginBottom: 20, borderRadius: 10, overflow: "hidden", border: "2px solid #000170", width: "fit-content" }}>
          <button onClick={() => setMode("simple")} style={tabStyle(mode === "simple")}>Pencarian Sederhana</button>
          <button onClick={() => setMode("boolean")} style={tabStyle(mode === "boolean")}>Pencarian Lanjutan (Boolean)</button>
        </div>
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <input style={inputStyle} placeholder={mode === "simple" ? "Isikan kata kunci lalu tekan enter..." : '"anggaran" AND "Q1" OR "keuangan" NOT "draft"'} value={q} onChange={e => setQ(e.target.value)} />
          <button style={btnRedStyle}><IconSearch /> Cari</button>
        </div>
        {mode === "boolean" && <div style={{ fontSize: 13, color: "#888", padding: "10px 14px", background: "#f8f9fd", borderRadius: 8, marginBottom: 16, lineHeight: 1.6 }}><strong>Operator Boolean:</strong> <code style={{ background: "#e0e7ff", padding: "2px 6px", borderRadius: 4 }}>AND</code> semua kata harus ada, <code style={{ background: "#e0e7ff", padding: "2px 6px", borderRadius: 4 }}>OR</code> salah satu, <code style={{ background: "#e0e7ff", padding: "2px 6px", borderRadius: 4 }}>NOT</code> mengecualikan. Pencarian juga mencari di dalam isi notulensi.</div>}
        <div className="filter-row" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <FF l="Kategori"><select style={selectStyle} value={fK} onChange={e => setFK(e.target.value)}><option value="">Semua Kategori</option>{KATEGORI_OPTIONS.map(k => <option key={k} value={k}>{k}</option>)}</select></FF>
          <FF l="Dari Tanggal"><input type="date" style={dateStyle} value={dF} onChange={e => setDF(e.target.value)} /></FF>
          <FF l="Sampai Tanggal"><input type="date" style={dateStyle} value={dT} onChange={e => setDT(e.target.value)} /></FF>
          <FF l="Peserta"><select style={selectStyle} value={fP} onChange={e => setFP(e.target.value)}><option value="">Semua Peserta</option>{allP.map(p => <option key={p} value={p}>{p}</option>)}</select></FF>
        </div>
      </div>
      <div style={{ fontSize: 14, color: "#666", marginBottom: 16, fontWeight: 500 }}>{filtered.length} meeting ditemukan</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {filtered.length > 0 ? filtered.map(m => <MeetingCard key={m.id} meeting={m} onView={onView} />) : <div style={{ textAlign: "center", padding: "60px 20px", color: "#888" }}><div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div><div style={{ fontWeight: 600, fontSize: 17, marginBottom: 6 }}>Tidak ada hasil</div><div>Coba ubah kata kunci atau filter pencarian Anda</div></div>}
      </div>
    </div>
  );
}
function FF({ l, children }) { return <div><div style={{ fontSize: 13, fontWeight: 600, color: "#666", marginBottom: 4 }}>{l}</div>{children}</div>; }
function boolSearch(meetings, query) {
  const gt = m => [m.judul, m.ringkasan, m.keputusan, ...(m.tags||[]), ...(m.peserta_internal||[]), ...(m.peserta_eksternal||[]), m.notulensi ? stripHtml(m.notulensi) : ""].join(" ").toLowerCase();
  const np = query.split(/\bNOT\b/i), mq = np[0].trim(), nt = np.slice(1).map(t => t.trim().toLowerCase().replace(/"/g, "")), og = mq.split(/\bOR\b/i).map(g => g.trim());
  return meetings.filter(m => { const t = gt(m); for (const n of nt) if (n && t.includes(n)) return false; return og.some(g => g.split(/\bAND\b/i).map(x => x.trim().toLowerCase().replace(/"/g, "")).every(x => x === "" || t.includes(x))); });
}

// ═══ Page: Dokumen ═══
function PageDokumen({ dokumen }) {
  return (
    <div>
      <h2 style={pageTitleStyle}><IconFolder /> Dokumen Cepat</h2>
      <p style={{ color: "#666", marginBottom: 24, fontSize: 15 }}>Akses cepat ke dokumen &amp; spreadsheet penting organisasi</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
        {dokumen.map(d => <div key={d.id} className="card-hover" style={{ ...cardStyle, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}><h3 style={{ fontSize: 16, fontWeight: 700, color: "#000170" }}>{d.nama}</h3><span style={docBadge(d.tipe)}>{d.tipe === "docs" ? "📄 Docs" : "📊 Sheets"}</span></div>
          <p style={{ fontSize: 14, color: "#666", lineHeight: 1.5, flex: 1 }}>{d.deskripsi}</p>
          <a href={d.link} target="_blank" rel="noopener noreferrer" style={{ ...openBtnStyle, width: "fit-content" }}>Buka Dokumen <IconExternalLink /></a>
        </div>)}
      </div>
    </div>
  );
}

// ═══ Page: Dashboard ═══
function PageDashboard({ meetings, dokumen }) {
  const kd = useMemo(() => { const c = {}; meetings.forEach(m => { c[m.kategori] = (c[m.kategori]||0)+1; }); return Object.entries(c).map(([name, value]) => ({ name, value })); }, [meetings]);
  const md = useMemo(() => { const c = {}; meetings.forEach(m => { const d = new Date(m.tanggal), k = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`; c[k] = { name: BULAN[d.getMonth()]+" "+d.getFullYear(), value: (c[k]?.value||0)+1 }; }); return Object.entries(c).sort(([a],[b]) => a.localeCompare(b)).map(([,v]) => v); }, [meetings]);
  const recent = [...meetings].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);
  return (
    <div>
      <h2 style={pageTitleStyle}><IconBarChart /> Dashboard</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 24 }}>
        {[{ l: "Total Meeting", v: meetings.length, c: "#000170" }, { l: "Total Dokumen", v: dokumen.length, c: "#2563eb" }, { l: "Meeting Internal", v: meetings.filter(m => m.kategori === "Internal").length, c: "#16a34a" }, { l: "Meeting Eksternal", v: meetings.filter(m => m.kategori !== "Internal").length, c: "#D9001B" }].map(s => <div key={s.l} style={{ ...sectionCardStyle, textAlign: "center" }}><div style={{ fontSize: 32, fontWeight: 800, color: s.c }}>{s.v}</div><div style={{ fontSize: 13, color: "#666", marginTop: 4 }}>{s.l}</div></div>)}
      </div>
      <div className="dash-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        <div style={sectionCardStyle}><div style={{ fontSize: 16, fontWeight: 700, color: "#000170", marginBottom: 16 }}>Meeting per Bulan</div><ResponsiveContainer width="100%" height={250}><BarChart data={md}><XAxis dataKey="name" tick={{ fontSize: 12 }} /><YAxis allowDecimals={false} tick={{ fontSize: 12 }} /><Tooltip /><Bar dataKey="value" fill="#000170" radius={[6,6,0,0]} /></BarChart></ResponsiveContainer></div>
        <div style={sectionCardStyle}><div style={{ fontSize: 16, fontWeight: 700, color: "#000170", marginBottom: 16 }}>Distribusi Kategori</div><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={kd} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name.length > 12 ? name.slice(0,12)+"\u2026" : name} ${(percent*100).toFixed(0)}%`} labelLine={false}>{kd.map((_,i) => <Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div>
      </div>
      <div style={sectionCardStyle}><div style={{ fontSize: 16, fontWeight: 700, color: "#000170", marginBottom: 16 }}>Meeting Terbaru Ditambahkan</div><div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}><thead><tr style={{ borderBottom: "2px solid #f0f2fa" }}><th style={thStyle}>Judul</th><th style={thStyle}>Tanggal</th><th style={thStyle}>Kategori</th></tr></thead><tbody>{recent.map(m => <tr key={m.id} style={{ borderBottom: "1px solid #f0f2fa" }}><td style={{ padding: 12, fontWeight: 500, color: "#000170" }}>{m.judul}</td><td style={{ padding: 12, color: "#666" }}>{formatTanggal(m.tanggal)}</td><td style={{ padding: 12 }}><span style={badgeStyle(m.kategori)}>{m.kategori}</span></td></tr>)}</tbody></table></div></div>
    </div>
  );
}

// ═══ Page: Admin ═══
function PageAdmin({ isAdmin, setIsAdmin, meetings, setMeetings, dokumen, setDokumen }) {
  const [pw, setPw] = useState(""); const [err, setErr] = useState(""); const [tab, setTab] = useState("meetings"); const [showForm, setShowForm] = useState(false); const [edit, setEdit] = useState(null); const [del, setDel] = useState(null);
  const login = () => { if (pw === ADMIN_PASSWORD) { setIsAdmin(true); setErr(""); } else setErr("Password salah."); };
  const saveM = async (data, eid) => { if (supabase) { if (eid) { const { data: u } = await supabase.from("meetings").update(data).eq("id", eid).select().single(); if (u) setMeetings(p => p.map(m => m.id === eid ? u : m)); } else { const { data: i } = await supabase.from("meetings").insert(data).select().single(); if (i) setMeetings(p => [i, ...p]); } } else { if (eid) setMeetings(p => p.map(m => m.id === eid ? { ...m, ...data } : m)); else setMeetings(p => [{ ...data, id: Date.now().toString(), created_at: new Date().toISOString() }, ...p]); } };
  const saveD = async (data, eid) => { if (supabase) { if (eid) { const { data: u } = await supabase.from("dokumen").update(data).eq("id", eid).select().single(); if (u) setDokumen(p => p.map(d => d.id === eid ? u : d)); } else { const { data: i } = await supabase.from("dokumen").insert(data).select().single(); if (i) setDokumen(p => [i, ...p]); } } else { if (eid) setDokumen(p => p.map(d => d.id === eid ? { ...d, ...data } : d)); else setDokumen(p => [{ ...data, id: Date.now().toString(), created_at: new Date().toISOString() }, ...p]); } };
  const delItem = async (id) => { const t = tab === "meetings" ? "meetings" : "dokumen"; if (supabase) await supabase.from(t).delete().eq("id", id); if (tab === "meetings") setMeetings(p => p.filter(m => m.id !== id)); else setDokumen(p => p.filter(d => d.id !== id)); setDel(null); };

  if (!isAdmin) return (
    <div style={{ maxWidth: 400, margin: "80px auto", background: "#fff", borderRadius: 16, padding: 40, boxShadow: "0 4px 20px rgba(0,0,0,0.08)", textAlign: "center" }}>
      <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#f0f2fa", margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center" }}><IconLock /></div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#000170", marginBottom: 8 }}>Akses Admin</h2>
      <p style={{ color: "#666", marginBottom: 24, fontSize: 14 }}>Masukkan password untuk mengakses panel admin</p>
      <div style={{ marginBottom: 16, textAlign: "left" }}><input type="password" style={inputStyle} placeholder="Masukkan password..." value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === "Enter" && login()} /></div>
      {err && <div style={{ color: "#D9001B", fontSize: 14, marginBottom: 16, fontWeight: 500 }}>{err}</div>}
      <button style={{ ...btnPrimaryStyle, width: "100%", justifyContent: "center" }} onClick={login}><IconLock /> Masuk</button>
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}><h2 style={pageTitleStyle}><IconLock /> Panel Admin</h2><button style={btnSecondaryStyle} onClick={() => setIsAdmin(false)}>Keluar</button></div>
      <div style={{ display: "flex", marginBottom: 24, borderRadius: 10, overflow: "hidden", border: "2px solid #000170", width: "fit-content" }}>
        <button style={tabStyle(tab === "meetings")} onClick={() => { setTab("meetings"); setShowForm(false); setEdit(null); }}>Meeting</button>
        <button style={tabStyle(tab === "dokumen")} onClick={() => { setTab("dokumen"); setShowForm(false); setEdit(null); }}>Dokumen</button>
      </div>
      <button style={btnPrimaryStyle} onClick={() => { setShowForm(true); setEdit(null); }}><IconPlus /> Tambah {tab === "meetings" ? "Meeting" : "Dokumen"}</button>
      {showForm && <div style={overlayStyle} onClick={e => e.target === e.currentTarget && setShowForm(false)}><div style={{ ...modalStyle, maxWidth: tab === "meetings" ? 750 : 600 }}>
        {tab === "meetings" ? <MeetingForm item={edit} onSave={d => { saveM(d, edit?.id); setShowForm(false); setEdit(null); }} onCancel={() => { setShowForm(false); setEdit(null); }} />
        : <DokumenForm item={edit} onSave={d => { saveD(d, edit?.id); setShowForm(false); setEdit(null); }} onCancel={() => { setShowForm(false); setEdit(null); }} />}
      </div></div>}
      {del && <div style={overlayStyle} onClick={e => e.target === e.currentTarget && setDel(null)}><div style={{ ...modalStyle, maxWidth: 400, textAlign: "center" }}><div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div><h3 style={{ fontSize: 18, fontWeight: 700, color: "#D9001B", marginBottom: 8 }}>Konfirmasi Hapus</h3><p style={{ color: "#666", marginBottom: 24, fontSize: 14 }}>Yakin ingin menghapus item ini?</p><div style={{ display: "flex", gap: 12, justifyContent: "center" }}><button style={btnSecondaryStyle} onClick={() => setDel(null)}>Batal</button><button style={btnDangerStyle} onClick={() => delItem(del)}><IconTrash /> Ya, Hapus</button></div></div></div>}
      <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 12 }}>
        {(tab === "meetings" ? meetings : dokumen).map(item => (
          <div key={item.id} style={{ ...cardStyle, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
            <div style={{ flex: 1 }}><h3 style={{ fontSize: 15, fontWeight: 700, color: "#000170" }}>{item.judul || item.nama}</h3><div style={{ fontSize: 13, color: "#666", marginTop: 4 }}>
              {tab === "meetings" ? <>{formatTanggal(item.tanggal)} &bull; <span style={badgeStyle(item.kategori)}>{item.kategori}</span>{item.notulensi && stripHtml(item.notulensi).trim() && <span style={{ marginLeft: 8, color: "#16a34a", fontWeight: 600, fontSize: 12 }}>✓ Notulensi</span>}</> : item.deskripsi}
            </div></div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}><button style={btnSecondaryStyle} onClick={() => { setEdit(item); setShowForm(true); }}><IconEdit /> Edit</button><button style={btnDangerStyle} onClick={() => setDel(item.id)}><IconTrash /></button></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══ Forms ═══
function MeetingForm({ item, onSave, onCancel }) {
  const [f, setF] = useState({ judul: item?.judul||"", tanggal: item?.tanggal||"", waktu: item?.waktu||"", peserta_internal: item?.peserta_internal?.join(", ")||"", peserta_eksternal: item?.peserta_eksternal?.join(", ")||"", kategori: item?.kategori||"Internal", ringkasan: item?.ringkasan||"", keputusan: item?.keputusan||"", link_dokumen: item?.link_dokumen||"", tags: item?.tags?.join(", ")||"", notulensi: item?.notulensi||"" });
  const u = (k, v) => setF(p => ({ ...p, [k]: v }));
  const go = () => { if (!f.judul||!f.tanggal) return; onSave({ judul: f.judul, tanggal: f.tanggal, waktu: f.waktu, peserta_internal: f.peserta_internal.split(",").map(s => s.trim()).filter(Boolean), peserta_eksternal: f.peserta_eksternal.split(",").map(s => s.trim()).filter(Boolean), kategori: f.kategori, ringkasan: f.ringkasan, keputusan: f.keputusan, link_dokumen: f.link_dokumen, notulensi: f.notulensi, tags: f.tags.split(",").map(s => s.trim()).filter(Boolean) }); };
  return (
    <div>
      <h3 style={{ fontSize: 20, fontWeight: 700, color: "#000170", marginBottom: 24 }}>{item ? "Edit Meeting" : "Tambah Meeting Baru"}</h3>
      <FL l="Judul Meeting *"><input style={inputStyle} value={f.judul} onChange={e => u("judul", e.target.value)} placeholder="Judul meeting..." /></FL>
      <div className="form-grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        <FL l="Tanggal *"><input type="date" style={inputStyle} value={f.tanggal} onChange={e => u("tanggal", e.target.value)} /></FL>
        <FL l="Waktu"><input type="time" style={inputStyle} value={f.waktu} onChange={e => u("waktu", e.target.value)} /></FL>
        <FL l="Kategori"><select style={{ ...inputStyle, cursor: "pointer" }} value={f.kategori} onChange={e => u("kategori", e.target.value)}>{KATEGORI_OPTIONS.map(k => <option key={k} value={k}>{k}</option>)}</select></FL>
      </div>
      <FL l="Peserta Internal (pisahkan dengan koma)"><input style={inputStyle} value={f.peserta_internal} onChange={e => u("peserta_internal", e.target.value)} placeholder="Budi, Rina..." /></FL>
      <FL l="Peserta Eksternal (pisahkan dengan koma)"><input style={inputStyle} value={f.peserta_eksternal} onChange={e => u("peserta_eksternal", e.target.value)} placeholder="Pak Joko (Kominfo)..." /></FL>
      <FL l="Ringkasan"><textarea style={textareaStyle} value={f.ringkasan} onChange={e => u("ringkasan", e.target.value)} placeholder="Ringkasan meeting..." /></FL>
      <FL l="Keputusan"><textarea style={textareaStyle} value={f.keputusan} onChange={e => u("keputusan", e.target.value)} placeholder="Keputusan..." /></FL>
      <FL l="📝 Notulensi / Minutes of Meeting (bisa copy-paste dari Google Docs)"><RichTextEditor value={f.notulensi} onChange={v => u("notulensi", v)} /></FL>
      <FL l="Link Dokumen Asli (Google Drive, opsional)"><input style={inputStyle} value={f.link_dokumen} onChange={e => u("link_dokumen", e.target.value)} placeholder="https://docs.google.com/..." /></FL>
      <FL l="Tags (pisahkan dengan koma)"><input style={inputStyle} value={f.tags} onChange={e => u("tags", e.target.value)} placeholder="koordinasi, Q1..." /></FL>
      <div style={{ display: "flex", gap: 12, marginTop: 8 }}><button style={btnPrimaryStyle} onClick={go}>{item ? "Simpan Perubahan" : "Tambah Meeting"}</button><button style={btnSecondaryStyle} onClick={onCancel}>Batal</button></div>
    </div>
  );
}
function DokumenForm({ item, onSave, onCancel }) {
  const [f, setF] = useState({ nama: item?.nama||"", deskripsi: item?.deskripsi||"", tipe: item?.tipe||"docs", link: item?.link||"" });
  const u = (k, v) => setF(p => ({ ...p, [k]: v }));
  return (
    <div>
      <h3 style={{ fontSize: 20, fontWeight: 700, color: "#000170", marginBottom: 24 }}>{item ? "Edit Dokumen" : "Tambah Dokumen Baru"}</h3>
      <FL l="Nama Dokumen *"><input style={inputStyle} value={f.nama} onChange={e => u("nama", e.target.value)} placeholder="Nama dokumen..." /></FL>
      <FL l="Deskripsi"><textarea style={textareaStyle} value={f.deskripsi} onChange={e => u("deskripsi", e.target.value)} placeholder="Deskripsi..." /></FL>
      <FL l="Tipe"><select style={{ ...inputStyle, cursor: "pointer" }} value={f.tipe} onChange={e => u("tipe", e.target.value)}><option value="docs">Google Docs</option><option value="sheets">Google Sheets</option></select></FL>
      <FL l="Link Google Drive *"><input style={inputStyle} value={f.link} onChange={e => u("link", e.target.value)} placeholder="https://docs.google.com/..." /></FL>
      <div style={{ display: "flex", gap: 12, marginTop: 8 }}><button style={btnPrimaryStyle} onClick={() => { if (!f.nama||!f.link) return; onSave(f); }}>{item ? "Simpan Perubahan" : "Tambah Dokumen"}</button><button style={btnSecondaryStyle} onClick={onCancel}>Batal</button></div>
    </div>
  );
}
function FL({ l, children }) { return <div style={{ marginBottom: 16, textAlign: "left" }}><label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 6 }}>{l}</label>{children}</div>; }

// ═══ Styles ═══
const inputStyle = { width: "100%", padding: "14px 18px", border: "2px solid #e0e4ef", borderRadius: 10, fontSize: 15, background: "#f8f9fd", boxSizing: "border-box", fontFamily: "inherit" };
const textareaStyle = { ...inputStyle, resize: "vertical", minHeight: 80 };
const selectStyle = { padding: "10px 14px", border: "2px solid #e0e4ef", borderRadius: 8, fontSize: 14, background: "#f8f9fd", minWidth: 180, cursor: "pointer", appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: 36 };
const dateStyle = { padding: "10px 14px", border: "2px solid #e0e4ef", borderRadius: 8, fontSize: 14, background: "#f8f9fd" };
const btnPrimaryStyle = { background: "#000170", color: "#fff", border: "none", borderRadius: 10, padding: "12px 24px", fontSize: 15, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 };
const btnRedStyle = { background: "#D9001B", color: "#fff", border: "none", borderRadius: 10, padding: "14px 28px", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" };
const btnSecondaryStyle = { background: "#f0f2fa", color: "#000170", border: "2px solid #e0e4ef", borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 };
const btnDangerStyle = { background: "#D9001B", color: "#fff", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 };
const cardStyle = { background: "#fff", borderRadius: 14, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.05)", border: "1px solid rgba(0,1,112,0.06)", transition: "box-shadow 0.2s, transform 0.2s" };
const sectionCardStyle = { background: "#fff", borderRadius: 16, padding: 32, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid rgba(0,1,112,0.06)", marginBottom: 24 };
const sideCardStyle = { background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.05)", border: "1px solid rgba(0,1,112,0.06)" };
const sideTitleStyle = { fontSize: 15, fontWeight: 700, color: "#000170", marginBottom: 14, display: "flex", alignItems: "center", gap: 8, paddingBottom: 10, borderBottom: "2px solid #f0f2fa" };
const pageTitleStyle = { fontSize: 24, fontWeight: 700, color: "#000170", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 };
const sectionLabelStyle = { fontSize: 12, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 };
const openBtnStyle = { display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 18px", background: "#000170", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", textDecoration: "none" };
const tagStyle = { fontSize: 12, padding: "2px 10px", borderRadius: 20, background: "#f0f2fa", color: "#000170", fontWeight: 500, display: "flex", alignItems: "center", gap: 4 };
const overlayStyle = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 };
const modalStyle = { background: "#fff", borderRadius: 16, padding: 32, maxWidth: 600, width: "100%", maxHeight: "85vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" };
const thStyle = { textAlign: "left", padding: "10px 12px", color: "#888", fontWeight: 600, fontSize: 12, textTransform: "uppercase" };
const tabStyle = (a) => ({ padding: "10px 24px", background: a ? "#000170" : "#fff", color: a ? "#fff" : "#000170", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600 });
const badgeStyle = (cat) => { const c = { Internal: { bg: "#e0e7ff", color: "#000170" }, "Eksternal \u2013 Pemerintah": { bg: "#fde8e8", color: "#D9001B" }, "Eksternal \u2013 Mitra Bisnis": { bg: "#e8f5e9", color: "#1b5e20" }, Lainnya: { bg: "#f3e8fd", color: "#6b21a8" } }[cat] || { bg: "#f3e8fd", color: "#6b21a8" }; return { display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: c.bg, color: c.color }; };
const docBadge = (t) => ({ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: t === "docs" ? "#e0e7ff" : "#e8f5e9", color: t === "docs" ? "#000170" : "#1b5e20", width: "fit-content" });
