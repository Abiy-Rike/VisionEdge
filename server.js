const express = require("express");
const { RTCPeerConnection, RTCSessionDescription } = require("wrtc");

const app = express();
app.use(express.json());

// Offer handler
app.post("/offer", async (req, res) => {
  try {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    // Save remote streams
    pc.ontrack = (event) => {
      console.log("📹 Received remote stream with tracks:", event.streams[0].getTracks().length);
      // You could record, relay, or just acknowledge
    };

    // Apply remote offer
    await pc.setRemoteDescription(new RTCSessionDescription(req.body));

    // Create answer
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    res.json(pc.localDescription);
  } catch (err) {
    console.error("❌ Offer error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "webrtc-wrtc-server" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ wrtc server running on ${PORT}`));
