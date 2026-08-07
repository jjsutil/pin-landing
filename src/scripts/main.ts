// Comportamiento del prototipo (design/prototype/pin-landing-v12.html) portado
// tal cual. Diferencias deliberadas respecto del prototipo, y solo estas:
//   - el idioma es de la ruta (Astro i18n): los botones ES/EN navegan entre / y /en/
//     en lugar de re-traducir el DOM;
//   - el toggle de tema persiste en localStorage (única mejora autorizada).
import { T, POOL, PNUMS, type Lang } from '../i18n';

const lang: Lang = document.documentElement.lang === 'en' ? 'en' : 'es';
const d = T[lang];
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------- idioma: ES/EN navegan entre rutas, conservando el hash ---------------- */

// BASE_URL es '/' en local y '/pin-landing/' bajo GitHub Pages (GHPAGES=true).
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

// Desde una página del blog (I-011), ES/EN navegan entre las dos listas del
// blog en vez de ir siempre al home — el post exacto se enlaza aparte, desde
// BlogLayout, vía translations.ts.
const path = window.location.pathname.slice(BASE.length);
const inBlog = path.startsWith('/blog') || path.startsWith('/en/blog');

// Language switch is a full page navigation (no client router), which drops
// scroll position by default unless a #hash is already carrying it somewhere.
// Stash it only when there's no hash — a hash target must keep winning.
// sessionStorage can throw (privacy modes, storage blocked) — swallow it like
// the theme toggle already does with localStorage; the nav must proceed either way.
function stashScrollForLangSwitch(): void {
  if (window.location.hash) return;
  try {
    sessionStorage.setItem('langSwitchScrollY', String(window.scrollY));
  } catch {
    /* sin storage: el switch de idioma igual navega, solo sin restaurar scroll */
  }
}

document.getElementById('lang-es')!.addEventListener('click', () => {
  if (lang !== 'es') {
    stashScrollForLangSwitch();
    window.location.href = BASE + (inBlog ? '/blog' : '/') + window.location.hash;
  }
});
document.getElementById('lang-en')!.addEventListener('click', () => {
  if (lang !== 'en') {
    stashScrollForLangSwitch();
    window.location.href = BASE + (inBlog ? '/en/blog' : '/en/') + window.location.hash;
  }
});

// Restore it once, right after the switch — a normal reload/back-forward
// never sets this key, so they're unaffected.
try {
  const savedScrollY = sessionStorage.getItem('langSwitchScrollY');
  if (savedScrollY !== null) {
    sessionStorage.removeItem('langSwitchScrollY');
    requestAnimationFrame(() => window.scrollTo(0, Number(savedScrollY)));
  }
} catch {
  /* sin storage: no hay scroll que restaurar */
}

/* ---------------- tema ---------------- */

const SUN = 'M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M12.6 3.4l-1.4 1.4M4.8 11.2l-1.4 1.4M8 5.4a2.6 2.6 0 1 0 0 5.2 2.6 2.6 0 0 0 0-5.2Z';
const MOON = 'M13.2 9.6A5.6 5.6 0 0 1 6.4 2.8 5.6 5.6 0 1 0 13.2 9.6Z';
const themeIcon = document.getElementById('theme-icon')!;
const themeBtn = document.getElementById('theme')!;

function isDark(): boolean {
  const set = document.documentElement.getAttribute('data-theme');
  if (set) return set === 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function refreshIcon(): void {
  themeIcon.setAttribute('d', isDark() ? SUN : MOON);
  themeBtn.setAttribute('aria-label', d[isDark() ? 'theme.light' : 'theme.dark']);
}

themeBtn.addEventListener('click', () => {
  const next = isDark() ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  try {
    localStorage.setItem('theme', next);
  } catch {
    /* sin storage: el tema igual cambia para esta vista */
  }
  refreshIcon();
});

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', refreshIcon);
refreshIcon();

/* ---------------- revelado ---------------- */

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('seen');
        io.unobserve(e.target);
      }
    });
  },
  { rootMargin: '0px 0px -10% 0px', threshold: 0.08 }
);

