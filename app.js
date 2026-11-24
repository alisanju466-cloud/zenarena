const modes = [
  {name:"Lone Wolf",sub:"1v1 duel",icon:"⚔",short:"LW"},
  {name:"Craftland",sub:"Custom maps",icon:"▦",short:"CL"},
  {name:"Battle Royale",sub:"Squad survival",icon:"◎",short:"BR"},
  {name:"CS 1v1",sub:"Solo clash",icon:"1V1",short:"1V1"},
  {name:"CS 2v2",sub:"Duo clash",icon:"2V2",short:"2V2"},
  {name:"CS 4v4",sub:"Squad clash",icon:"4V4",short:"4V4"},
  {name:"CS 1v4",sub:"Challenge mode",icon:"1V4",short:"1V4"}
];

const defaultLeaders = [
  {name:"ShadowX",matches:0,wins:0,points:0,initials:"SX"},
  {name:"RX Legend",matches:0,wins:0,points:0,initials:"RX"},
  {name:"NOVA",matches:0,wins:0,points:0,initials:"NV"}
];
let tournaments = JSON.parse(localStorage.getItem("zenox_tournaments") || "[]");
let joined = JSON.parse(localStorage.getItem("zenox_joined") || "[]");
let leaders = JSON.parse(localStorage.getItem("zenox_leaders") || "null") || defaultLeaders;
let selectedFilter = "All";
let demoPoints = 0;
let toastTimer;

function saveData(){
  localStorage.setItem("zenox_tournaments",JSON.stringify(tournaments));
  localStorage.setItem("zenox_joined",JSON.stringify(joined));
  localStorage.setItem("zenox_leaders",JSON.stringify(leaders));
}
function toast(message){
  const el=document.getElementById("toast");
  el.textContent=message;el.classList.add("show");
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2800);
}
function goTo(page){
  document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id===`page-${page}`));
  document.querySelectorAll(".nav-link").forEach(b=>b.classList.toggle("active",b.dataset.page===page));
  document.getElementById("mobileMenu").classList.remove("open");
  window.scrollTo({top:0,behavior:"smooth"});
}
document.addEventListener("click",e=>{
  const btn=e.target.closest("[data-page]");
  if(btn)goTo(btn.dataset.page);
});
document.getElementById("menuToggle").addEventListener("click",()=>document.getElementById("mobileMenu").classList.toggle("open"));

