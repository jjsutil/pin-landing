// Comportamiento del prototipo (design/prototype/pin-landing-v8.html) portado tal
// cual. Diferencias deliberadas respecto del prototipo, y solo estas:
//   - el idioma es de la ruta (Astro i18n): los botones ES/EN navegan entre / y /en/
//     en lugar de re-traducir el DOM;
//   - el toggle de tema persiste en localStorage (única mejora autorizada).
import { T, POOL, PNUMS, type Lang } from '../i18n';

const lang: Lang = document.documentElement.lang === 'en' ? 'en' : 'es';
const d = T[lang];
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------- idioma: ES/EN navegan entre rutas, conservando el hash ---------------- */

document.getElementById('lang-es')!.addEventListener('click', () => {
  if (lang !== 'es') window.location.href = '/' + window.location.hash;
});
document.getElementById('lang-en')!.addEventListener('click', () => {
  if (lang !== 'en') window.location.href = '/en/' + window.location.hash;
});

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

hits.forEach((h, i) => {
  h.addEventListener('mouseenter', () => activateHit(i));
  h.addEventListener('focus', () => activateHit(i));
  h.addEventListener('click', () => activateHit(i));
});

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

const figs = document.getElementById('figures')!;
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
// QA del dueño (2026-07-30): al quedar la tercera frase, el caret se oculta —
// el "|" final sobraba. (Delta deliberado respecto del prototipo v8.)
const askCaret = document.querySelector<HTMLElement>('.ask .caret')!;
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
    if (last) {
      askCaret.style.display = 'none'; // la tercera frase queda, sin caret
      return;
    }
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
    askCaret.style.display = 'none';
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
  // una confirmación ya mostrada no se reescribe al cambiar de modo
  if (!form.classList.contains('sent')) {
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

form.addEventListener('submit', (ev) => {
  ev.preventDefault();
  if (!form.reportValidity()) return; // el navegador señala el campo y el motivo
  // TODO(backend): captura pendiente de decisión del dueño
  done.innerHTML = d[early ? 'done.quote' : 'done.case'];
  form.classList.add('sent');
  done.classList.add('on');
  done.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
});

/* ---------------- vista de acceso ---------------- */

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
    acDone.classList.remove('on');
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

acForm.addEventListener('submit', (ev) => {
  ev.preventDefault();
  if (!acForm.reportValidity()) return;
  // TODO(backend): captura pendiente de decisión del dueño
  acDone.innerHTML = d['ac.done'];
  acFields.style.display = 'none';
  acSubmitRow.style.display = 'none';
  acDone.classList.add('on');
});

if (window.location.hash === '#acceso') showAccess(true);