document.querySelectorAll('.rise, .rise-x, .said').forEach((el) => io.observe(el));

/* ---------------- envío por Web3Forms: lo usan el form del hero y el de acceso ---------------- */

// Key pública-por-diseño de Web3Forms, inyectada por entorno (docs/CONFIG.md).
// Sin key configurada, los formularios quedan en modo degradado: confirmación
// en pantalla y nada se envía.
const W3F_KEY: string | undefined = import.meta.env.PUBLIC_WEB3FORMS_KEY || undefined;

async function sendWeb3Forms(subject: string, fields: Record<string, string | boolean>): Promise<boolean> {
  if (!W3F_KEY) return true; // modo degradado: se comporta como éxito, no envía
  try {
    // Sin tope de espera, una red colgada dejaría el botón deshabilitado para siempre.
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      signal: AbortSignal.timeout(15000),
      body: JSON.stringify({
        access_key: W3F_KEY,
        subject,
        from_name: 'pin landing',
        ...fields,
      }),
    });
    const data = await res.json();
    return res.ok && data.success === true;
  } catch {
    return false;
  }
}

/* ---------------- bloque del hero: solo existe en index.astro / en/index.astro ----------
   #figures (Figures.astro) es el guard — visor, cifras, escritura y formulario viven
   siempre juntos en la página del hero, nunca en /blog/**. Sin este guard, el resto
   del script (incluido el handler de #go-access más abajo) nunca llega a registrarse
   en cualquier página que no sea el hero. ---------------------------------------- */

const figs = document.getElementById('figures');

if (figs) {
/* ---------------- visor: la mención elegida abre su página ---------------- */

const hits = Array.from(document.querySelectorAll<HTMLElement>('#viewer .hit'));
const pages = Array.from(document.querySelectorAll<HTMLElement>('#viewer .page'));
const pvNum = document.getElementById('pv-num')!;

function activateHit(i: number): void {
  hits.forEach((h, k) => {
    h.classList.toggle('on', k === i);
    h.setAttribute('aria-pressed', String(k === i));
  });
  pages.forEach((p, k) => p.classList.toggle('on', k === i));
  pvNum.textContent = PNUMS[lang][i] ?? PNUMS[lang][0];
}

/* issue #3.4 — role="button" now responds to Enter and Space, not just pointer/focus */
hits.forEach((h, i) => {
  function take(): void {
    stopDemo();
    activateHit(i);
  }
  h.addEventListener('mouseenter', take);
  h.addEventListener('focus', take);
  h.addEventListener('click', take);
  h.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' || ev.key === ' ' || ev.key === 'Spacebar') {
      ev.preventDefault(); // space would otherwise scroll the page
      take();
    }
  });
});

/* the viewer plays itself once — cycles the three mentions and returns to the
   first. Any reader gesture on a hit (above) stops it for good via stopDemo(). */

let demoTimer: ReturnType<typeof setTimeout> | undefined;
let demoDone = false;

function stopDemo(): void {
  demoDone = true;
  clearTimeout(demoTimer);
}

function runDemo(i: number): void {
  if (demoDone) return;
  activateHit(i % hits.length);
  if (i >= hits.length) {
    demoDone = true;
    return;
  }
  demoTimer = setTimeout(() => runDemo(i + 1), 2200);
}

if (!reduced) {
  const viewerEl = document.getElementById('viewer')!;
  const ioDemo = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting || demoDone) return;
        ioDemo.unobserve(viewerEl);
        demoTimer = setTimeout(() => runDemo(1), 1400);
      });
    },
    { threshold: 0.5 }
  );
  ioDemo.observe(viewerEl);
}

/* ---------------- cifras: conteo al entrar ---------------- */

let counted = false;

