# LEETSIMPLE 🚀

**LEETSIMPLE** is a Chrome extension paired with an Express.js backend that analyzes LeetCode problems in real time. It extracts problem details directly from active LeetCode tabs and computes Time & Space Complexity, optimal approaches, and detailed explanations.

---

## 📁 Project Structure

* **`extension/`**: Chrome Extension (Manifest V3) containing:
  * `content.js`: Scrapes problem title, description, and constraints from the LeetCode DOM.
  * `background.js`: Service worker proxying requests to the backend server.
  * `popup.html` / `popup.js` / `popup.css`: Extension UI with interactive toggles.
* **`backend/`**: Node.js / Express server that processes problem descriptions and requests analysis using Groq AI service models.

---

## ⚡ Quick Start

### 1. Start the Backend
```bash
cd backend
npm install
npm start
```
The server will run on `http://localhost:3000`.

### 2. Load Chrome Extension
1. Open Chrome and go to `chrome://extensions/`.
2. Enable **Developer mode** (top-right toggle).
3. Click **Load unpacked** and select the `extension` folder from this repository.
4. Open any problem page on [LeetCode](https://leetcode.com/problems/) and click the LEETSIMPLE icon in your toolbar to run the analysis!

---

## 🎨 Note on Styling
> **Note:** AI was used to assist with styling and UI design for the extension interface.
