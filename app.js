const modes = [
  {name:"Lone Wolf",sub:"1v1 duel",icon:"⚔",short:"LW"},
  {name:"Craftland",sub:"Custom maps",icon:"▦",short:"CL"},
  {name:"Battle Royale",sub:"Squad survival",icon:"◎",short:"BR"},
  {name:"CS 1v1",sub:"Solo clash",icon:"1V1",short:"1V1"},
  {name:"CS 2v2",sub:"Duo clash",icon:"2V2",short:"2V2"},
  {name:"CS 4v4",sub:"Squad clash",icon:"4V4",short:"4V4"},
  {name:"CS 1v4",sub:"Challenge mode",icon:"1V4",short:"1V4"}
];

const tournaments = [
  {id:1,name:"Lone Wolf Showdown",mode:"Lone Wolf",status:"LIVE",players:"18/24",time:"Live now",code:"LW"},
  {id:2,name:"Craftland Rush",mode:"Craftland",status:"UPCOMING",players:"21/32",time:"Today · 6:30 PM",code:"CL"},
  {id:3,name:"Battle Royale Squad",mode:"Battle Royale",status:"UPCOMING",players:"36/48",time:"Today · 7:00 PM",code:"BR"},
  {id:4,name:"Clash Solo Arena",mode:"CS 1v1",status:"COMPLETED",players:"16/16",time:"Finished · 11:00 AM",code:"1V1"},
  {id:5,name:"Duo Clash Cup",mode:"CS 2v2",status:"LIVE",players:"12/16",time:"Live now",code:"2V2"},
  {id:6,name:"Squad War",mode:"CS 4v4",status:"UPCOMING",players:"24/32",time:"Tomorrow · 5:00 PM",code:"4V4"},
  {id:7,name:"One vs Four Trial",mode:"CS 1v4",status:"COMPLETED",players:"5/5",time:"Finished · Yesterday",code:"1V4"},
  {id:8,name:"Lone Wolf Night",mode:"Lone Wolf",status:"UPCOMING",players:"10/24",time:"Tomorrow · 8:00 PM",code:"LW"},
  {id:9,name:"Craftland Creator Map",mode:"Craftland",status:"COMPLETED",players:"20/20",time:"Finished · Yesterday",code:"CL"}
];

const leaders = [
  {name:"ShadowX",matches:32,wins:26,points:2840,initials:"SX"},
  {name:"RXㅤLegend",matches:29,wins:22,points:2510,initials:"RX"},
  {name:"NOVAツ",matches:27,wins:19,points:2190,initials:"NV"},
  {name:"ZenPlayer",matches:24,wins:17,points:1940,initials:"ZP"},
  {name:"BlazeFF",matches:21,wins:14,points:1620,initials:"BF"}
];
let selectedFilter = "All";
let demoPoints = 1000;
let toastTimer;

function toast(message){
  const el=document.getElementById("toast");
  el.textContent=message;el.classList.add("show");
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2600);
}
function goTo(page){
  document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id===`page-${page}`));
  document.querySelectorAll(".nav-link").forEach(b=>b.classList.toggle("active",b.dataset.page===page));
  document.getElementById("mobileMenu").classList.remove("open");
  window.scrollTo({top:0,behavior:"smooth"});
}
document.addEventListener("click",e=>{
  const btn=e.target.closest("[data-page]");
  if(btn){goTo(btn.dataset.page);}
});
document.getElementById("menuToggle").addEventListener("click",()=>document.getElementById("mobileMenu").classList.toggle("open"));

function cardHTML(t){
  const statusClass=t.status==="LIVE"?"tag-red":t.status==="UPCOMING"?"tag-green":"tag-muted";
  const action=t.status==="COMPLETED"?"View result":t.status==="LIVE"?"View match":"View details";
  return `<article class="tournament-card">
    <div class="card-art"><span class="card-status tag ${statusClass}">${t.status==="LIVE"?'<i class="live-dot"></i> ':''}${t.status}</span><strong>${t.code}</strong></div>
    <div class="card-body"><div class="card-title-row"><h3>${t.name}</h3></div><p class="card-sub">${t.mode} · Free Fire custom</p>
    <div class="card-meta"><span>PLAYERS<b>${t.players}</b></span><span>SCHEDULE<b>${t.time}</b></span></div>
    <div class="card-footer"><small>Community demo match</small><button class="card-join" data-match="${t.id}">${action} ↗</button></div></div></article>`;
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
  document.getElementById("allTournamentGrid").innerHTML=list.length?list.map(cardHTML).join(""):'<div class="empty-state">No matches in this category yet.</div>';
}
function renderLive(){
  const list=tournaments.filter(t=>t.status==="LIVE"||t.status==="COMPLETED");
  document.getElementById("liveGrid").innerHTML=list.map(cardHTML).join("");
}
function renderLeaders(){
  document.getElementById("leaderRows").innerHTML=leaders.map((p,i)=>`<div class="leader-row"><div class="leader-player"><span class="rank ${i<3?"top":""}">#${i+1}</span><span class="player-chip">${p.initials}</span><span class="player-name"><b>${p.name}</b><small>Community player</small></span></div><span>${p.matches}</span><span>${p.wins}</span><span class="points">${p.points.toLocaleString("en-IN")}</span></div>`).join("");
  document.getElementById("homeLeaders").innerHTML=leaders.slice(0,3).map((p,i)=>`<div class="leader-mini"><span class="rank top">#${i+1}</span><span class="player-name"><b>${p.name}</b><small>${p.wins} wins</small></span><span class="points">${p.points.toLocaleString("en-IN")} pts</span></div>`).join("");
}
function renderPoints(){
  const formatted=demoPoints.toLocaleString("en-IN");
  document.getElementById("topPoints").textContent=formatted;
  document.getElementById("walletPoints").textContent=formatted;
}
function renderTransactions(){
  document.getElementById("transactions").innerHTML=`<div class="transaction"><span><b>Welcome demo points</b><small>Prototype starting balance</small></span><strong>+1,000 pts</strong></div><div class="transaction"><span><b>Demo account created</b><small>System activity</small></span><strong>INFO</strong></div>`;
}
document.addEventListener("click",e=>{
  const match=e.target.closest("[data-match]");
  if(match){const t=tournaments.find(x=>x.id===Number(match.dataset.match));toast(`${t.name} · ${t.status}. Match details are sample data.`);}
});
document.getElementById("editProfile").addEventListener("click",()=>{
  const current=document.getElementById("profileName").textContent;
  const name=prompt("Choose a display name (max 20 characters):",current);
  if(name&&name.trim()){document.getElementById("profileName").textContent=name.trim().slice(0,20).toUpperCase();toast("Display name updated in this browser demo.");}
});
document.getElementById("supportForm").addEventListener("submit",e=>{
  e.preventDefault();
  const name=document.getElementById("supportName").value.trim();
  const message=document.getElementById("supportMessage").value.trim();
  if(!name||!message)return;
  toast("Demo ticket created locally. No message was sent.");
  e.target.reset();
});
renderModes();renderFilters();renderTournaments();renderLive();renderLeaders();renderPoints();renderTransactions();