function fmt(n: number): string {
  return n.toLocaleString(lang === 'es' ? 'es-CL' : 'en-US');
}

function countUp(el: HTMLElement, target: number): void {
  let t0: number | null = null;
  const dur = 1100 + Math.min(target, 4000) / 8;
  function step(ts: number): void {
    if (!t0) t0 = ts;
    const k = Math.min((ts - t0) / dur, 1);
    const eased = 1 - Math.pow(1 - k, 3);
    el.textContent = fmt(Math.round(target * eased));
    if (k < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const ioFigs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting || counted) return;
      counted = true;
      ioFigs.unobserve(figs);
      if (reduced) return; // el HTML ya trae los valores finales formateados
      figs.querySelectorAll<HTMLElement>('.n').forEach((el) => {
        countUp(el, parseInt(el.getAttribute('data-n') ?? '0', 10));
      });
    });
  },
  { threshold: 0.35 }
);

ioFigs.observe(figs);

/* ---------------- escritura ---------------- */

const out = document.getElementById('typed-text')!;
let timer: ReturnType<typeof setTimeout> | undefined;

function pickThree(): string[] {
  const pool = POOL[lang].slice();
  const three: string[] = [];
  for (let i = 0; i < 3; i++) {
    three.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]!);
  }
  return three;
}

function keyDelay(ch: string, prev: string): number {
  let base = 58 + Math.random() * 78;
  if (ch === ' ') base *= 0.62;
  if (/[,.;:¿?¡!]/.test(prev)) base += 150 + Math.random() * 180;
  if (Math.random() < 0.07) base += 190 + Math.random() * 260;
  return base;
}

function run(list: string[], idx: number, pos: number, deleting: boolean): void {
  const text = list[idx]!;
  const last = idx === list.length - 1;

  if (!deleting) {
    if (pos <= text.length) {
      out.textContent = text.slice(0, pos);
      const prev = pos > 0 ? text.charAt(pos - 1) : '';
      timer = setTimeout(
        () => run(list, idx, pos + 1, false),
        pos === 0 ? 120 : keyDelay(text.charAt(pos), prev)
      );
      return;
    }
    if (last) return; // the third phrase stays on screen, caret included
    timer = setTimeout(() => run(list, idx, text.length, true), 2100);
    return;
  }

  if (pos > 0) {
    out.textContent = text.slice(0, pos - 1);
    timer = setTimeout(() => run(list, idx, pos - 1, true), 26);
    return;
  }

  timer = setTimeout(() => run(list, idx + 1, 0, false), 420);
}

function startTyping(): void {
  clearTimeout(timer);
  if (reduced) {
    out.textContent = POOL[lang][0]!;
    return;
  }
  out.textContent = '';
  run(pickThree(), 0, 0, false);
}

startTyping();

/* ---------------- formulario ---------------- */

const segCase = document.getElementById('seg-causa')!;
const segEarly = document.getElementById('seg-cotiza')!;
const submit = document.getElementById('submit')!;
const done = document.getElementById('done')!;
const wrapSize = document.getElementById('wrap-size')!;
const earlyInfo = document.getElementById('early-info')!;
const sizeSel = document.getElementById('size-sel') as HTMLSelectElement;
const form = document.getElementById('apply') as HTMLFormElement;
let early = false;

function refreshMode(): void {
  segCase.setAttribute('aria-pressed', String(!early));
  segEarly.setAttribute('aria-pressed', String(early));
  wrapSize.classList.toggle('hidden', early);
  earlyInfo.classList.toggle('on', early);
  sizeSel.required = !early;
  submit.textContent = d[early ? 'f.submit.q' : 'f.submit'];
  // una confirmación ya mostrada no se reescribe al cambiar de modo;
  // un error visible sí se limpia (pertenece al intento anterior)
  if (!form.classList.contains('sent')) {
    done.classList.remove('on', 'err');
    done.innerHTML = d[early ? 'done.quote' : 'done.case'];
  }
}

