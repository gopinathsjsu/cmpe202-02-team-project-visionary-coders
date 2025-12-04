from fastapi.testclient import TestClient
from app.main import app

def test_docs():
    client = TestClient(app)
    r = client.get("/docs")
    assert r.status_code == 200

def test_admin_summary_requires_auth():
    client = TestClient(app)
    r = client.get("/admin/summary")
    assert r.status_code == 401


def test_admin_listings_requires_auth():
    client = TestClient(app)
    r = client.get("/admin/listings")
    assert r.status_code == 401
