// Hoot's storyteller voice (Kokoro), running on the phone in the background so the screen stays smooth.
// The page asks for sentences; this turns them into audio. Nothing is sent anywhere: the model and voices are
// downloaded once (then kept on the phone by the app's offline worker and the model cache) and run locally.
import { KokoroTTS } from "https://cdn.jsdelivr.net/npm/kokoro-js@1.2.1/dist/kokoro.web.js";

const MODEL = "onnx-community/Kokoro-82M-v1.0-ONNX";
let tts = null;

self.onmessage = async (e) => {
  const m = e.data;
  if (m.type === "load") {
    try {
      tts = await KokoroTTS.from_pretrained(MODEL, {
        dtype: "q8", // about 92 MB, and sounds the same as the full-size model
        device: "wasm",
        progress_callback: (p) => {
          if (p.status === "progress" && /\.onnx$/.test(p.file || "")) self.postMessage({ type: "progress", pct: p.progress });
        },
      });
      // say a word in each voice once, so every voice file is downloaded and kept for use with no signal
      for (const v of m.voices) await tts.generate("Hello.", { voice: v });
      self.postMessage({ type: "ready" });
    } catch (err) {
      self.postMessage({ type: "error", msg: String((err && err.message) || err) });
    }
    return;
  }
  if (m.type === "say") {
    try {
      if (!tts) throw new Error("The storyteller voice isn't loaded.");
      const a = await tts.generate(m.text, { voice: m.voice, speed: m.speed });
      const pcm = a.audio;
      self.postMessage({ type: "audio", id: m.id, pcm, rate: a.sampling_rate }, [pcm.buffer]);
    } catch (err) {
      self.postMessage({ type: "fail", id: m.id, msg: String((err && err.message) || err) });
    }
  }
};