segCase.addEventListener('click', () => {
  early = false;
  refreshMode();
});
segEarly.addEventListener('click', () => {
  early = true;
  refreshMode();
});

// los enlaces con data-mode preseleccionan el modo del formulario
document.querySelectorAll<HTMLAnchorElement>('a[data-mode]').forEach((a) => {
  a.addEventListener('click', () => {
    early = a.getAttribute('data-mode') === 'early';
    refreshMode();
  });
});

form.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  if (!form.reportValidity()) return; // el navegador señala el campo y el motivo
  const btn = submit as HTMLButtonElement;
  btn.disabled = true;
  const ok = await sendWeb3Forms(
    early ? 'pin — early access request' : 'pin — case analysis request',
    {
      name: (document.getElementById('nombre') as HTMLInputElement).value,
      email: (document.getElementById('correo') as HTMLInputElement).value,
      role: (document.getElementById('rol') as HTMLSelectElement).value,
      ...(early ? {} : { file_size: sizeSel.value }),
      request: early ? 'early-access' : 'case-analysis',
      lang,
      botcheck: form.querySelector<HTMLInputElement>('[name="botcheck"]')!.checked,
    }
  );
  btn.disabled = false;
  if (ok) {
    done.innerHTML = d[early ? 'done.quote' : 'done.case'];
    done.classList.remove('err');
    form.classList.add('sent');
  } else {
    done.innerHTML = d['done.error']; // el formulario queda editable para reintentar
    done.classList.add('err');
  }
  done.classList.add('on');
  done.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
});

} // fin del bloque del hero (if (figs))

/* ---------------- vista de acceso: en Base.astro, existe en TODA página ---------------- */

const acForm = document.getElementById('access-form') as HTMLFormElement;
const acDone = document.getElementById('ac-done')!;
const acFields = acForm.querySelector<HTMLElement>('.fields')!;
const acSubmitRow = acForm.querySelector<HTMLElement>('button[type="submit"]')!.parentElement!;

function showAccess(on: boolean): void {
  document.body.classList.toggle('on-access', on);
  if (on) {
    // la tarjeta siempre se abre limpia, aunque ya se haya enviado antes
    acFields.style.display = '';
    acSubmitRow.style.display = '';
    acDone.classList.remove('on', 'err');
    window.scrollTo({ top: 0, behavior: 'auto' });
  }
}

document.getElementById('go-access')!.addEventListener('click', (ev) => {
  ev.preventDefault();
  showAccess(true);
  history.replaceState(null, '', '#acceso');
});

document.getElementById('back')!.addEventListener('click', () => {
  showAccess(false);
  history.replaceState(null, '', '#top');
});

// el logo siempre vuelve a la página, también desde la vista de acceso
document.querySelectorAll<HTMLAnchorElement>('a.mark').forEach((a) => {
  a.addEventListener('click', () => showAccess(false));
});

acForm.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  if (!acForm.reportValidity()) return;
  const acBtn = acForm.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  acBtn.disabled = true;
  const ok = await sendWeb3Forms('pin — early access request (access view)', {
    email: (document.getElementById('ac-mail') as HTMLInputElement).value,
    role: (document.getElementById('ac-role') as HTMLSelectElement).value,
    request: 'early-access',
    lang,
    botcheck: acForm.querySelector<HTMLInputElement>('[name="botcheck"]')!.checked,
  });
  acBtn.disabled = false;
  if (ok) {
    acDone.innerHTML = d['ac.done'];
    acDone.classList.remove('err');
    acFields.style.display = 'none';
    acSubmitRow.style.display = 'none';
  } else {
    acDone.innerHTML = d['done.error']; // los campos quedan visibles para reintentar
    acDone.classList.add('err');
  }
  acDone.classList.add('on');
});

if (window.location.hash === '#acceso') showAccess(true);
