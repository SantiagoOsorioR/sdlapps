import { useEffect, useState } from "react";
import api from "../axiosConfig";

export default function Companies() {
  const empty = { name: "", abn: "", contact: "" };
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const load = async () => {
    setLoading(true); setErr("");
    try {
      const { data } = await api.get("/api/companies");
      setItems(data);
    } catch (e) { setErr(e?.response?.data?.error || "Load error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault(); setErr("");
    try {
      if (editingId) {
        await api.patch(`/api/companies/${editingId}`, form);
      } else {
        await api.post("/api/companies", form);
      }
      setForm(empty); setEditingId(null);
      load();
    } catch (e) {
      setErr(e?.response?.data?.error || "Save error");
    }
  };

  const edit = (it) => {
    setEditingId(it._id || it.id);
    setForm({ name: it.name, abn: it.abn ?? "", contact: it.contact ?? "" });
  };

const del = async (id) => {
  if (!window.confirm("Delete company?")) return; // <- usa window.confirm
  try {
    await api.delete(`/api/companies/${id}`);
    load();
  } catch (e) {
    setErr(e?.response?.data?.error || "Delete error");
  }
};

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto", padding: 16 }}>
      <h2>Companies</h2>

      {err && <div style={{ color: "crimson", marginBottom: 8 }}>{err}</div>}

      <form onSubmit={submit} style={{ display: "grid", gap: 8, gridTemplateColumns: "1fr 1fr 1fr auto" }}>
        <input name="name" placeholder="Name" value={form.name} onChange={onChange} required />
        <input name="abn" placeholder="ABN" value={form.abn} onChange={onChange} />
        <input name="contact" placeholder="Contact e-mail" value={form.contact} onChange={onChange} />
        <button type="submit">{editingId ? "Update" : "Create"}</button>
      </form>

      <div style={{ marginTop: 16 }}>
        {loading ? (<p>Loading…</p>) : (
          <table width="100%" cellPadding="8" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
                <th>Name</th><th>ABN</th><th>Contact</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => {
                const id = it._id || it.id;
                return (
                  <tr key={id} style={{ borderBottom: "1px solid #eee" }}>
                    <td>{it.name}</td>
                    <td>{it.abn}</td>
                    <td>{it.contact}</td>
                    <td>
                      <button onClick={() => edit(it)} style={{ marginRight: 8 }}>Edit</button>
                      <button onClick={() => del(id)}>Delete</button>
                    </td>
                  </tr>
                );
              })}
              {items.length === 0 && (
                <tr><td colSpan="4" style={{ color:"#666" }}>No companies yet.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
