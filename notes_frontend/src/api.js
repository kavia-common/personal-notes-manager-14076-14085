//
// Simple API layer for backend interaction (auth, notes)
// Adapts URL base as needed
//
const API_BASE = process.env.REACT_APP_API_BASE || '/api';

// Token management (basic for demo)
function getAuthHeaders() {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Token ${token}` } : {};
}

// Handle HTTP response with error normalization
async function handleResponse(response) {
  if (!response.ok) {
    let error = 'Unknown error';
    try {
      const data = await response.json();
      error = data.detail || JSON.stringify(data);
    } catch (err) {
      error = response.statusText;
    }
    throw new Error(error);
  }
  return response.json().catch(() => ({}));
}

// PUBLIC_INTERFACE
export async function login(username, password) {
  const response = await fetch(`${API_BASE}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return handleResponse(response);
}

// PUBLIC_INTERFACE
export async function register(username, password) {
  const response = await fetch(`${API_BASE}/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return handleResponse(response);
}

// PUBLIC_INTERFACE
export async function logout() {
  const response = await fetch(`${API_BASE}/auth/logout/`, {
    method: 'POST',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' }
  });
  return handleResponse(response);
}

// PUBLIC_INTERFACE
export async function fetchUser() {
  const response = await fetch(`${API_BASE}/auth/user/`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  return handleResponse(response);
}

// PUBLIC_INTERFACE
export async function fetchNotes() {
  const response = await fetch(`${API_BASE}/notes/`, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
}

// PUBLIC_INTERFACE
export async function createNote(note) {
  const response = await fetch(`${API_BASE}/notes/`, {
    method: 'POST',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(note)
  });
  return handleResponse(response);
}

// PUBLIC_INTERFACE
export async function updateNote(noteId, note) {
  const response = await fetch(`${API_BASE}/notes/${noteId}/`, {
    method: 'PUT',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(note)
  });
  return handleResponse(response);
}

// PUBLIC_INTERFACE
export async function deleteNote(noteId) {
  const response = await fetch(`${API_BASE}/notes/${noteId}/`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!response.ok && response.status !== 204) {
    throw new Error('Failed to delete note');
  }
  return {};
}
