/* ── LOADER ── */
window.addEventListener('load', () => {
  const bar = document.getElementById('loaderBar');
  bar.style.width = '100%';
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    document.getElementById('heroBg').classList.add('loaded');
    animateCounters();
  }, 1800);
});

/* ── CURSOR ── */
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; cursor.style.left=mx+'px'; cursor.style.top=my+'px'; });
(function animRing(){
  rx+=(mx-rx)*0.12; ry+=(my-ry)*0.12;
  ring.style.left=rx+'px'; ring.style.top=ry+'px';
  requestAnimationFrame(animRing);
})();
document.querySelectorAll('a,button,.port-item,.service-card,.testi-card,.blog-card').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.style.width='20px'; cursor.style.height='20px'; ring.style.width='56px'; ring.style.height='56px'; ring.style.opacity='0.3'; });
  el.addEventListener('mouseleave', () => { cursor.style.width='12px'; cursor.style.height='12px'; ring.style.width='36px'; ring.style.height='36px'; ring.style.opacity='0.6'; });
});

/* ── NAV ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if(window.scrollY > 80) navbar.classList.add('scrolled'); else navbar.classList.remove('scrolled');
  const btn = document.getElementById('scrollTopBtn');
  if(window.scrollY > 600) btn.classList.add('show'); else btn.classList.remove('show');
});

function toggleMobile(){ document.getElementById('mobileMenu').classList.toggle('open'); }
function closeMobile(){ document.getElementById('mobileMenu').classList.remove('open'); }

/* ── HERO CANVAS — gold particle lines ── */
(function(){
  const canvas = document.getElementById('heroCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles=[];
  function resize(){ W=canvas.width=canvas.offsetWidth; H=canvas.height=canvas.offsetHeight; }
  resize(); window.addEventListener('resize', resize);
  class Particle {
    constructor(){ this.reset(); }
    reset(){
      this.x = Math.random()*W; this.y = Math.random()*H;
      this.vx = (Math.random()-0.5)*0.4; this.vy = (Math.random()-0.5)*0.4;
      this.alpha = Math.random()*0.3+0.05; this.r = Math.random()*1.5+0.5;
    }
    update(){ this.x+=this.vx; this.y+=this.vy; if(this.x<0||this.x>W||this.y<0||this.y>H) this.reset(); }
    draw(){ ctx.beginPath(); ctx.arc(this.x,this.y,this.r,0,Math.PI*2); ctx.fillStyle=`rgba(201,168,76,${this.alpha})`; ctx.fill(); }
  }
  for(let i=0;i<90;i++) particles.push(new Particle());
  function animate(){
    ctx.clearRect(0,0,W,H);
    particles.forEach(p=>p.update());
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const dx=particles[i].x-particles[j].x, dy=particles[i].y-particles[j].y;
        const dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<120){ ctx.beginPath(); ctx.moveTo(particles[i].x,particles[i].y); ctx.lineTo(particles[j].x,particles[j].y); ctx.strokeStyle=`rgba(201,168,76,${0.08*(1-dist/120)})`; ctx.stroke(); }
      }
      particles[i].draw();
    }
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ── COUNTER ANIMATION ── */
function animateCounters(){
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    let count = 0; const inc = target/60;
    const t = setInterval(()=>{ count+=inc; if(count>=target){clearInterval(t); el.textContent=target+(el.dataset.suffix||'');} else el.textContent=Math.floor(count); }, 25);
  });
}

/* ── SCROLL REVEAL ── */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el => revealObs.observe(el));

/* ── PORTFOLIO FILTER ── */
function filterPorts(cat, btn){
  document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.port-item').forEach(item=>{
    if(cat==='all'||item.dataset.cat===cat){ item.style.opacity='1'; item.style.display=''; }
    else { item.style.opacity='0.15'; }
  });
}

