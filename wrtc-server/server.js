const express = require("express");
const cors = require("cors");
const { RTCPeerConnection, RTCSessionDescription } = require("wrtc");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

app.post("/offer", async (req, res) => {
  try {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.ontrack = (event) => {
      console.log("📹 Remote track received:", event.streams[0].id);
    };

    await pc.setRemoteDescription(new RTCSessionDescription(req.body));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    res.json(pc.localDescription);
  } catch (err) {
    console.error("❌ Offer error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "wrtc-server" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ wrtc server running on ${PORT}`));
