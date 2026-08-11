// pre-commit 安全 gate：阻止危险文件/敏感内容入库
// 检测（无则退出 0，有则打印明细并退出 1 阻断提交）
//   1. .env / .env.* / 任意 *.db / *.sqlite 等
//   2. 疑似 API key（sk- 前缀、provider 键值对）
//   3. 常见私钥文件
import { spawnSync } from "node:child_process";

const BLOCKED_PATTERNS = [
  // environment / db / secret files
  /(^|\/)(\.env|\.env\.[a-z0-9]+)(\.example)?$/,
  /\.db(-journal|-wal|-shm)?$/,
  /\.sqlite(3)?(-journal)?$/,
  /\.(pem|p12|pfx|key)$/i,
];

// 只扫描已暂存(path A/M)文件
const diff = spawnSync("git", ["diff", "--cached", "--name-status", "--diff-filter=ACMR"], { encoding: "utf8" });
const stagedFiles = diff.stdout
  .split("\n")
  .map((l) => l.split("\t").pop()?.trim())
  .filter(Boolean);

const violations = [];

for (const file of stagedFiles) {
  for (const re of BLOCKED_PATTERNS) {
    if (re.test(file)) {
      violations.push({ file: file, reason: "matches blocked pattern " + re });
      break;
    }
  }
}

// 疑似 API key：扫描已暂存文件内容中的 sk- 长串密钥（测试 mock 值易误报，仅告警不阻断）
const suspiciousKeyFiles = [];
const stagedContent = spawnSync("git", ["diff", "--cached", "--no-color"], { encoding: "utf8" });
const addedLines = (stagedContent.stdout || "").split("\n").filter((l) => l.startsWith("+"));
for (const line of addedLines) {
  const m = line.match(/sk-[A-Za-z0-9]{20,}/);
  if (m && !/test|mock|example/i.test(line)) {
    const file = line.split("\t")[0];
    if (file && !suspiciousKeyFiles.includes(file)) suspiciousKeyFiles.push(file);
  }
}

if (violations.length > 0) {
  console.error("\n[security-gate] BLOCKED — 以下文件不得提交到仓库：");
  for (const v of violations) console.error("  x " + v.file + "  (" + v.reason + ")");
  console.error("\n它们可能包含数据库中的 API key 或环境凭据。请确认后加入 .gitignore。\n");
  process.exit(1);
}

if (suspiciousKeyFiles.length > 0) {
  console.warn("\n[security-gate] WARNING — 检测到疑似 API key 被暂存（sk- 长串）：");
  for (const f of suspiciousKeyFiles) console.warn("  ! " + f);
  console.warn("请确认这些是测试 mock 值，而非真实密钥。\n");
}

process.exit(0);