import React, { useEffect, useState } from 'react';
import { fetchNotes, createNote, updateNote, deleteNote } from '../api';

// PUBLIC_INTERFACE
function NotesPage({ user }) {
  const [notes, setNotes] = useState([]);
  const [selected, setSelected] = useState(null); // note id
  const [editorValue, setEditorValue] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

  // Load all notes
  useEffect(() => {
    async function loadNotes() {
      setLoading(true);
      try {
        const data = await fetchNotes();
        setNotes(data);
      } catch (err) {
        setError('Failed to load notes.');
      }
      setLoading(false);
    }
    loadNotes();
  }, []);

  // Handle select
  function handleSelect(note) {
    setSelected(note.id);
    setEditorValue({ title: note.title, content: note.content });
    setCreating(false);
  }

  // Handle create new
  function startCreate() {
    setSelected(null);
    setEditorValue({ title: '', content: '' });
    setCreating(true);
  }

  // Handle save (create or update)
  async function handleSave(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (creating) {
        const created = await createNote({
          title: editorValue.title,
          content: editorValue.content
        });
        setNotes([created, ...notes]);
        setSelected(created.id);
        setCreating(false);
      } else if (selected) {
        const updated = await updateNote(selected, {
          title: editorValue.title,
          content: editorValue.content
        });
        setNotes(notes.map(n => (n.id === selected ? updated : n)));
      }
    } catch (err) {
      setError("Error saving note: " + err.message);
    }
    setLoading(false);
  }

  // Handle delete
  async function handleDelete() {
    if (!selected) return;
    setLoading(true);
    setError('');
    try {
      await deleteNote(selected);
      setNotes(notes.filter(n => n.id !== selected));
      setSelected(null);
      setEditorValue({ title: '', content: '' });
    } catch (err) {
      setError("Error deleting note: " + err.message);
    }
    setLoading(false);
  }

  // List sorted by last update
  const sortedNotes = [...notes].sort(
    (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
  );

  return (
    <section className="notes-layout">
      <aside className="notes-sidebar">
        <div className="sidebar-header">
          <h2>Your Notes</h2>
          <button className="btn btn-accent btn-small" onClick={startCreate}>
            + New
          </button>
        </div>
        <ul className="notes-list">
          {loading && !notes.length && <li>Loading...</li>}
          {sortedNotes.map(note => (
            <li
              key={note.id}
              className={note.id === selected ? 'active' : ''}
              onClick={() => handleSelect(note)}
            >
              <div className="title">{note.title}</div>
              <div className="date">
                {new Date(note.updated_at).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      </aside>
      <main className="note-editor-main">
        {(selected !== null || creating) ? (
          <form className="note-editor" onSubmit={handleSave}>
            <label>
              Title
              <input
                type="text"
                value={editorValue.title}
                onChange={e =>
                  setEditorValue({ ...editorValue, title: e.target.value })
                }
                required
              />
            </label>
            <label>
              Content
              <textarea
                rows={8}
                value={editorValue.content}
                onChange={e =>
                  setEditorValue({ ...editorValue, content: e.target.value })
                }
                required
              />
            </label>
            <div className="editor-actions">
              <button
                className="btn btn-primary"
                type="submit"
                disabled={loading || !editorValue.title}
              >
                {creating ? 'Create' : 'Save'}
              </button>
              {!creating && (
                <button
                  className="btn btn-danger"
                  type="button"
                  onClick={handleDelete}
                  disabled={loading}
                  style={{ marginLeft: 8 }}
                >
                  Delete
                </button>
              )}
            </div>
            {error && <div className="error-message">{error}</div>}
          </form>
        ) : (
          <div className="empty-state">
            <h3>Select a note, or create a new one.</h3>
          </div>
        )}
      </main>
    </section>
  );
}

export default NotesPage;
