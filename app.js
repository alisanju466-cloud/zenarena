const modes = [
  {name:"Lone Wolf",sub:"1v1 duel",icon:"⚔",short:"LW"},
  {name:"Craftland",sub:"Custom maps",icon:"▦",short:"CL"},
  {name:"Battle Royale",sub:"Squad survival",icon:"◎",short:"BR"},
  {name:"CS 1v1",sub:"Solo clash",icon:"1V1",short:"1V1"},
  {name:"CS 2v2",sub:"Duo clash",icon:"2V2",short:"2V2"},
  {name:"CS 4v4",sub:"Squad clash",icon:"4V4",short:"4V4"},
  {name:"CS 1v4",sub:"Challenge mode",icon:"1V4",short:"1V4"}
];

let tournaments = JSON.parse(localStorage.getItem("zenox_tournaments") || "[]");
let joined = JSON.parse(localStorage.getItem("zenox_joined") || "[]");
let leaders = JSON.parse(localStorage.getItem("zenox_leaders") || "[]");
let requests = JSON.parse(localStorage.getItem("zenox_point_requests") || "[]");
let playerPoints = Number(localStorage.getItem("zenox_player_points") || 0);
let selectedFilter = "All";
let toastTimer;

function saveData(){
  localStorage.setItem("zenox_tournaments",JSON.stringify(tournaments));
  localStorage.setItem("zenox_joined",JSON.stringify(joined));
  localStorage.setItem("zenox_leaders",JSON.stringify(leaders));
  localStorage.setItem("zenox_point_requests",JSON.stringify(requests));
  localStorage.setItem("zenox_player_points",String(playerPoints));
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
document.addEventListener("click",e=>{const btn=e.target.closest("[data-page]");if(btn)goTo(btn.dataset.page);});
document.getElementById("menuToggle").addEventListener("click",()=>document.getElementById("mobileMenu").classList.toggle("open"));

function escapeHTML(value){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function cardHTML(t){
  const statusClass=t.status==="LIVE"?"tag-red":t.status==="UPCOMING"?"tag-green":"tag-muted";
  const isJoined=joined.includes(t.id), full=t.joinedCount>=t.slots;
  const action=t.status==="COMPLETED"?"Completed":isJoined?"Joined ✓":full?"Full":"Join";
  const disabled=t.status==="COMPLETED"||isJoined||full;
  return `<article class="tournament-card"><div class="card-art"><span class="card-status tag ${statusClass}">${t.status==="LIVE"?'<i class="live-dot"></i> ':''}${t.status}</span><strong>${escapeHTML(t.code)}</strong></div><div class="card-body"><div class="card-title-row"><h3>${escapeHTML(t.name)}</h3></div><p class="card-sub">${escapeHTML(t.mode)} · Free community match</p><div class="card-meta"><span>PLAYERS<b>${t.joinedCount}/${t.slots}</b></span><span>SCHEDULE<b>${escapeHTML(t.time)}</b></span></div><div class="card-footer"><small>${full?"Slots full":"Free registration"}</small><button class="card-join" data-join="${t.id}" ${disabled?"disabled":""}>${action}</button></div></div></article>`;
}
function visibleTournaments(){return tournaments.filter(t=>t.status==="LIVE"||t.status==="UPCOMING");}
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
  const live=visibleTournaments();
  const list=live.filter(t=>selectedFilter==="All"||t.mode===selectedFilter);
  document.getElementById("allTournamentGrid").innerHTML=list.length?list.map(cardHTML).join():'<div class="empty-state">No tournaments available right now. The organizer has not started a game yet.</div>';
  document.getElementById("featuredGrid").innerHTML=live.slice(0,3).map(cardHTML).join()||'<div class="empty-state">No featured games. Tournaments appear here only after the organizer starts them.</div>';
}
function renderLive(){
  const list=tournaments.filter(t=>t.status==="LIVE"||t.status==="COMPLETED");
  document.getElementById("liveGrid").innerHTML=list.length?list.map(cardHTML).join():'<div class="empty-state">No live or completed games yet.</div>';
}
function renderLeaders(){
  document.getElementById("leaderRows").innerHTML=leaders.length?leaders.map((p,i)=>`<div class="leader-row"><div class="leader-player"><span class="rank">${i+1}</span><span class="player-chip">${escapeHTML(p.initials||"P")}</span><span class="player-name"><b>${escapeHTML(p.name)}</b><small>Community player</small></span></div><span>${p.matches||0}</span><span>${p.wins||0}</span><span class="points">${Number(p.points||0).toLocaleString("en-IN")}</span></div>`).join(""):'<div class="empty-state">No ranked players yet. The leaderboard will populate after verified results are entered.</div>';
  document.getElementById("homeLeaders").innerHTML=leaders.length?leaders.slice(0,3).map((p,i)=>`<div class="leader-mini"><span class="rank">#${i+1}</span><span class="player-name"><b>${escapeHTML(p.name)}</b><small>${p.wins||0} wins</small></span><span class="points">${Number(p.points||0).toLocaleString("en-IN")} pts</span></div>`).join(""):'<p class="form-note">No ranked players yet.</p>';
}
function renderPoints(){
  const points=playerPoints.toLocaleString("en-IN");
  document.getElementById("topPoints").textContent=points;
  document.getElementById("walletPoints").textContent=points;
}
function renderTransactions(){
  const mine=requests.filter(r=>r.owner==="this-browser");
  document.getElementById("transactions").innerHTML=mine.length?mine.map(r=>`<div class="transaction"><span><b>${escapeHTML(r.type)} · ${r.amount} pts</b><small>${escapeHTML(r.note||"No note")} · ${escapeHTML(r.status)}</small></span><strong>${r.status==="Approved"?"APPROVED":r.status==="Rejected"?"REJECTED":"PENDING"}</strong></div>`).join(""):'<div class="empty-state">No point requests yet.</div>';
}
function renderAdmin(){
  const adminGames=document.getElementById("adminGames");
  adminGames.innerHTML=tournaments.length?tournaments.map(t=>`<div class="admin-game-row"><div><b>${escapeHTML(t.name)}</b><small>${escapeHTML(t.mode)} · ${t.joinedCount}/${t.slots} joined · ${t.status}</small></div><div class="admin-actions"><button class="card-join" data-start="${t.id}">${t.status==="DRAFT"?"Start & publish":t.status==="UPCOMING"?"Set live":t.status==="LIVE"?"Finish":"Finished"}</button><button class="card-join danger" data-delete="${t.id}">Delete</button></div></div>`).join(""):'<div class="empty-state">No tournaments created yet. Create a hidden draft above.</div>';
  const queue=document.getElementById("pointRequests");
  queue.innerHTML=requests.length?requests.map(r=>`<div class="admin-game-row"><div><b>${escapeHTML(r.type)} · ${r.amount} pts</b><small>${escapeHTML(r.note||"No note")} · ${r.status}</small></div><div class="admin-actions">${r.status==="Pending"?`<button class="card-join" data-approve="${r.id}">Approve</button><button class="card-join danger" data-reject="${r.id}">Reject</button>`:""}</div></div>`).join(""):'<div class="empty-state">No pending point requests.</div>';
  document.getElementById("resultManager").innerHTML=leaders.length?leaders.map((p,i)=>`<div class="admin-game-row"><div><b>${escapeHTML(p.name)}</b><small>${p.matches||0} matches · ${p.wins||0} wins</small></div><button class="card-join" data-win="${i}">Record demo win</button></div>`).join(""):'<div class="empty-state">No players added to leaderboard yet.</div>';
}
function renderAll(){renderTournaments();renderLive();renderLeaders();renderPoints();renderTransactions();renderAdmin();}

document.getElementById("createTournamentForm").addEventListener("submit",e=>{
  e.preventDefault();
  const name=document.getElementById("newGameName").value.trim(),mode=document.getElementById("newGameMode").value;
  const slots=Number(document.getElementById("newGameSlots").value),time=document.getElementById("newGameTime").value.trim();
  if(!name||!time||slots<2)return;
  const code=({"Lone Wolf":"LW","Craftland":"CL","Battle Royale":"BR","CS 1v1":"1V1","CS 2v2":"2V2","CS 4v4":"4V4","CS 1v4":"1V4"})[mode];
  tournaments.unshift({id:Date.now(),name,mode,slots,time,code,status:"DRAFT",joinedCount:0});
  saveData();e.target.reset();document.getElementById("newGameSlots").value=16;renderAll();toast("Saved as hidden draft. It is not visible to players."); 
});
document.addEventListener("click",e=>{
  const join=e.target.closest("[data-join]");
  if(join){const id=Number(join.dataset.join),t=tournaments.find(x=>x.id===id);if(!t||joined.includes(id)||t.joinedCount>=t.slots||t.status==="COMPLETED")return;t.joinedCount++;joined.push(id);saveData();renderAll();toast(`Free registration saved for ${t.name}.`);}
  const start=e.target.closest("[data-start]");
  if(start){const t=tournaments.find(x=>x.id===Number(start.dataset.start));if(!t)return;t.status=t.status==="DRAFT"?"UPCOMING":t.status==="UPCOMING"?"LIVE":t.status==="LIVE"?"COMPLETED":"COMPLETED";saveData();renderAll();toast(t.status==="COMPLETED"?"Match marked completed.":"Tournament status updated.");}
  const del=e.target.closest("[data-delete]");
  if(del){tournaments=tournaments.filter(t=>t.id!==Number(del.dataset.delete));saveData();renderAll();toast("Tournament deleted.");}
  const approve=e.target.closest("[data-approve]");
  if(approve){const r=requests.find(x=>x.id===Number(approve.dataset.approve));if(!r||r.status!=="Pending")return;if(r.type==="Add points")playerPoints+=r.amount;else playerPoints=Math.max(0,playerPoints-r.amount);r.status="Approved";saveData();renderAll();toast("Demo points request approved.");}
  const reject=e.target.closest("[data-reject]");
  if(reject){const r=requests.find(x=>x.id===Number(reject.dataset.reject));if(r){r.status="Rejected";saveData();renderAll();toast("Request rejected.");}}
  const win=e.target.closest("[data-win]");
  if(win){const i=Number(win.dataset.win);leaders[i].matches=(leaders[i].matches||0)+1;leaders[i].wins=(leaders[i].wins||0)+1;leaders[i].points=(leaders[i].points||0)+100;saveData();renderAll();toast("Demo leaderboard result recorded.");}
});
document.getElementById("pointsRequestForm").addEventListener("submit",e=>{
  e.preventDefault();const amount=Number(document.getElementById("pointsRequestAmount").value),type=document.getElementById("pointsRequestType").value,note=document.getElementById("pointsRequestNote").value.trim();
  if(!Number.isInteger(amount)||amount<1||amount>100000){toast("Enter a valid points amount.");return;}
  requests.unshift({id:Date.now(),owner:"this-browser",type,amount,note,status:"Pending"});
  saveData();e.target.reset();renderAll();toast("Points request sent to the local demo admin queue.");
});
document.getElementById("refreshLeaderboard").addEventListener("click",()=>{renderLeaders();toast("Leaderboard refreshed.");});
document.getElementById("editProfile").addEventListener("click",()=>{
  const current=document.getElementById("profileName").textContent,name=prompt("Choose a display name (max 20 characters):",current);
  if(name&&name.trim()){document.getElementById("profileName").textContent=name.trim().slice(0,20).toUpperCase();toast("Display name updated in this browser demo.");}
});
document.getElementById("supportForm").addEventListener("submit",e=>{e.preventDefault();const name=document.getElementById("supportName").value.trim(),message=document.getElementById("supportMessage").value.trim();if(!name||!message)return;toast("Demo ticket created locally. No message was sent.");e.target.reset();});
renderModes();renderFilters();renderAll();
