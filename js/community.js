async function loadCommunityPosts() {
    const grid = document.getElementById("communityGrid");
    const totalEl = document.getElementById("totalPhotos");
    const updatedEl = document.getElementById("lastUpdated");
  
    if (!grid || !totalEl || !updatedEl) {
      console.error("Missing community elements (communityGrid/totalPhotos/lastUpdated).");
      return;
    }
  
    const db = window.firebaseDB;
    const fns = window.firebaseFns;
  
    if (!db || !fns) {
      console.error("Firebase not initialized (firebaseDB/firebaseFns missing).");
      return;
    }
  
    const { collection, getDocs, query, orderBy } = fns;
  
    grid.innerHTML = "";
  
    const q = query(collection(db, "community_posts"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
  
    totalEl.textContent = String(snapshot.size);
  
    let newestDate = null;
  
    snapshot.forEach((d) => {
      const data = d.data();
  
      const card = document.createElement("div");
      card.className = "community-card";
  
      const img = document.createElement("img");
      img.src = data.imageBase64;
      img.alt = data.caption || "Community photo";
  
      const cap = document.createElement("p");
      cap.className = "community-caption";
      cap.textContent = data.caption || "";
  
      card.appendChild(img);
      card.appendChild(cap);
      grid.appendChild(card);
  
      if (data.createdAt?.toDate) {
        const dt = data.createdAt.toDate();
        if (!newestDate || dt > newestDate) newestDate = dt;
      }
    });
  
    updatedEl.textContent = newestDate ? newestDate.toLocaleString() : "--";
  }
  
  window.addEventListener("DOMContentLoaded", loadCommunityPosts);