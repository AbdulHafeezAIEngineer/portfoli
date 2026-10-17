// Local integration helper only; this is never used in deployment.
import http from "node:http";
import https from "node:https";
import fs from "node:fs";
if (
  process.env.AGENCY_TEST_DATABASE !== "isolated" ||
  process.env.AGENCY_TEST_TLS !== "self-signed-local"
)
  throw new Error("Explicit isolated local TLS fixture required.");
const port = Number(process.env.AGENCY_TEST_TLS_PORT || 3443);
const upstream = Number(process.env.AGENCY_TEST_APP_PORT || 3008);
if (
  ![port, upstream].every(
    (value) => Number.isInteger(value) && value >= 1024 && value <= 65535,
  )
)
  throw new Error("Invalid local test ports.");
const server = https.createServer(
  {
    key: fs.readFileSync(process.env.AGENCY_TEST_TLS_KEY),
    cert: fs.readFileSync(process.env.AGENCY_TEST_TLS_CERT),
  },
  (req, res) => {
    if (
      !["127.0.0.1", "localhost"].includes(
        (req.headers.host || "").split(":")[0],
      )
    ) {
      res.writeHead(400).end();
      return;
    }
    const proxy = http.request(
      {
        hostname: "127.0.0.1",
        port: upstream,
        method: req.method,
        path: req.url,
        headers: {
          ...req.headers,
          "x-forwarded-proto": "https",
          "x-forwarded-host": req.headers.host,
        },
      },
      (remote) => {
        res.writeHead(remote.statusCode || 502, remote.headers);
        remote.pipe(res);
      },
    );
    proxy.on("error", () => {
      res.writeHead(502).end("Local test application unavailable.");
    });
    req.pipe(proxy);
  },
);
server.listen(port, "127.0.0.1", () =>
  console.log("Isolated HTTPS test proxy ready."),
);
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => server.close(() => process.exit(0)));
