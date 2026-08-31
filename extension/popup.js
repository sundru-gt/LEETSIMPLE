document.addEventListener('DOMContentLoaded', () => {
    const analyzeBtn = document.getElementById('analyze-btn');
    const statusEl = document.getElementById('status');
    const resultsDiv = document.getElementById('results');

    const resTime = document.getElementById('res-time');
    const resSpace = document.getElementById('res-space');
    const resApproach = document.getElementById('res-approach');
    const resExplanation = document.getElementById('res-explanation');

    const toggleApproachBtn = document.getElementById('toggle-approach-btn');
    const boxApproach = document.getElementById('box-approach');

    const toggleExplanationBtn = document.getElementById('toggle-explanation-btn');
    const boxExplanation = document.getElementById('box-explanation');

    toggleApproachBtn.addEventListener('click', () => {
        const isHidden = boxApproach.classList.toggle('hidden');
        toggleApproachBtn.innerText = isHidden ? 'Show Approach' : 'Hide Approach';
    });

    toggleExplanationBtn.addEventListener('click', () => {
        const isHidden = boxExplanation.classList.toggle('hidden');
        toggleExplanationBtn.innerText = isHidden ? 'Show Explanation' : 'Hide Explanation';
    });

    analyzeBtn.addEventListener('click', async () => {
        analyzeBtn.disabled = true;
        resultsDiv.classList.add('hidden');
        statusEl.innerText = 'Extracting problem info...';
        statusEl.style.color = '#aaaaaa';

        try {
            // Get current active tab
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

            if (!tab || !tab.url.includes("leetcode.com/problems/")) {
                throw new Error("Please open a LeetCode problem page.");
            }

            // Message content script
            const problemData = await new Promise((resolve, reject) => {
                chrome.tabs.sendMessage(tab.id, { action: 'extract_problem' }, (response) => {
                    if (chrome.runtime.lastError) {
                        return reject(new Error("Could not connect to page. Try reloading it."));
                    }
                    if (response && response.error) {
                        return reject(new Error(response.error));
                    }
                    resolve(response);
                });
            });

            if (!problemData || !problemData.title) {
                throw new Error("Failed to extract problem details.");
            }

            statusEl.innerText = 'Analyzing with LEETSIMPLE backend...';

            // Send to background script for API call
            const analysis = await new Promise((resolve, reject) => {
                chrome.runtime.sendMessage({ action: 'analyze_api', payload: problemData }, (response) => {
                    if (chrome.runtime.lastError) {
                        return reject(new Error("Background script error."));
                    }
                    if (response && response.error) {
                        return reject(new Error(response.error));
                    }
                    resolve(response);
                });
            });

            // Display results
            resTime.innerText = analysis.timeComplexity;
            resSpace.innerText = analysis.spaceComplexity;
            resApproach.innerText = analysis.approach;
            resExplanation.innerText = analysis.explanation;

            // Reset toggle state
            boxApproach.classList.add('hidden');
            toggleApproachBtn.innerText = 'Show Approach';
            toggleApproachBtn.classList.remove('hidden');

            boxExplanation.classList.add('hidden');
            toggleExplanationBtn.innerText = 'Show Explanation';
            toggleExplanationBtn.classList.remove('hidden');

            resultsDiv.classList.remove('hidden');
            statusEl.innerText = 'Analysis complete!';
            statusEl.style.color = '#4caf50';

        } catch (err) {
            statusEl.innerText = err.message;
            statusEl.style.color = '#ff5252';
        } finally {
            analyzeBtn.disabled = false;
        }
    });
});
