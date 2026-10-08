'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { DocIcon, PlusIcon, SendIcon, UploadIcon } from './Icons';
import { Reveal, ease } from './Motion';
import {
  DEFAULT_SOURCES,
  MAX_FILE_BYTES,
  MAX_SOURCE_CHARS,
  MAX_USER_SOURCES,
  STORAGE_KEY,
  bestExcerpt,
  highlightParts,
  rankSources,
  tokens,
} from '../lib/retrieval';

const WELCOME = 'Halo. Tanyakan soal pengiriman, retur, atau produk serum dari dokumen contoh, atau tambahkan catatanmu sendiri dulu. Aku akan menunjukkan kutipan yang dipakai.';
const SUGGESTIONS = ['Berapa lama pengiriman?', 'Bagaimana aturan retur?', 'Apa kandungan serum?'];

let counter = 0;
const nextId = () => `m${++counter}`;

function loadUserSources() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(parsed)
      ? parsed.filter((x) => x && typeof x.id === 'string' && typeof x.title === 'string' && typeof x.body === 'string').slice(0, MAX_USER_SOURCES)
      : [];
  } catch {
    return [];
  }
}

function Highlighted({ text, terms }) {
  return highlightParts(text, terms).map((part, i) =>
    part.hit ? <mark className="term" key={i}>{part.text}</mark> : <span key={i}>{part.text}</span>,
  );
}

function SourceChip({ source, index, open, onToggle }) {
  return (
    <button type="button" className={`chip${open ? ' is-open' : ''}`} aria-expanded={open} onClick={onToggle}>
      <span className="cite-marker static">{index + 1}</span>
      {source.title}
    </button>
  );
}

