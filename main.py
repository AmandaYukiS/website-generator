"""
🚀 LLM Site Generator - Python Backend (FastAPI)
Uses the Anthropic API to generate complete websites from prompts.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import anthropic
import json
import os

app = FastAPI(title="LLM Site Generator API")

# Allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

SYSTEM_PROMPT = """You are an expert web developer. Generate complete, fully functional websites using pure HTML, CSS, and JavaScript.

MANDATORY RULES:
1. Return ONLY the complete HTML code (including internal <style> and <script> tags)
2. The site must be beautiful, modern, and responsive
3. Use Google Fonts when appropriate
4. Include animations and interactivity where it makes sense
5. The code must work standalone (no external dependencies other than CDNs)
6. Start with <!DOCTYPE html> and end with </html>
7. Do NOT add explanations — return only the code

Recommended styles:
- Modern design with gradients and shadows
- Well-chosen typography
- Responsive layout using CSS Grid/Flexbox
- Smooth micro-animations
- Cohesive color palette"""


class SiteRequest(BaseModel):
    prompt: str
    style: str = "modern"  # modern, minimalist, corporate, creative, dark
    language: str = "en-US"


class RefineRequest(BaseModel):
    current_html: str
    instructions: str


@app.get("/")
def root():
    return {"status": "ok", "message": "LLM Site Generator API is running!"}


@app.post("/generate")
async def generate_site(request: SiteRequest):
    """Generates a complete website from a prompt."""

    style_hints = {
        "modern": "modern design with vibrant colors and glassmorphism elements",
        "minimalist": "clean and minimalist design, lots of negative space, elegant typography",
        "corporate": "professional and trustworthy design, blue/gray tones, serious",
        "creative": "bold and creative design, unexpected colors, unconventional layout",
        "dark": "dark theme, neons, cyberpunk/tech aesthetic",
    }

    style_desc = style_hints.get(request.style, "modern design")

    user_message = f"""Create a complete website with {style_desc}.

User request: {request.prompt}

Content language: {request.language}

Generate the full HTML now:"""

    try:
        message = client.messages.create(
            model="claude-opus-4-6",
            max_tokens=8096,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": user_message}]
        )

        html_code = message.content[0].text.strip()

        # Ensure it starts with DOCTYPE
        if not html_code.startswith("<!"):
            idx = html_code.find("<!DOCTYPE")
            if idx > 0:
                html_code = html_code[idx:]

        return {
            "html": html_code,
            "tokens_used": message.usage.input_tokens + message.usage.output_tokens,
            "model": message.model
        }

    except anthropic.APIError as e:
        raise HTTPException(status_code=500, detail=f"Anthropic API error: {str(e)}")


@app.post("/generate/stream")
async def generate_site_stream(request: SiteRequest):
    """Generates a website with streaming (tokens arrive in real time)."""

    style_hints = {
        "modern": "modern design with vibrant colors and glassmorphism elements",
        "minimalist": "clean and minimalist design, lots of negative space, elegant typography",
        "corporate": "professional and trustworthy design, blue/gray tones, serious",
        "creative": "bold and creative design, unexpected colors, unconventional layout",
        "dark": "dark theme, neons, cyberpunk/tech aesthetic",
    }

    style_desc = style_hints.get(request.style, "modern design")
    user_message = f"""Create a complete website with {style_desc}.

Request: {request.prompt}
Language: {request.language}

Full HTML:"""

    def event_stream():
        with client.messages.stream(
            model="claude-opus-4-6",
            max_tokens=8096,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": user_message}]
        ) as stream:
            for text in stream.text_stream:
                yield f"data: {json.dumps({'chunk': text})}\n\n"
        yield f"data: {json.dumps({'done': True})}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )


@app.post("/refine")
async def refine_site(request: RefineRequest):
    """Refines/modifies an existing website with new instructions."""

    try:
        message = client.messages.create(
            model="claude-opus-4-6",
            max_tokens=8096,
            system=SYSTEM_PROMPT,
            messages=[
                {
                    "role": "user",
                    "content": f"""Here is the current HTML of the website:

```html
{request.current_html}
```

Modify the site following these instructions: {request.instructions}

Return the complete modified HTML:"""
                }
            ]
        )

        html_code = message.content[0].text.strip()
        if not html_code.startswith("<!"):
            idx = html_code.find("<!DOCTYPE")
            if idx > 0:
                html_code = html_code[idx:]

        return {
            "html": html_code,
            "tokens_used": message.usage.input_tokens + message.usage.output_tokens
        }

    except anthropic.APIError as e:
        raise HTTPException(status_code=500, detail=f"Anthropic API error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
