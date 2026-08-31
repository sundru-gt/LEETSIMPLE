chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'analyze_api') {
        const payload = request.payload;

        fetch('http://localhost:3000/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
            .then(res => {
                if (!res.ok) {
                    return res.json().then(errData => {
                        throw new Error(errData.error || `HTTP error ${res.status}`);
                    }).catch(() => {
                        throw new Error(`HTTP error ${res.status}`);
                    });
                }
                return res.json();
            })
            .then(data => {
                sendResponse(data);
            })
            .catch(err => {
                sendResponse({ error: err.message || "Unknown error occurred" });
            });
        return true;
    }
});
