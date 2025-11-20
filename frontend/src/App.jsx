import { useState } from "react";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(null);

  const signup = async () => {
    const res = await fetch("http://localhost:3000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    console.log("Signup:", data);
  };

  const login = async () => {
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid: "COLOQUE_O_UID_AQUI" }),
    });
    const data = await res.json();
    setToken(data.token);
    console.log("Login:", data);
  };

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

      {token && <p>Token: {token}</p>}
    </div>
  );
}

export default App;