/* ── BEFORE/AFTER ── */
(function(){
  const wrap = document.getElementById('baWrap');
  const before = document.getElementById('baBefore');
  const handle = document.getElementById('baHandle');
  if(!wrap) return;
  let dragging = false, pct = 50;
  function setPos(x){
    const rect = wrap.getBoundingClientRect();
    pct = Math.max(5, Math.min(95, ((x - rect.left)/rect.width)*100));
    before.style.clipPath = `inset(0 ${100-pct}% 0 0)`;
    handle.style.left = pct+'%';
  }
  wrap.addEventListener('mousedown', e=>{ dragging=true; setPos(e.clientX); });
  window.addEventListener('mousemove', e=>{ if(dragging) setPos(e.clientX); });
  window.addEventListener('mouseup', ()=>dragging=false);
  wrap.addEventListener('touchstart', e=>{ dragging=true; setPos(e.touches[0].clientX); }, {passive:true});
  window.addEventListener('touchmove', e=>{ if(dragging) setPos(e.touches[0].clientX); }, {passive:true});
  window.addEventListener('touchend', ()=>dragging=false);
})();

/* ── HELPERS ── */
function esc(s){ return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function showToast(msg){
  const toast = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  toast.style.transform = 'translateX(-50%) translateY(0)';
  toast.style.opacity = '1';
  clearTimeout(showToast._t);
  showToast._t = setTimeout(()=>{ toast.style.transform='translateX(-50%) translateY(100px)'; toast.style.opacity='0'; }, 4000);
}
async function postJSON(url, body){
  const res = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
  const data = await res.json().catch(()=>({}));
  if(!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

/* ── AI DESIGN ASSISTANT (calls our own server, which holds the API key) ── */
async function handleAI(){
  const input = document.getElementById('aiInput');
  const query = input.value.trim();
  if(!query) return;

  document.getElementById('aiUserBubble').textContent = query;
  document.getElementById('aiUserMsg').style.display = 'flex';
  input.value = '';

  const resultsDiv = document.getElementById('aiResults');
  resultsDiv.innerHTML = '<div style="font-size:0.8rem; color:var(--gold); letter-spacing:0.1em; animation: pulse 1s infinite;">✦ Analysing your vision…</div>';

  try {
    const d = await postJSON('/api/design-assistant', { prompt: query });
    resultsDiv.innerHTML = `
      <div class="ai-result-card"><h5>✦ Recommended Style: ${esc(d.style)}</h5><p>${esc(d.style_desc)}</p></div>
      <div class="ai-result-card"><h5>🎨 Material Palette</h5><p>${esc(d.palette)}</p></div>
      <div class="ai-result-card"><h5>⭐ Signature Element</h5><p>${esc(d.signature)}</p></div>
      <div class="ai-result-card"><h5>✨ Mood</h5><p>${esc(d.mood)}</p></div>`;
    resultsDiv.querySelectorAll('.ai-result-card').forEach((c,i)=> setTimeout(()=>c.classList.add('visible'), 100 + i*200));
  } catch(err) {
    resultsDiv.innerHTML = '<div style="font-size:0.8rem; color:rgba(255,255,255,0.5);">Our design assistant is resting. Please try again shortly, or book a consultation.</div>';
  }
}
document.getElementById('aiInput').addEventListener('keydown', e=>{ if(e.key==='Enter') handleAI(); });

/* ── CONTACT FORM ── */
document.getElementById('contactForm').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.currentTarget;
  const btn = form.querySelector('.form-submit');
  const data = Object.fromEntries(new FormData(form).entries());
  if(!data.name || !/^\S+@\S+\.\S+$/.test(data.email || '')){ showToast('Please enter your name and a valid email.'); return; }
  btn.disabled = true;
  try {
    await postJSON('/api/contact', data);
    showToast("✦ Thank you! We'll be in touch within 4 hours.");
    form.reset();
  } catch(err) {
    showToast('Something went wrong. Please call or email us directly.');
  } finally { btn.disabled = false; }
});

/* ── NEWSLETTER ── */
document.getElementById('nlBtn').addEventListener('click', async () => {
  const input = document.getElementById('nlEmail');
  const email = input.value.trim();
  if(!/^\S+@\S+\.\S+$/.test(email)){ showToast('Please enter a valid email address.'); return; }
  try {
    await postJSON('/api/newsletter', { email });
    showToast('✦ Welcome to the Interior Royal Circle.');
    input.value = '';
  } catch(err) { showToast('Could not subscribe right now. Please try again.'); }
});
