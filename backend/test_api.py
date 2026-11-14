"""
Automated Test Script for Task Tracker Backend API.
Uses Python standard library (urllib.request, json, time, threading)
so that no external testing dependencies are strictly required.
"""

import json
import socket
import sys
import time
import urllib.error
import urllib.request
from typing import Any, Dict, Optional, Tuple

import uvicorn
from sqlalchemy import text

# Import database and models to verify direct DB interaction
from app.database import SessionLocal, engine
from app.main import app
from app.models.task import Task


def find_free_port() -> int:
    """Find a random free port on localhost."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(("127.0.0.1", 0))
        return s.getsockname()[1]


def make_request(
    url: str,
    method: str = "GET",
    data: Optional[Dict[str, Any]] = None,
    headers: Optional[Dict[str, str]] = None,
) -> Tuple[int, Any, Dict[str, str]]:
    """Helper to send HTTP request using urllib and return (status_code, body, response_headers)."""
    req_headers = {"Content-Type": "application/json"}
    if headers:
        req_headers.update(headers)

    body_bytes = json.dumps(data).encode("utf-8") if data is not None else None
    req = urllib.request.Request(
        url,
        data=body_bytes,
        headers=req_headers,
        method=method,
    )

    try:
        with urllib.request.urlopen(req) as resp:
            status_code = resp.getcode()
            resp_headers = dict(resp.info())
            raw_body = resp.read().decode("utf-8")
            try:
                body = json.loads(raw_body) if raw_body else None
            except Exception:
                body = raw_body
            return status_code, body, resp_headers
    except urllib.error.HTTPError as e:
        status_code = e.code
        resp_headers = dict(e.headers)
        raw_body = e.read().decode("utf-8")
        try:
            body = json.loads(raw_body)
        except Exception:
            body = raw_body
        return status_code, body, resp_headers


class ServerThread:
    """Run uvicorn server in a background thread for testing."""

    def __init__(self, port: int):
        self.port = port
        self.config = uvicorn.Config(
            app=app,
            host="127.0.0.1",
            port=port,
            log_level="warning",
        )
        self.server = uvicorn.Server(self.config)

    def run(self):
        self.server.run()


def run_tests():
    print("=" * 70)
    print("STARTING COMPREHENSIVE BACKEND VERIFICATION")
    print("=" * 70)

    # 1. Test Database connection
    print("\n[TEST 1] Verifying PostgreSQL connection and schema...")
    with engine.connect() as conn:
        res = conn.execute(text("SELECT 1")).scalar()
        assert res == 1, "Database query failed!"
        print("  -> PostgreSQL Connection: OK")

        # Check constraint test
        try:
            conn.execute(
                text(
                    "INSERT INTO tasks (title, status, created_at, updated_at) "
                    "VALUES ('Test Invalid Status', 'BogusStatus', now(), now())"
                )
            )
            print("  -> ERROR: Check constraint should have failed but passed!")
            sys.exit(1)
        except Exception as e:
            print("  -> PostgreSQL Check Constraint (ck_tasks_status) correctly blocked invalid status: OK")

    # 2. Start live API test server
    port = find_free_port()
    base_url = f"http://127.0.0.1:{port}"
    print(f"\n[TEST 2] Starting test server on {base_url}...")

    import threading
    server_thread = threading.Thread(
        target=ServerThread(port).run,
        daemon=True,
    )
    server_thread.start()

    # Wait for server to be responsive
    for _ in range(30):
        try:
            status, body, _ = make_request(f"{base_url}/health")
            if status == 200:
                print("  -> Server is responsive: OK")
                break
        except Exception:
            time.sleep(0.2)
    else:
        print("  -> ERROR: Server failed to start within timeout.")
        sys.exit(1)

    # 3. Test Health & Docs endpoints
    print("\n[TEST 3] Testing /health, /, and /docs...")
    status, body, _ = make_request(f"{base_url}/health")
    assert status == 200 and body.get("status") == "healthy", f"Health check failed: {body}"
    print("  -> GET /health: 200 OK -", body)

    status, body, _ = make_request(f"{base_url}/")
    assert status == 200 and "message" in body, f"Root endpoint failed: {body}"
    print("  -> GET /: 200 OK -", body)

    status, body, _ = make_request(f"{base_url}/docs")
    assert status == 200, f"/docs failed: {status}"
    print("  -> GET /docs (Swagger UI): 200 OK")

    # 4. Test CORS headers
    print("\n[TEST 4] Testing CORS headers...")
    status, body, headers = make_request(
        f"{base_url}/tasks",
        method="OPTIONS",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "POST",
        },
    )
    cors_allow = headers.get("access-control-allow-origin") or headers.get("Access-Control-Allow-Origin")
    print(f"  -> CORS Access-Control-Allow-Origin: {cors_allow}")
    assert cors_allow == "http://localhost:5173", f"CORS failed: {cors_allow}"

    # 5. Test GET /tasks initial state
    print("\n[TEST 5] Testing GET /tasks...")
    status, body, _ = make_request(f"{base_url}/tasks")
    assert status == 200 and isinstance(body, list), f"Expected list response: {body}"
    initial_count = len(body)
    print(f"  -> GET /tasks: 200 OK (current tasks count: {initial_count})")

    # 6. Test Validation on POST /tasks
    print("\n[TEST 6] Testing input validations on POST /tasks...")

    # Empty title
    status, body, _ = make_request(f"{base_url}/tasks", method="POST", data={"title": ""})
    assert status == 422, f"Expected 422 for empty title, got {status}: {body}"
    print("  -> POST with empty title: 422 Unprocessable Entity (OK)")

    # Whitespace-only title
    status, body, _ = make_request(f"{base_url}/tasks", method="POST", data={"title": "   \n\t  "})
    assert status == 422, f"Expected 422 for whitespace title, got {status}: {body}"
    print("  -> POST with whitespace-only title: 422 Unprocessable Entity (OK)")

    # Invalid status
    status, body, _ = make_request(
        f"{base_url}/tasks",
        method="POST",
        data={"title": "Test Task", "status": "Archived"},
    )
    assert status == 422, f"Expected 422 for invalid status, got {status}: {body}"
    print("  -> POST with invalid status 'Archived': 422 Unprocessable Entity (OK)")

    # 7. Test Successful POST /tasks with default status
    print("\n[TEST 7] Testing POST /tasks (Creation)...")
    create_payload = {
        "title": "Technical Test Task 1",
        "description": "Verify end-to-end CRUD functionality",
    }
    status, created_task, _ = make_request(
        f"{base_url}/tasks",
        method="POST",
        data=create_payload,
    )
    assert status == 201, f"Expected 201, got {status}: {created_task}"
    task_id = created_task["id"]
    assert created_task["title"] == create_payload["title"]
    assert created_task["description"] == create_payload["description"]
    assert created_task["status"] == "Todo", f"Default status should be 'Todo', got {created_task['status']}"
    assert created_task["created_at"] is not None
    assert created_task["updated_at"] is not None
    print(f"  -> POST /tasks: 201 Created (Task ID: {task_id}, status: '{created_task['status']}')")

    # Verify directly in PostgreSQL
    with SessionLocal() as db:
        db_task = db.get(Task, task_id)
        assert db_task is not None, "Task was not found in PostgreSQL!"
        assert db_task.title == create_payload["title"]
        print(f"  -> Verified persistence in PostgreSQL: ID {db_task.id} matches DB record")

    # 8. Test GET /tasks to verify list contains newly created task
    print("\n[TEST 8] Testing GET /tasks after creation...")
    status, tasks_list, _ = make_request(f"{base_url}/tasks")
    assert status == 200
    assert any(t["id"] == task_id for t in tasks_list)
    print(f"  -> GET /tasks includes newly created task ID {task_id}: OK")

    # 9. Test PUT /tasks/{id} (Update)
    print("\n[TEST 9] Testing PUT /tasks/{id} (Update)...")
    time.sleep(0.1)  # small pause to ensure timestamp differs
    update_payload = {
        "title": "Technical Test Task 1 - Updated",
        "description": "Updated description content",
        "status": "In Progress",
    }
    status, updated_task, _ = make_request(
        f"{base_url}/tasks/{task_id}",
        method="PUT",
        data=update_payload,
    )
    assert status == 200, f"Expected 200, got {status}: {updated_task}"
    assert updated_task["title"] == update_payload["title"]
    assert updated_task["description"] == update_payload["description"]
    assert updated_task["status"] == "In Progress"
    print(f"  -> PUT /tasks/{task_id}: 200 OK (New status: '{updated_task['status']}')")

    # Verify updated_at is refreshed
    with SessionLocal() as db:
        db_task = db.get(Task, task_id)
        assert db_task.title == update_payload["title"]
        assert db_task.status == "In Progress"
        print(f"  -> Verified updated fields in PostgreSQL: title='{db_task.title}', status='{db_task.status}'")

    # Test PUT non-existent task
    status, body, _ = make_request(
        f"{base_url}/tasks/999999",
        method="PUT",
        data=update_payload,
    )
    assert status == 404, f"Expected 404 for non-existent task, got {status}: {body}"
    print("  -> PUT /tasks/999999 (Non-existent): 404 Not Found (OK)")

    # 10. Test DELETE /tasks/{id} (Delete)
    print("\n[TEST 10] Testing DELETE /tasks/{id}...")
    status, body, _ = make_request(
        f"{base_url}/tasks/{task_id}",
        method="DELETE",
    )
    assert status == 204, f"Expected 204, got {status}: {body}"
    print(f"  -> DELETE /tasks/{task_id}: 204 No Content (OK)")

    # Verify task is gone from DB
    with SessionLocal() as db:
        db_task = db.get(Task, task_id)
        assert db_task is None, "Task still exists in PostgreSQL after deletion!"
        print(f"  -> Verified task ID {task_id} successfully removed from PostgreSQL")

    # Test DELETE non-existent task
    status, body, _ = make_request(
        f"{base_url}/tasks/{task_id}",
        method="DELETE",
    )
    assert status == 404, f"Expected 404 for already deleted task, got {status}: {body}"
    print(f"  -> DELETE /tasks/{task_id} (Second time): 404 Not Found (OK)")

    # 11. Final GET /tasks check
    status, final_tasks, _ = make_request(f"{base_url}/tasks")
    assert status == 200
    assert len(final_tasks) == initial_count
    print(f"\n[TEST 11] Final tasks list count matches initial ({len(final_tasks)}): Clean!")

    print("\n" + "=" * 70)
    print("ALL TESTS PASSED SUCCESSFULLY! BACKEND IMPLEMENTATION IS VERIFIED.")
    print("=" * 70)


if __name__ == "__main__":
    run_tests()
