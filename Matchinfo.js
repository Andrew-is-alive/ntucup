function showMatchinfo(matchDiv, match){
    if (match.teamAID === match.teamBID) return; // Do not show popup for same team matches
    matchDiv.addEventListener("click", () => {
        document.getElementById("popup-overlay").style.display = 'block';
        document.getElementById("popup").style.display = 'block';
        // Add fade effect to header
        const header = document.getElementById("sticky-header");
        if (header) header.classList.add("popup-fade");
        document.getElementById('popup').innerHTML = `
                    <button id="close-popup" class="close-popup-button" style="position: absolute; top: 8px; right: 8px; font-size: 24px; background: transparent; border: none; cursor: pointer;">&times;</button>
                    <h3 class="popup-title">${match.teamAID} vs ${match.teamBID}</h3>
                    <h6 class="popup-subtitle">${match.group} ${match.date}</h6>
                    <div class="match-container">
                        <h3 class="popup-title">${match.status && match.teamAID !== match.teamBID? `${match.winner}贏` : ""}</h3>
                        <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 10px;">
                            <div class="set-container">
                                <label>Set 1:</label>
                                <input type="text" maxlength="2" class="score-input" data-set="set1" data-team="0" value="${match.set1[0] || ''}">
                                <span>:</span>
                                <input type="text" maxlength="2" class="score-input" data-set="set1" data-team="1" value="${match.set1[1] || ''}">
                            </div>
                            <div class="set-container">
                                <label>Set 2:</label>
                                <input type="text" maxlength="2" class="score-input" data-set="set2" data-team="0" value="${match.set2[0] || ''}">
                                <span>:</span>
                                <input type="text" maxlength="2" class="score-input" data-set="set2" data-team="1" value="${match.set2[1] || ''}">
                            </div>

                            <div class="set-container">
                                <label>Set 3:</label>
                                <input type="text" maxlength="2" class="score-input" data-set="set3" data-team="0" value="${match.set3[0] || ''}">
                                <span>:</span>
                                <input type="text" maxlength="2" class="score-input" data-set="set3" data-team="1" value="${match.set3[1] || ''}">
                            </div>
                            <div class="set-container">
                                <label>Official: </label>
                                <div class="official-dropdown">
                                    <input type="text" class="official-search" value="${match.official || ''}" data-field="official" placeholder="Search official...">
                                    <div class="official-list"></div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                `;
        window.currentMatchDate = match.date;
        // **popup**
        // Close the popup by clicking outside the popup
        document.getElementById("popup-overlay").addEventListener("click", () => {
            document.getElementById("popup-overlay").style.display = 'none';
            document.getElementById("popup").style.display = 'none';
            // Remove fade effect from header
            const header = document.getElementById("sticky-header");
            if (header) header.classList.remove("popup-fade");
        });

        document.getElementById("close-popup").addEventListener("click", () => {
            document.getElementById("popup-overlay").style.display = 'none';
            document.getElementById("popup").style.display = 'none';
            // Remove fade effect from header
            const header = document.getElementById("sticky-header");
            if (header) header.classList.remove("popup-fade");
        });
        
        document.querySelectorAll('.score-input').forEach(input => {
            input.addEventListener('input', function(e) {
                // Only allow numbers
                this.value = this.value.replace(/[^0-9]/g, '');
                
                // Auto-advance when two digits are entered
                if (this.value.length === 2) {
                    const allInputs = Array.from(document.querySelectorAll('.score-input'));
                    const currentIndex = allInputs.indexOf(this);
                    if (currentIndex < allInputs.length - 1) {
                        allInputs[currentIndex + 1].focus();console.log('here');
                    }
                }
            });

            // Add keyboard navigation
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Backspace' && this.value.length === 0) {
                    const allInputs = Array.from(document.querySelectorAll('.score-input'));
                    const currentIndex = allInputs.indexOf(this);
                    if (currentIndex > 0) {
                        e.preventDefault();
                        allInputs[currentIndex - 1].focus();
                    }
                }
            });
        });
    });
}