function Message({ message, onOpenSource }) {
  const [openId, setOpenId] = useState(null);
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  const openSource = message.sources?.find((s) => s.id === openId);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <motion.div
      layout="position"
      className={`msg ${isUser ? 'msg-user' : 'msg-bot'}${message.error ? ' is-error' : ''}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      transition={{ duration: 0.4, ease }}
    >
      <p className="msg-who">{isUser ? 'Kamu' : 'Cognexy'}</p>
      <div className="bubble">
        {message.pending ? (
          <span className="thinking">
            Membaca kutipan<span className="dots" aria-hidden="true"><i /><i /><i /></span>
          </span>
        ) : (
          message.text
        )}
      </div>

      {!message.pending && message.sources?.length > 0 && (
        <div className="msg-sources">
          <p className="msg-sources-label">Dasar jawaban</p>
          <div className="chips">
            {message.sources.map((source, i) => (
              <SourceChip
                key={source.id}
                source={source}
                index={i}
                open={openId === source.id}
                onToggle={() => setOpenId(openId === source.id ? null : source.id)}
              />
            ))}
          </div>
          <AnimatePresence initial={false}>
            {openSource && (
              <motion.div
                key={openSource.id}
                className="excerpt"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease }}
                style={{ overflow: 'hidden' }}
              >
                <div className="excerpt-inner">
                  <p className="excerpt-label">Kutipan yang dikirim ke Claude (Anthropic)</p>
                  <p className="excerpt-text"><Highlighted text={openSource.excerpt} terms={openSource.terms} /></p>
                  <button type="button" className="link-btn" onClick={() => onOpenSource(openSource.id)}>
                    Buka dokumen lengkap
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {!message.error && (
            <button type="button" className="link-btn" onClick={copy}>
              {copied ? 'Tersalin' : 'Salin jawaban'}
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default function Workspace() {
  const [tab, setTab] = useState('chat');
  const [userSources, setUserSources] = useState([]);
  const [messages, setMessages] = useState(() => [{ id: nextId(), role: 'assistant', text: WELCOME }]);
  const [history, setHistory] = useState([]);
  const [lastSources, setLastSources] = useState([]);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState({ state: 'checking', model: '', provider: 'claude' });
  const [notice, setNotice] = useState(null);
  const [highlightId, setHighlightId] = useState(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [draft, setDraft] = useState({ title: '', body: '' });
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const noticeTimer = useRef(null);

  const sources = [...DEFAULT_SOURCES, ...userSources];

  useEffect(() => {
    setUserSources(loadUserSources());
    fetch('/api/status', { headers: { accept: 'application/json' } })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setStatus({ state: d.configured ? 'ready' : 'off', model: d.model, provider: d.provider || 'claude' }))
      .catch(() => setStatus({ state: 'unknown', model: '', provider: 'claude' }));
  }, []);

  useLayoutEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const say = useCallback((text, error = false) => {
    setNotice({ text, error });
    clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(null), 5000);
  }, []);

  const persist = (next, okText) => {
    setUserSources(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      say(okText);
    } catch {
      say('Perubahan tampil di sesi ini, tapi penyimpanan browser penuh. Hapus catatan lama.', true);
    }
  };

  const makeSource = (title, body, type) => ({
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: title.trim(),
    body: body.trim(),
    type,
  });

  const ask = async (raw) => {
    const q = raw.trim();
    if (!q || busy) return;
    setInput('');
    const userMsg = { id: nextId(), role: 'user', text: q };

    let ranked = rankSources(q, sources);
    if (!ranked.length && lastSources.length && history.length) {
      ranked = lastSources.map((src) => ({ src, terms: tokens(q) }));
    }
    if (!ranked.length) {
      setMessages((m) => [
        ...m,
        userMsg,
        { id: nextId(), role: 'assistant', text: 'Aku belum menemukan sumber yang cukup relevan. Coba pakai kata yang ada di dokumen, atau tambahkan sumber terkait.' },
      ]);
      return;
    }

    const cited = ranked.map(({ src, terms }) => ({
      id: src.id,
      title: src.title,
      terms,
      excerpt: bestExcerpt(src, terms).slice(0, 1800),
    }));
    const pendingId = nextId();
    setMessages((m) => [...m, userMsg, { id: pendingId, role: 'assistant', pending: true, sources: cited }]);
    setBusy(true);

    let reply;
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({
          question: q,
          sources: cited.map(({ id, title, excerpt }) => ({ id, title, text: excerpt })),
          history,
        }),
      });
      let data = {};
      try {
        data = await response.json();
      } catch {
        /* non-JSON error body */
      }
      if (!response.ok) throw new Error(data.error || 'Permintaan belum berhasil. Coba lagi.');
      reply = { id: pendingId, role: 'assistant', text: data.answer, sources: cited };
      setHistory((h) => [...h, { role: 'user', text: q }, { role: 'assistant', text: data.answer }].slice(-8));
      setLastSources(ranked.map((r) => r.src));
    } catch (error) {
      reply = {
        id: pendingId,
        role: 'assistant',
        error: true,
        text: error instanceof TypeError ? 'Tidak dapat menghubungi server Cognexy. Periksa koneksi atau konfigurasi deployment.' : error.message || 'Jawaban belum tersedia. Coba lagi.',
        sources: cited,
      };
    }
    setMessages((m) => m.map((x) => (x.id === pendingId ? reply : x)));
    setBusy(false);
    inputRef.current?.focus();
  };

  const openSource = (id) => {
    setTab('sources');
    setHighlightId(id);
    setTimeout(() => {
      document.getElementById(`source-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 120);
    setTimeout(() => setHighlightId(null), 2200);
  };

  const submitDraft = (e) => {
    e.preventDefault();
    const title = draft.title.trim();
    const body = draft.body.trim();
    if (!title || !body) return;
    if (userSources.length >= MAX_USER_SOURCES) return say(`Batas ${MAX_USER_SOURCES} catatan tercapai. Hapus catatan lama dulu.`, true);
    if (body.length > MAX_SOURCE_CHARS) return say('Catatan terlalu panjang. Maksimum 5.000 karakter.', true);
    persist([...userSources, makeSource(title, body, 'Catatan')], 'Catatan tersimpan di browser ini. Coba tanyakan isinya.');
    setDraft({ title: '', body: '' });
    setComposerOpen(false);
  };

  const importFiles = async (e) => {
    const files = [...e.target.files];
    e.target.value = '';
    let next = [...userSources];
    let added = 0;
    for (const file of files) {
      const ext = file.name.split('.').pop().toLowerCase();
      if (!['txt', 'md', 'csv'].includes(ext)) { say(`${file.name}: format belum didukung. Pilih .txt, .md, atau .csv.`, true); continue; }
      if (file.size > MAX_FILE_BYTES) { say(`${file.name}: melebihi batas 200 KB.`, true); continue; }
      if (next.length >= MAX_USER_SOURCES) { say(`Batas ${MAX_USER_SOURCES} catatan tercapai.`, true); break; }
      try {
        const body = (await file.text()).trim();
        if (!body) { say(`${file.name}: file kosong.`, true); continue; }
        if (body.length > MAX_SOURCE_CHARS) { say(`${file.name}: melebihi batas 5.000 karakter.`, true); continue; }
        next = [...next, makeSource(file.name, body, 'Impor')];
        added += 1;
      } catch {
        say(`${file.name} tidak dapat dibaca.`, true);
      }
    }
    if (added) persist(next, `${added} file ditambahkan ke browser ini.`);
  };

  const removeSource = (id) => persist(userSources.filter((s) => s.id !== id), 'Catatan dihapus.');

  const clearChat = () => {
    setMessages([{ id: nextId(), role: 'assistant', text: WELCOME }]);
    setHistory([]);
    setLastSources([]);
  };

  const statusLabel = {
    checking: 'Memeriksa AI…',
    ready: `${status.provider === 'gemini' ? 'Gemini' : 'Claude'} siap · ${status.model}`,
    off: 'AI belum diaktifkan',
    unknown: 'Status AI tidak tersedia',
  }[status.state];

  const onTabKey = (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const next = tab === 'chat' ? 'sources' : 'chat';
    setTab(next);
    document.getElementById(`tab-${next}`)?.focus();
  };

  return (
    <section className="section section-tint" id="ruang-kerja">
      <div className="wrap workspace-grid">
        <Reveal className="workspace-intro">
          <p className="kicker">Ruang Kerja Interaktif</p>
          <h2>Coba langsung pada dokumen pengetahuan.</h2>
          <p className="section-lede">
            Jelajahi basis pengetahuan contoh Rona Botanics atau unggah dokumen bisnis Anda sendiri. Telusuri kutipan kalimat persis yang mendasari setiap jawaban.
          </p>
          <p className="fine">
            <strong>Keamanan data terjamin.</strong> Seluruh data diproses secara terisolasi dan transparan tanpa penyimpanan permanen pihak ketiga.
          </p>
        </Reveal>

        <Reveal className="workspace" delay={0.1}>
          <div className="ws-top">
            <div>
              <strong>Rona Botanics</strong>
              <span>Dokumen contoh · {sources.length} sumber</span>
            </div>
            <span className="ai-status" data-state={status.state}><i />{statusLabel}</span>
          </div>

          <LayoutGroup id="ws-tabs">
            <div className="ws-tabs" role="tablist" aria-label="Isi ruang kerja" onKeyDown={onTabKey}>
              {[
                ['chat', 'Percakapan'],
                ['sources', `Sumber (${sources.length})`],
              ].map(([key, label]) => (
                <button
                  key={key}
                  id={`tab-${key}`}
                  type="button"
                  role="tab"
                  aria-selected={tab === key}
                  aria-controls={`panel-${key}`}
                  tabIndex={tab === key ? 0 : -1}
                  onClick={() => setTab(key)}
                >
                  {label}
                  {tab === key && <motion.span layoutId="tab-underline" className="tab-underline" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
                </button>
              ))}
            </div>
          </LayoutGroup>

          {tab === 'chat' ? (
            <div className="ws-panel" id="panel-chat" role="tabpanel" aria-labelledby="tab-chat">
              <div className="messages" ref={listRef} aria-live="polite">
                <AnimatePresence initial={false}>
                  {messages.map((m) => (
                    <Message key={m.id} message={m} onOpenSource={openSource} />
                  ))}
                </AnimatePresence>
              </div>

              <div className="suggest">
                {SUGGESTIONS.map((s) => (
                  <button key={s} type="button" className="suggest-btn" disabled={busy} onClick={() => ask(s)}>{s}</button>
                ))}
                <button type="button" className="link-btn push" onClick={clearChat}>Bersihkan</button>
              </div>

              <form className="composer" onSubmit={(e) => { e.preventDefault(); ask(input); }}>
                <label className="sr-only" htmlFor="chat-input">Pertanyaan tentang dokumen</label>
                <input
                  id="chat-input"
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  maxLength={180}
                  autoComplete="off"
                  disabled={busy}
                  placeholder="Tulis pertanyaanmu…"
                />
                <motion.button whileTap={{ scale: 0.92 }} className="send" type="submit" disabled={busy || !input.trim()} aria-label="Kirim pertanyaan">
                  <SendIcon />
                </motion.button>
              </form>
              <p className="ws-foot">Jawaban AI dapat keliru. Periksa kutipannya.</p>
            </div>
          ) : (
            <div className="ws-panel sources" id="panel-sources" role="tabpanel" aria-labelledby="tab-sources">
              <div className="sources-actions">
                <label className="btn btn-outline btn-sm" htmlFor="file-input"><UploadIcon size={15} /> Impor file</label>
                <input id="file-input" className="sr-only" type="file" multiple accept=".txt,.md,.csv,text/plain,text/markdown,text/csv" onChange={importFiles} />
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setComposerOpen((o) => !o)} aria-expanded={composerOpen}>
                  <PlusIcon size={15} /> Tambah catatan
                </button>
              </div>

              <AnimatePresence initial={false}>
                {composerOpen && (
                  <motion.form
                    className="note-form"
                    onSubmit={submitDraft}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="note-form-inner">
                      <label className="sr-only" htmlFor="note-title">Nama sumber</label>
                      <input id="note-title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} maxLength={70} placeholder="Nama sumber, mis. FAQ layanan" required />
                      <label className="sr-only" htmlFor="note-body">Isi sumber</label>
                      <textarea id="note-body" value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} maxLength={MAX_SOURCE_CHARS} placeholder="Tempel informasi bisnis yang ingin dicari…" required />
                      <div className="note-form-row">
                        <span className="fine">Maks. 5.000 karakter · tersimpan di browser ini</span>
                        <button type="submit" className="btn btn-primary btn-sm">Simpan</button>
                      </div>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              <div className="source-list">
                <AnimatePresence initial={false}>
                  {sources.map((src) => (
                    <motion.article
                      layout
                      key={src.id}
                      id={`source-${src.id}`}
                      className={`source${highlightId === src.id ? ' is-flash' : ''}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.3, ease }}
                    >
                      <div className="source-head">
                        <span className="source-ico"><DocIcon size={16} /></span>
                        <div>
                          <h3>{src.title}</h3>
                          <p>{src.type === 'Contoh' ? 'Dokumen contoh · fiktif' : 'Disimpan di browser ini'}</p>
                        </div>
                        {src.type !== 'Contoh' && (
                          <button type="button" className="link-btn danger" onClick={() => removeSource(src.id)} aria-label={`Hapus ${src.title}`}>Hapus</button>
                        )}
                      </div>
                      <p className="source-body">{src.body}</p>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          <div className="ws-notice" role="status" aria-live="polite">
            <AnimatePresence>
              {notice && (
                <motion.p
                  key={notice.text}
                  className={notice.error ? 'is-error' : ''}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {notice.text}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
