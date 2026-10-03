'use strict';
/* ===== DATA ===== */
const stats = [
  { value: '8.82', label: 'Current CGPA' }, { value: '2', label: 'Internships' },
  { value: '3', label: 'Projects' }, { value: '4', label: 'Certifications' }
];
const skills = [
  { group: 'Programming Languages', items: ['C', 'Python', 'Java'] },
  { group: 'Database', items: ['MySQL'] },
  { group: 'Web Technologies', items: ['HTML', 'CSS', 'Bootstrap', 'JavaScript'] },
  { group: 'Core Subjects', items: ['DBMS', 'Computer Networks', 'AI/ML Basics'] }
];
const projects = [
  { title: 'Digital Health Record Management System', desc: 'Web platform for secure storage and management of migrant workers\' health records.', tech: ['Flask', 'MySQL'], cats: ['web', 'python'] },
  { title: 'Student Management System', desc: 'CRUD application for managing student records and attendance.', tech: ['Node.js', 'MySQL'], cats: ['web'] },
  { title: 'Java-Based Online Quiz Application', desc: 'Interactive quiz system built using Java Swing and OOP principles.', tech: ['Java', 'Swing', 'OOP'], cats: ['java'] }
];
const certs = [
  'Internship Completion Certificate - Purview India Consulting and Services LLP',
  'Internship Completion Certificate - Cognifyz Technologies',
  'Python Programming: Beyond Basics to Applications - Udemy',
  'Machine Learning Course Completion Certificate - Cognitive Class'
];

/* ===== RENDER (arrays, loops, template literals, DOM) ===== */
const $ = id => document.getElementById(id);

$('stats').innerHTML = stats.map(s =>
  `<div class="col-6 col-md-3"><div class="stat reveal"><strong>${s.value}</strong><span>${s.label}</span></div></div>`).join('');

$('skillsGrid').innerHTML = skills.map(({ group, items }) => `
  <div class="col-md-6"><div class="card h-100 hover-card reveal"><div class="card-body">
    <h3 class="h6 text-uppercase text-accent mb-3">${group}</h3>
    <div class="tag-grid">${items.map(i => `<span class="tag">${i}</span>`).join('')}</div>
  </div></div></div>`).join('');

$('certList').innerHTML = certs.map(c => `
  <div class="col-md-6"><div class="card card-body hover-card reveal flex-row align-items-center gap-3">
    <span aria-hidden="true" class="fs-3">🏅</span><span>${c}</span></div></div>`).join('');

const renderProjects = (filter = 'all') => {
  const list = filter === 'all' ? projects : projects.filter(p => p.cats.includes(filter));
  $('projectGrid').innerHTML = list.length ? list.map(p => `
    <div class="col-md-6 col-lg-4"><article class="card h-100 hover-card">
      <div class="card-body">
        <h3 class="h5">${p.title}</h3>
        <p>${p.desc}</p>
        <div class="tag-grid">${p.tech.map(t => `<span class="tag">${t}</span>`).join('')}</div>
      </div>
      <div class="card-footer bg-transparent border-0 pb-3">
        <a href="https://github.com/SnehaKommu" target="_blank" rel="noopener" class="btn btn-sm btn-outline-primary">View on GitHub ↗</a>
      </div></article></div>`).join('') : '<p>No projects found.</p>';
};
renderProjects();

/* ===== FEATURE 1: project filtering ===== */
document.querySelectorAll('.filter-btn').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('.filter-btn').forEach(b => {
    const active = b === btn;
    b.classList.toggle('btn-primary', active);
    b.classList.toggle('btn-outline-primary', !active);
    b.setAttribute('aria-pressed', active);
  });
  renderProjects(btn.dataset.filter);
}));

/* ===== FEATURE 2: theme switching (saved in localStorage) ===== */
const root = document.documentElement, themeBtn = $('themeToggle');
const applyTheme = t => { root.setAttribute('data-bs-theme', t); themeBtn.textContent = t === 'dark' ? '☀️ Light' : '🌙 Dark'; };
applyTheme(localStorage.getItem('theme') || 'light');
themeBtn.addEventListener('click', () => {
  const next = root.getAttribute('data-bs-theme') === 'light' ? 'dark' : 'light';
  applyTheme(next); localStorage.setItem('theme', next);
});

/* ===== FEATURE 3: scroll reveal, active nav link, back-to-top ===== */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('show'); io.unobserve(e.target); } }), { threshold: .15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

const links = document.querySelectorAll('.nav-link');
const sections = [...document.querySelectorAll('main section')];
window.addEventListener('scroll', () => {
  const y = window.scrollY + 120;
  const current = sections.filter(s => s.offsetTop <= y).pop();
  links.forEach(l => l.classList.toggle('active', current && l.getAttribute('href') === `#${current.id}`));
  $('toTop').style.display = window.scrollY > 400 ? 'block' : 'none';
});
$('toTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ===== FORM VALIDATION ===== */
const form = $('contactForm');
const rules = {
  name:    { test: v => /^[A-Za-z ]{3,}$/.test(v.trim()), msg: 'Enter your name (letters only, minimum 3 characters).' },
  email:   { test: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v), msg: 'Enter a valid email address.' },
  message: { test: v => v.trim().length >= 10, msg: 'Message must be at least 10 characters.' }
};
const validateField = id => {
  const input = $(id), ok = rules[id].test(input.value);
  input.classList.toggle('is-invalid', !ok);
  input.classList.toggle('is-valid', ok);
  $(id + 'Err').textContent = ok ? '' : rules[id].msg;
  return ok;
};
Object.keys(rules).forEach(id => $(id).addEventListener('input', () => validateField(id)));

form.addEventListener('submit', e => {
  e.preventDefault();
  const valid = Object.keys(rules).map(validateField).every(Boolean);
  $('formAlert').innerHTML = valid
    ? '<div class="alert alert-success">Thank you! Your message has been sent successfully.</div>'
    : '<div class="alert alert-danger">Please correct the highlighted fields.</div>';
  if (valid) { form.reset(); form.querySelectorAll('.is-valid').forEach(el => el.classList.remove('is-valid')); }
});