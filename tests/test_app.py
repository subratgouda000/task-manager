import os
import sys
import pytest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import app, db  # noqa: E402


@pytest.fixture
def client():
    app.config["TESTING"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
    with app.app_context():
        db.create_all()
        with app.test_client() as client:
            yield client
        db.drop_all()


def test_get_tasks_empty(client):
    res = client.get("/api/tasks")
    assert res.status_code == 200
    assert res.get_json() == []


def test_create_task(client):
    res = client.post("/api/tasks", json={"title": "Write README"})
    assert res.status_code == 201
    data = res.get_json()
    assert data["title"] == "Write README"
    assert data["status"] == "pending"
    assert data["priority"] == "medium"


def test_create_task_without_title_fails(client):
    res = client.post("/api/tasks", json={"description": "no title here"})
    assert res.status_code == 400
    assert "error" in res.get_json()


def test_create_task_with_blank_title_fails(client):
    res = client.post("/api/tasks", json={"title": "   "})
    assert res.status_code == 400


def test_get_tasks_after_create(client):
    client.post("/api/tasks", json={"title": "Task A"})
    client.post("/api/tasks", json={"title": "Task B"})
    res = client.get("/api/tasks")
    data = res.get_json()
    assert len(data) == 2


def test_update_task_status(client):
    created = client.post("/api/tasks", json={"title": "Task A"}).get_json()
    res = client.put(f"/api/tasks/{created['id']}", json={"status": "done"})
    assert res.status_code == 200
    assert res.get_json()["status"] == "done"


def test_update_task_blank_title_fails(client):
    created = client.post("/api/tasks", json={"title": "Task A"}).get_json()
    res = client.put(f"/api/tasks/{created['id']}", json={"title": "  "})
    assert res.status_code == 400


def test_update_nonexistent_task_fails(client):
    res = client.put("/api/tasks/999", json={"status": "done"})
    assert res.status_code == 404


def test_delete_task(client):
    created = client.post("/api/tasks", json={"title": "Task to delete"}).get_json()
    res = client.delete(f"/api/tasks/{created['id']}")
    assert res.status_code == 200
    assert res.get_json()["deleted"] == created["id"]

    res_after = client.get("/api/tasks")
    assert res_after.get_json() == []


def test_delete_nonexistent_task_fails(client):
    res = client.delete("/api/tasks/999")
    assert res.status_code == 404


def test_priority_defaults_and_override(client):
    res = client.post("/api/tasks", json={"title": "High priority task", "priority": "high"})
    assert res.get_json()["priority"] == "high"
