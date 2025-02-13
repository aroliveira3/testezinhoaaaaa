from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine, SessionLocal
from app.database.models import User
import pytest

client = TestClient(app)

@pytest.fixture(scope="module")
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def db_session(setup_database):
    session = SessionLocal()
    yield session
    session.close()

def test_create_user(setup_database):
    response = client.post(
        "/users/",
        json={
            "name": "John Doe",
            "email": "john@example.com",
            "password": "secret"
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "John Doe"
    assert data["email"] == "john@example.com"
    assert "id" in data

def test_get_users(setup_database):
    response = client.get("/users/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

def test_get_user_by_id(setup_database):
    # First, create a user
    create_response = client.post(
        "/users/",
        json={
            "name": "Jane Doe",
            "email": "jane@example.com",
            "password": "secret"
        },
    )
    user_id = create_response.json()["id"]

    # Now, retrieve the user
    response = client.get(f"/users/{user_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == user_id
    assert data["name"] == "Jane Doe"
    assert data["email"] == "jane@example.com"

    # Test retrieving non-existent user
    response = client.get("/users/9999")
    assert response.status_code == 404
