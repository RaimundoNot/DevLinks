import { useState, useEffect } from "react";

function Links({ uid, token }) {
  const [links, setLinks] = useState([]);
  const [newLink, setNewLink] = useState("");

  // Buscar links
  useEffect(() => {
    const fetchLinks = async () => {
      const res = await fetch(`http://localhost:3000/users/${uid}/links`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setLinks(data);
    };
    if (token) fetchLinks();
  }, [uid, token]);

  // Adicionar link
const addLink = async () => {
  const res = await fetch(`http://localhost:3000/users/${uid}/links`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ url: newLink }),
  });
  const data = await res.json();
  setLinks([...links, data]);
  setNewLink("");
};

  // Excluir link
  const deleteLink = async (linkId) => {
    await fetch(`http://localhost:3000/users/${uid}/links/${linkId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setLinks(links.filter((link) => link.id !== linkId));
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Meus Links</h2>
      <ul>
        {links.map((link) => (
          <li key={link.id}>
            <a href={link.url} target="_blank" rel="noreferrer">
              {link.url}
            </a>
            <button onClick={() => deleteLink(link.id)}>Excluir</button>
          </li>
        ))}
      </ul>

      <input
        type="text"
        placeholder="Novo link"
        value={newLink}
        onChange={(e) => setNewLink(e.target.value)}
      />
      <button onClick={addLink}>Adicionar</button>
    </div>
  );
}

export default Links;