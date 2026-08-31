chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'extract_problem') {
        try {
            // 1. Extract Title
            let title = document.title.replace(' - LeetCode', '').trim();
            const titleEl = document.querySelector('.text-title-large a, .text-title-large, h1');
            if (titleEl) {
                title = titleEl.innerText;
            }

            // 2. Extract Problem Description and Constraints
            // Attempt to find the description container by common LeetCode class names or attributes
            const selectors = [
                '[data-track-load="description_content"]',
                '.elfjS',
                '.content__u3I1',
                '.question-content__JfgR'
            ];

            let descEl = null;
            for (const selector of selectors) {
                descEl = document.querySelector(selector);
                if (descEl) break;
            }

            let problem = '';
            let constraints = '';

            if (descEl) {
                const fullText = descEl.innerText || descEl.textContent;
                // LeetCode usually splits constraints with "Constraints:"
                const parts = fullText.split(/Constraints:/i);

                problem = parts[0].trim();
                constraints = parts.length > 1 ? parts[1].trim() : 'No explicit constraints found.';
            } else {
                // Fallback to body text if specific containers are not found
                problem = "Could not locate exact problem description layout. Ensure you are on a problem page.";
                constraints = "Not found.";
            }

            sendResponse({ title, problem, constraints });
        } catch (err) {
            sendResponse({ error: err.toString() });
        }
    }
    return true;
});
