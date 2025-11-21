import { useState } from "react";
import Links from "./Links";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(null);
  const [uid, setUid] = useState(null);

  const signup = async () => {
    const res = await fetch("http://localhost:3000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setUid(data.uid);
    console.log("Signup:", data);
  };

  const login = async () => {
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid }),
    });
    const data = await res.json();
    setToken(data.token);
    console.log("Login:", data);
  };

  if (token) {
    return <Links uid={uid} token={token} />;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>DevLinks - Frontend</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br />
      <button onClick={signup}>Cadastrar</button>
      <button onClick={login}>Login</button>
    </div>
  );
}

export default App;