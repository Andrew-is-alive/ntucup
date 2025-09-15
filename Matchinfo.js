function showMatchinfo(matchDiv, match){
    matchDiv.addEventListener("click", () => {
        document.getElementById("popup-overlay").style.display = 'block';
        document.getElementById("popup").style.display = 'block';
        document.getElementById('popup-content').innerHTML = `
            <h3 class="popup-title">${match.teamAID} vs ${match.teamBID}</h3>
            <div class="match-container">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <label class="group-label" style="font-weight: bold;">Group: ${match.group}</label>
                    <label class="group-label" style="font-weight: bold;">Date: ${match.date}</label>
                </div>
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

                <div class="date-official-container">
                    <label>Official: </label>
                    <div class="official-dropdown">
                        <input type="text" class="official-search" value="${match.official || ''}" data-field="official" placeholder="Search official...">
                        <div class="official-list"></div>
                    </div>
                </div>
            </div>
        `;
        window.currentMatchDate = match.date;
        
        if(match.locked !== undefined){
            if (match.locked == true){
                document.getElementById('delete-match').style.display = 'none';
            }
        }
        // **popup**
        // Close the popup by clicking outside the popup
        document.getElementById("popup-overlay").addEventListener("click", () => {
            document.getElementById("popup-overlay").style.display = 'none';
            document.getElementById("popup").style.display = 'none';
        })

        
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