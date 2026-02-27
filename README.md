# ⚡ SiteGen AI — LLM-Powered Website Generator

Generate complete websites with HTML, CSS, and JS just by describing what you want.

## 🏗️ Architecture

```
site-generator/
├── backend/
│   ├── main.py          # FastAPI + Anthropic SDK
│   └── requirements.txt
└── frontend/
    └── App.jsx          # React (Vite or CRA)
```

## 🚀 Quick Setup

### 1. Backend (Python)

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt

# Set your Anthropic API Key
export ANTHROPIC_API_KEY="sk-ant-..."

# Start the server
python main.py
# API available at http://localhost:8000
```

### 2. Frontend (React)

**Option A: Vite (recommended)**
```bash
npm create vite@latest sitegen-ui -- --template react
cd sitegen-ui
npm install
# Copy App.jsx to src/App.jsx
npm run dev
# Frontend at http://localhost:5173
```

**Option B: Use in Claude.ai**
The `App.jsx` file can be pasted directly as an Artifact in Claude!

---

## 📡 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/` | Health check |
| `POST` | `/generate` | Generate site (full response) |
| `POST` | `/generate/stream` | Generate site with streaming (SSE) |
| `POST` | `/refine` | Modify an existing site |

### Direct usage (curl)

```bash
curl -X POST http://localhost:8000/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Landing page for a fitness app",
    "style": "modern",
    "language": "en-US"
  }'
```

### JavaScript (fetch)

```javascript
const response = await fetch('http://localhost:8000/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'Site for an artisan coffee shop',
    style: 'creative',
    language: 'en-US'
  })
});

const { html } = await response.json();
document.getElementById('preview').srcdoc = html;
```

### Streaming with SSE

```javascript
const res = await fetch('http://localhost:8000/generate/stream', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt: '...', style: 'dark' })
});

const reader = res.body.getReader();
const decoder = new TextDecoder();
let fullHtml = '';

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const lines = decoder.decode(value).split('\n');
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = JSON.parse(line.slice(6));
      if (data.chunk) fullHtml += data.chunk;
    }
  }
}
```

---

## 🎨 Available Styles

| Style | Description |
|-------|-------------|
| `modern` | Glassmorphism, vibrant colors |
| `minimalist` | Clean, lots of negative space |
| `corporate` | Blue/gray tones, professional |
| `creative` | Bold, unexpected colors |
| `dark` | Dark theme, neon, cyberpunk |

---

## 🔧 Customization

To add new styles, edit the `style_hints` dict in `main.py`:

```python
style_hints = {
  "your_style": "description of the style for the prompt",
  ...
}
```

To change the model, update `main.py`:
```python
model="claude-opus-4-6"  # or "claude-sonnet-4-6" for faster responses
```

---

## 📦 Stack

- **Backend**: Python, FastAPI, Anthropic SDK, SSE streaming
- **Frontend**: React, no extra libraries
- **AI**: Claude (Anthropic)
