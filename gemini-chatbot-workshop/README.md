# Sunrise Institute AI Chatbot System

A full-stack conversational artificial intelligence application developed for the Sunrise Institute of Technology. The platform couples an institutional web interface with an intelligent conversational assistant, named Sunny, powered by Google Gemini, Flask, and vanilla HTML, CSS, and JavaScript.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Installation and Environment Setup](#installation-and-environment-setup)
4. [Configuration Variables](#configuration-variables)
5. [Execution Guide](#execution-guide)
6. [Architectural Overview](#architectural-overview)
7. [Operational Modes (Restricted vs. Unrestricted)](#operational-modes-restricted-vs-unrestricted)
8. [API Specifications](#api-specifications)
9. [Project Directory Structure](#project-directory-structure)
10. [Troubleshooting and Common Issues](#troubleshooting-and-common-issues)

---

## Project Overview

The objective of this project is to showcase how a lightweight web front-end can integrate with modern Large Language Models (LLMs) to serve either as an open-ended assistant or as a strictly guarded, domain-specific organizational chatbot.

Key technical characteristics:
- Official Google GenAI SDK integration (`google-genai` version 2.30+).
- In-memory conversation session tracking supporting multi-turn dialogues.
- Configurable operational governance (Restricted Mode vs. Unrestricted Mode).
- Asynchronous UI state management with XSS-safe DOM rendering.
- Resilient API handling with automatic retry logic.

---

## Prerequisites

Before deploying and running the project locally, ensure the following tools are available on your system:
- Python 3.10, 3.11, or 3.12.
- A functional command shell (PowerShell or Command Prompt on Windows; Bash or Zsh on macOS/Linux).
- An active Google Gemini API key obtained via Google AI Studio.
- Stable outbound internet access over HTTPS (TCP port 443).

---

## Installation and Environment Setup

### 1. Navigate to the Workshop Directory
Open a terminal and set the working directory to the project repository:
```bash
cd gemini-chatbot-workshop
```

### 2. Create a Virtual Environment
Create an isolated Python environment to manage package dependencies without impacting global packages:
```bash
python -m venv venv
```

### 3. Activate the Virtual Environment
Activate the environment according to your operating system:

- On Windows (PowerShell):
  ```powershell
  .\venv\Scripts\Activate.ps1
  ```
  *(Note: If script execution is restricted on Windows, run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` in your PowerShell session).*

- On Windows (Command Prompt):
  ```cmd
  venv\Scripts\activate.bat
  ```

- On macOS / Linux:
  ```bash
  source venv/bin/activate
  ```

Once activated, your terminal prompt will display the `(venv)` indicator.

### 4. Install Dependencies
Install all required libraries using the package manager:
```bash
pip install -r requirements.txt
```

### 5. Configure the Environment File
Create a local `.env` configuration file from the provided example template:

- On Windows:
  ```cmd
  copy .env.example .env
  ```
- On macOS / Linux:
  ```bash
  cp .env.example .env
  ```

Open `.env` in a text editor and supply your Gemini API key:
```env
GEMINI_API_KEY=your_actual_api_key_here
```

---

## Configuration Variables

The application reads its operating parameters from the `.env` file via `python-dotenv`:

| Parameter | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `GEMINI_API_KEY` | String | None | Private API authentication key generated in Google AI Studio. |
| `GEMINI_MODEL` | String | `gemini-3.1-flash-lite` | Specifies the Gemini model identifier (e.g., `gemini-3.1-flash-lite`, `gemini-2.5-flash`, `gemini-flash-latest`). |
| `RESTRICTED_MODE` | Boolean | `false` | When set to `true`, strictly constrains bot responses to the verified institutional knowledge base. When `false`, permits open-domain answers. |
| `PORT` | Integer | `5000` | Local network port on which the Flask HTTP server listens. |

---

## Execution Guide

### Starting the Server
With the virtual environment activated, initiate the Flask server:
```bash
python app.py
```

Upon successful startup, the console outputs:
```text
[INFO] Connected to Gemini AI (model: gemini-3.1-flash-lite)
[MODE] RESTRICTED_MODE=true -> Chatbot strictly limited to college facts.

>>> Sunrise Institute Website is LIVE at http://localhost:5001
```

### Accessing the Web Application
Launch any modern web browser and navigate to the address shown in the terminal:
- Standard default URL: `http://localhost:5000`
- Alternative configured port: `http://localhost:5001` (or the specific port set in `.env`)

Click the chat bubble icon in the lower-right corner of the webpage to expand the conversational panel and submit questions.

### Terminating the Process
To halt the server, focus the running terminal window and execute:
```text
Ctrl + C
```

To deactivate the virtual environment when finished:
```bash
deactivate
```

---

## Architectural Overview

The system uses a decoupled client-server architecture:

```text
+---------------------+           HTTP POST           +------------------------+
|   Client Browser    |  ---------------------------> |   Flask Backend        |
|                     |       /api/chat payload       |   (app.py)             |
|  - static/index.html|                               |                        |
|  - static/style.css |  <--------------------------- |  - Session Store       |
|  - static/chatbot.js|       JSON response text      |  - Guardrail Rules     |
+---------------------+                               +------------------------+
                                                                  |
                                                      Google GenAI API Request
                                                                  |
                                                                  v
                                                      +------------------------+
                                                      |   Google Gemini Engine |
                                                      |   (Cloud Infrastructure|
                                                      +------------------------+
```

### 1. Front-End Presentation Layer (`static/`)
- `index.html`: Contains semantic HTML5 markup for the college landing page, including navigation, hero introduction, academic programs, admissions criteria, and the floating chat component.
- `style.css`: Implements a responsive layout using modern CSS Grid and Flexbox, typography hierarchy, chat modal transitions, and dynamic typing state indicators.
- `chatbot.js`: Manages the user interface event loop:
  - Listens for input submission via keyboard (`Enter`) or the `Send` button.
  - Appends user and agent bubbles dynamically using `textContent` to defend against Cross-Site Scripting (XSS) vectors.
  - Toggles asynchronous typing indicators while network transactions are pending.
  - Tracks client-side `session_id` to preserve ongoing dialogues across queries.

### 2. Application Logic and Server Layer (`app.py`)
- **Web Server**: Built on Flask, serving static web assets and an internal RESTful API route.
- **Client Initialization**: Connects to the Gemini API using the `google.genai.Client` class.
- **Session State Management**: Maintains an in-memory dictionary (`sessions`) mapping client `session_id` values to individual `client.chats` objects, providing context retention across multiple turns.
- **Fault Tolerance**: Implements automated retries over transient connection issues or server-side throttling.
- **Fallback Mode**: In the absence of an API key, provides deterministic offline replies to verify interface functionality.

---

## Operational Modes (Restricted vs. Unrestricted)

The application provides an enterprise-oriented guardrail mechanism controlled by the `RESTRICTED_MODE` configuration flag in `.env`.

### Mode Comparison

#### Unrestricted Mode (`RESTRICTED_MODE=false`)
- **System Objective**: Operates as a generalized, intelligent assistant.
- **Response Scope**: Answers broad queries including technical programming, scientific concepts, mathematical calculations, historical events, creative writing, and institutional facts.
- **Model Temperature**: Set to `0.7` to encourage descriptive and conversational articulation.

#### Restricted Mode (`RESTRICTED_MODE=true`)
- **System Objective**: Operates as a guarded corporate representative strictly bounded to verified institutional domain facts.
- **Response Scope**: Strictly confined to official facts regarding Sunrise Institute of Technology (academics, admissions, annual tuition, contact channels).
- **Enforcement Policy**:
  - The model is supplied with a closed-domain system directive forbidding any external or off-topic information generation.
  - Temperature is set to `0.0` for maximum determinism and hallucination elimination.
  - Any query unrelated to official institutional facts is rejected using the formal refusal string:
    ```text
    "I don't have that info — please contact admissions@sunrise.example."
    ```

---

## API Specifications

### Route: Send Chat Message

Processes an incoming conversation prompt and returns an AI-generated completion.

- **Endpoint**: `/api/chat`
- **Method**: `POST`
- **Content-Type**: `application/json`

#### Request Payload
```json
{
  "message": "What is the annual tuition fee?",
  "session_id": "optional-uuid-string"
}
```

| Field | Type | Mandatory | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `message` | String | Yes | 1 to 1000 characters | The raw question or message typed by the user. |
| `session_id` | String | No | Valid UUID | Persistent conversation identifier. If omitted, the server generates a new identifier. |

#### Success Response (`HTTP 200 OK`)
```json
{
  "reply": "The annual tuition fee is ₹80,000.",
  "session_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```

#### Error Responses
- **`HTTP 400 Bad Request`**: Returned if the request body is malformed, missing, empty, or exceeds 1000 characters.
  ```json
  { "error": "Message cannot be empty." }
  ```
- **`HTTP 502 Bad Gateway`**: Returned if the upstream Gemini API service encounters network errors or request failures.
  ```json
  { "error": "Couldn't reach the AI right now. Please try again." }
  ```

---

## Project Directory Structure

```text
gemini-chatbot-workshop/
|-- .env                    # Active local environment variables (API key, mode, port)
|-- .env.example            # Distribution template for configuration settings
|-- .gitignore              # Files excluded from version control (venv, .env, caches)
|-- README.md               # System architectural documentation and execution guide
|-- app.py                  # Core Flask backend server and Gemini integration logic
|-- requirements.txt        # Pinned Python package dependencies
|-- static/                 # Public web assets served by Flask
|   |-- index.html          # Webpage layout structure and chatbot DOM elements
|   |-- style.css           # Styling rules, component themes, and animations
|   |-- chatbot.js          # Asynchronous widget controller and API communication
+-- venv/                   # Local Python virtual environment directory
```

---

## Troubleshooting and Common Issues

### 1. HTTP 429: Resource Exhausted / Quota Limits
- **Cause**: The assigned API key has reached its daily free-tier quota for a specific model (e.g., `gemini-2.5-flash` limits free daily requests).
- **Remedy**: Specify an alternative model in `.env` such as `GEMINI_MODEL=gemini-3.1-flash-lite`, or supply a key linked to a paid billing account in Google AI Studio.

### 2. HTTP 503: Model Temporarily Unavailable
- **Cause**: Upstream cloud inference infrastructure is encountering transient load spikes.
- **Remedy**: The backend automatically retries requests up to three times. If the condition persists, switch to `gemini-3.1-flash-lite` or test after a brief interval.

### 3. Port Already in Use (Address already in use / WinError 10048)
- **Cause**: Another service or prior instance of `app.py` is currently running on the designated port.
- **Remedy**: Set a different port in `.env` by adding `PORT=5001` (or another available port number), then restart `app.py`.

### 4. PowerShell Execution Policy Restrictions
- **Cause**: Windows client security policies preventing local `.ps1` execution.
- **Remedy**: Run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` within the active PowerShell session prior to invoking `venv\Scripts\Activate.ps1`.
