function showMatchinfo(matchDiv, match) {
    if (match.teamAID === match.teamBID) return;

    matchDiv.addEventListener("click", () => {
        const overlay = document.getElementById("popup-overlay");
        const popup = document.getElementById("popup");
        const header = document.getElementById("sticky-header");
        if (!overlay || !popup) return;

        popup.replaceChildren();

        const closeButton = document.createElement("button");
        closeButton.type = "button";
        closeButton.id = "close-popup";
        closeButton.className = "close-popup-button";
        closeButton.setAttribute("aria-label", "Close match details");
        closeButton.textContent = "×";
        closeButton.style.cssText = "position:absolute;top:8px;right:8px;font-size:24px;background:transparent;border:0;cursor:pointer";

        const title = document.createElement("h3");
        title.className = "popup-title";
        title.textContent = `${match.teamAID || "TBD"} vs ${match.teamBID || "TBD"}`;

        const subtitle = document.createElement("p");
        subtitle.className = "popup-subtitle";
        subtitle.textContent = [match.group, match.date].filter(Boolean).join(" · ");

        const content = document.createElement("div");
        content.className = "match-container";

        if (match.status && match.winner) {
            const result = document.createElement("h3");
            result.className = "popup-title";
            result.textContent = `Winner: ${match.winner}`;
            content.appendChild(result);
        }

        ["set1", "set2", "set3"].forEach((setName, index) => {
            const scores = Array.isArray(match[setName]) ? match[setName] : [0, 0];
            const row = document.createElement("div");
            row.className = "set-container";
            const label = document.createElement("strong");
            label.textContent = `Set ${index + 1}:`;
            const value = document.createElement("span");
            value.textContent = `${scores[0] || 0} : ${scores[1] || 0}`;
            row.append(label, value);
            content.appendChild(row);
        });

        const official = document.createElement("p");
        official.textContent = `Official: ${match.official || "Not assigned"}`;
        content.appendChild(official);

        popup.append(closeButton, title, subtitle, content);
        overlay.style.display = "block";
        popup.style.display = "block";
        header?.classList.add("popup-fade");

        const close = () => {
            overlay.style.display = "none";
            popup.style.display = "none";
            header?.classList.remove("popup-fade");
        };
        overlay.onclick = close;
        closeButton.onclick = close;
    });
}
