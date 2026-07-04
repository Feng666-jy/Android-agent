const { spawn } = require("child_process");
const path = require("path");

const server = spawn("npx.cmd", ["tsx", "server/src/index.ts"], {
  stdio: ["ignore", "pipe", "pipe"],
  cwd: process.cwd(),
  shell: true
});

let output = "";
server.stdout.on("data", d => output += d.toString());
server.stderr.on("data", d => output += d.toString());

setTimeout(async () => {
  console.log("=== Server Output ===");
  console.log(output);

  // Health check
  try {
    const res = await fetch("http://localhost:3000/health");
    const data = await res.json();
    console.log("=== Health:", JSON.stringify(data));
  } catch(e) { console.log("Health failed:", e.message); }

  // Register
  try {
    const res = await fetch("http://localhost:3000/api/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "testuser", password: "123456", email: "test@test.com" })
    });
    const data = await res.json();
    console.log("=== Register:", JSON.stringify(data));
  } catch(e) { console.log("Register failed:", e.message); }

  server.kill();
  process.exit(0);
}, 5000);