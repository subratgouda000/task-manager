# Task Manager

A small full-stack CRUD web app for tracking tasks, built with Flask, SQLite,
and vanilla JavaScript. Includes a pytest test suite and a GitHub Actions CI
pipeline that runs tests and lints the code on every push.

## Features
- Create, read, update, and delete tasks
- Filter tasks by status (pending / in progress / done)
- Set priority (low / medium / high) and a due date per task
- Server-side input validation (e.g. rejects empty titles)
- Automated tests covering the API's create/read/update/delete behavior
- CI pipeline (GitHub Actions) that runs on every push and pull request

## Tech stack
- **Backend:** Python, Flask, Flask-SQLAlchemy
- **Database:** SQLite
- **Frontend:** HTML, CSS, vanilla JavaScript (fetch API)
- **Testing:** pytest
- **CI:** GitHub Actions

## Setup

```bash
# 1. Clone the repo and enter the folder
git clone <your-repo-url>
cd task-manager

# 2. Create a virtual environment (recommended)
python -m venv venv
source venv/bin/activate   # on Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run the app
python app.py
```

Then open http://127.0.0.1:5000 in your browser.

## Running tests

```bash
pytest -v
```

## API endpoints

| Method | Endpoint            | Description          |
|--------|----------------------|-----------------------|
| GET    | `/api/tasks`         | List all tasks        |
| POST   | `/api/tasks`         | Create a task          |
| PUT    | `/api/tasks/<id>`    | Update a task          |
| DELETE | `/api/tasks/<id>`    | Delete a task          |

## What I learned
Building this project involved designing a REST API, connecting it to a
database with an ORM, writing a frontend that consumes that API, and setting
up an automated test + CI pipeline so every change is verified before it's
merged — the same coding → testing → integration workflow used on real
engineering teams.

## Possible next steps
- Deploy to Render/Railway for a live demo link
- Add user accounts / authentication
- Add due-date sorting and overdue-task highlighting