function cardHTML(t){
  const statusClass=t.status==="LIVE"?"tag-red":t.status==="UPCOMING"?"tag-green":"tag-muted";
  const isJoined=joined.includes(t.id);
  const full=t.joinedCount>=t.slots;
  let action=t.status==="COMPLETED"?"Completed":isJoined?"Joined ✓":full?"Full":"Join free";
  const disabled=t.status==="COMPLETED"||isJoined||full;
  return `<article class="tournament-card">
    <div class="card-art"><span class="card-status tag ${statusClass}">${t.status==="LIVE"?'<i class="live-dot"></i> ':''}${t.status}</span><strong>${t.code}</strong></div>
    <div class="card-body"><div class="card-title-row"><h3>${escapeHTML(t.name)}</h3></div><p class="card-sub">${escapeHTML(t.mode)} · Free community match</p>
    <div class="card-meta"><span>PLAYERS<b>${t.joinedCount}/${t.slots}</b></span><span>SCHEDULE<b>${escapeHTML(t.time)}</b></span></div>
    <div class="card-footer"><small>${full?"Slots full":"Free registration"}</small><button class="card-join" data-join="${t.id}" ${disabled?"disabled":""}>${action}</button></div></div></article>`;
}
function escapeHTML(value){
  return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function renderModes(){
  document.getElementById("modeGrid").innerHTML=modes.map(m=>`<button class="mode-card" data-mode="${m.name}"><span class="mode-icon">${m.icon}</span><b>${m.name}</b><small>${m.sub}</small></button>`).join("");
  document.querySelectorAll("[data-mode]").forEach(b=>b.addEventListener("click",()=>{selectedFilter=b.dataset.mode;goTo("tournaments");renderFilters();renderTournaments();}));
}
function renderFilters(){
  const all=["All",...modes.map(m=>m.name)];
  document.getElementById("tournamentFilters").innerHTML=all.map(f=>`<button class="filter ${selectedFilter===f?"active":""}" data-filter="${f}">${f==="All"?"All modes":f}</button>`).join("");
  document.querySelectorAll("[data-filter]").forEach(b=>b.addEventListener("click",()=>{selectedFilter=b.dataset.filter;renderFilters();renderTournaments();}));
}
function renderTournaments(){
  const list=tournaments.filter(t=>selectedFilter==="All"||t.mode===selectedFilter);
  document.getElementById("allTournamentGrid").innerHTML=list.length?list.map(cardHTML).join(""):'<div class="empty-state">No tournaments published yet. Check back when the organizer adds a match.</div>';
  document.getElementById("featuredGrid").innerHTML=tournaments.slice(0,3).map(cardHTML).join("")||'<div class="empty-state">No featured tournaments yet. The organizer will publish games here.</div>';
}
function renderLive(){
  const list=tournaments.filter(t=>t.status==="LIVE"||t.status==="COMPLETED");
  document.getElementById("liveGrid").innerHTML=list.length?list.map(cardHTML).join(""):'<div class="empty-state">No live or completed games yet.</div>';
}
function renderLeaders(){
  document.getElementById("leaderRows").innerHTML=leaders.map((p,i)=>`<div class="leader-row"><div class="leader-player"><span class="rank ${i<3?"top":""}">#${i+1}</span><span class="player-chip">${escapeHTML(p.initials)}</span><span class="player-name"><b>${escapeHTML(p.name)}</b><small>Community player</small></span></div><span>${p.matches}</span><span>${p.wins}</span><span class="points">${p.points.toLocaleString("en-IN")}</span></div>`).join("")||'<div class="empty-state">No results recorded yet.</div>';
  document.getElementById("homeLeaders").innerHTML=leaders.slice(0,3).map((p,i)=>`<div class="leader-mini"><span class="rank top">#${i+1}</span><span class="player-name"><b>${escapeHTML(p.name)}</b><small>${p.wins} wins</small></span><span class="points">${p.points.toLocaleString("en-IN")} pts</span></div>`).join("")||'<p class="form-note">Rankings appear after results are recorded.</p>';
}
function renderPoints(){
  document.getElementById("topPoints").textContent="0";
  document.getElementById("walletPoints").textContent="0";
}
function renderTransactions(){
  document.getElementById("transactions").innerHTML='<div class="transaction"><span><b>Starting balance</b><small>New player account</small></span><strong>0 pts</strong></div><div class="transaction"><span><b>Cash features</b><small>Not available in this community demo</small></span><strong>DISABLED</strong></div>';
}
function renderAdmin(){
  const adminGames=document.getElementById("adminGames");
  adminGames.innerHTML=tournaments.length?tournaments.map(t=>`<div class="admin-game-row"><div><b>${escapeHTML(t.name)}</b><small>${escapeHTML(t.mode)} · ${t.joinedCount}/${t.slots} joined</small></div><select data-status="${t.id}" aria-label="Match status"><option ${t.status==="UPCOMING"?"selected":""}>UPCOMING</option><option ${t.status==="LIVE"?"selected":""}>LIVE</option><option ${t.status==="COMPLETED"?"selected":""}>COMPLETED</option></select></div>`).join(""):'<div class="empty-state">No tournaments published yet.</div>';
  document.getElementById("resultManager").innerHTML=leaders.map((p,i)=>`<div class="admin-game-row"><div><b>${escapeHTML(p.name)}</b><small>${p.matches} matches · ${p.wins} wins · ${p.points} points</small></div><button class="card-join" data-win="${i}">Record demo win</button></div>`).join("");
  document.querySelectorAll("[data-status]").forEach(s=>s.addEventListener("change",()=>{const t=tournaments.find(x=>x.id===Number(s.dataset.status));if(t){t.status=s.value;saveData();renderAll();toast("Tournament status updated.");}}));
  document.querySelectorAll("[data-win]").forEach(b=>b.addEventListener("click",()=>{const p=leaders[Number(b.dataset.win)];p.matches++;p.wins++;p.points+=100;saveData();renderAll();toast(`Demo result recorded for ${p.name}.`);}));
}
function renderAll(){renderTournaments();renderLive();renderLeaders();renderPoints();renderTransactions();renderAdmin();}
document.getElementById("createTournamentForm").addEventListener("submit",e=>{
  e.preventDefault();
  const name=document.getElementById("newGameName").value.trim();
  const mode=document.getElementById("newGameMode").value;
  const slots=Number(document.getElementById("newGameSlots").value);
  const time=document.getElementById("newGameTime").value.trim();
  if(!name||!time||slots<2)return;
  const code=({ "Lone Wolf":"LW","Craftland":"CL","Battle Royale":"BR","CS 1v1":"1V1","CS 2v2":"2V2","CS 4v4":"4V4","CS 1v4":"1V4"})[mode];
  tournaments.unshift({id:Date.now(),name,mode,slots,time,code,status:"UPCOMING",joinedCount:0});
  saveData();e.target.reset();document.getElementById("newGameSlots").value=16;renderAll();toast("Tournament published on this browser.");goTo("tournaments");
});
document.addEventListener("click",e=>{
  const join=e.target.closest("[data-join]");
  if(join){
    const id=Number(join.dataset.join),t=tournaments.find(x=>x.id===id);
    if(!t||joined.includes(id)||t.joinedCount>=t.slots||t.status==="COMPLETED")return;
    t.joinedCount++;joined.push(id);saveData();renderAll();toast(`Free registration saved for ${t.name}.`);
  }
});
document.getElementById("refreshLeaderboard").addEventListener("click",()=>{renderLeaders();toast("Leaderboard refreshed from saved demo results.");});
document.getElementById("editProfile").addEventListener("click",()=>{
  const current=document.getElementById("profileName").textContent;
  const name=prompt("Choose a display name (max 20 characters):",current);
  if(name&&name.trim()){document.getElementById("profileName").textContent=name.trim().slice(0,20).toUpperCase();toast("Display name updated in this browser demo.");}
});
document.getElementById("supportForm").addEventListener("submit",e=>{
  e.preventDefault();const name=document.getElementById("supportName").value.trim();const message=document.getElementById("supportMessage").value.trim();
  if(!name||!message)return;toast("Demo ticket created locally. No message was sent.");e.target.reset();
});
renderModes();renderFilters();renderAll();
