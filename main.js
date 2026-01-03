async function loadTeam() {
    // 1. MUST use the /pub?output=csv URL format
    const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSEzwgdmZfWUsamXus-lrf5rngwyc-iOXISl9ztnGSgfSTWq42N5s1U7anPVAvPkT4hCWEFf-8hcWis/pub?gid=0&single=true&output=csv';
    // Note: Replace the above with your actual "Published to Web" CSV link

    try {
        const response = await fetch(sheetUrl);
        const data = await response.text();

        const rows = data.split('\n').slice(1);
        // main.js - Updated Parsing Logic
        const teamData = rows.map(row => {
            // UPDATED REGEX: Handles spaces in names and commas inside quotes
            const columns = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);

            if (!columns) return {};
            return {
                name: columns[0]?.replace(/^"|"$/g, "").trim(), // Removes quotes and extra whitespace
                domain: columns[1]?.replace(/^"|"$/g, "").trim(),
                image: columns[2]?.replace(/^"|"$/g, "").trim(),
                bio: columns[3]?.replace(/^"|"$/g, "").trim(),
                linkedin: columns[4]?.replace(/^"|"$/g, "").trim(),
                github: columns[5]?.replace(/^"|"$/g, "").trim()
            };
        });

        const grid = document.getElementById('team-grid');
        grid.innerHTML = '';

        teamData.forEach(member => {
            if (!member.name) return;

            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${member.image}" class="profile-img" onerror="this.src='https://via.placeholder.com/100'">
                <h3 class="name">${member.name}</h3>
                <span class="domain">${member.domain}</span>
                <div class="social-links">
                    <a href="${member.linkedin}" target="_blank">LinkedIn</a>
                    <a href="${member.github}" target="_blank">GitHub</a>
                </div>
                <button class="bio-btn">View Bio</button>
            `;

            card.querySelector('.bio-btn').onclick = () => {
                openBio(member.name, member.domain, member.bio);
            };

            grid.appendChild(card);
        });
    } catch (error) {
        console.error("Error fetching Google Sheet:", error);
    }
}

// Missing Modal Functions
function openBio(name, domain, bio) {
    document.getElementById('modalName').innerText = name;
    document.getElementById('modalDomain').innerText = domain;
    document.getElementById('modalDescription').innerText = bio;
    document.getElementById('bioModal').style.display = 'flex';
}

function closeBio() {
    document.getElementById('bioModal').style.display = 'none';
}

// Close modal when clicking outside the content
window.onclick = function (event) {
    const modal = document.getElementById('bioModal');
    if (event.target == modal) {
        closeBio();
    }
}

// Initialize the fetch on page load
window.onload = loadTeam;