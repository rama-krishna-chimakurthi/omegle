import { useState } from "react";
import { Link } from "react-router";

export default function Landing() {
  const [name, setName] = useState("");
  return (
    <div>
      <h1>Welcome to Omegle Clone</h1>
      <p>Click the button below to start chatting with a random stranger!</p>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button>
        <Link to={"/room?name=" + name}>Start Chatting</Link>
      </button>
    </div>
  );
}
