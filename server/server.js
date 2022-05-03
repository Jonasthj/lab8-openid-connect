import express from "express";
import * as path from "path";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

async function fetchJSON(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(`Failed ${res.status}`);
  }
  return await res.json();
}

const discovery_endpoint =
  "https://login.microsoftonline.com/organizations/v2.0/.well-known/openid-configuration";
const client_id = process.env.CLIENT_ID;
const scope = "openid profile email";

app.get("/api/login", async (req, res) => {
  const { access_token } = req.signedCookies;

  const { userinfo_endpoint } = await fetchJSON(discovery_endpoint);

  const userinfo = await fetch(userinfo_endpoint, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (userinfo.status === 401) {
    return res.sendStatus(401);
  } else if (userinfo.ok) {
    res.json(await userinfo.json());
  } else {
    console.error(`Failed: ${userinfo.status} ${userinfo.statusText}`);
    return res.sendStatus(500);
  }
});

app.get("/api/config", (req, res) => {
  res.json({
    response_type: "code",
    client_id,
    discovery_endpoint,
    scope,
  });
});

app.post("/api/login", (req, res) => {
  const { access_token } = req.body;
  res.cookie("access_token", access_token, { signed: true });
  res.sendStatus(200);
});

app.use(express.static("../client/dist"));
app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api")) {
    res.sendFile(path.resolve("../client/dist/index.html"));
  } else {
    next();
  }
});

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Started on http://localhost:${server.address().port}`);
});
