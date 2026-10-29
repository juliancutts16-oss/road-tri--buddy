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
  // Speed test (test version only, for deciding whether to use the graphics chip): times the same passage on the main
  // processor (today's 92 MB model) and on the graphics chip (WebGPU, which needs the 326 MB full-size model), in a
  // worker of its own. Answers with seconds of work per second of speech for each. The page removes the big model afterwards.
  if (m.type === "gputest") {
    const say = (k, x) => self.postMessage({ type: "gpu", k, ...x });
    const time = async (dtype, device, k) => {
      const t0 = performance.now();
      const g = await KokoroTTS.from_pretrained(MODEL, { dtype, device, progress_callback: (p) => {
        if (p.status === "progress" && /\.onnx$/.test(p.file || "")) say("progress", { what: k, pct: Math.round(p.progress) });
      } });
      const load = (performance.now() - t0) / 1000;
      await g.generate("Hello.", { voice: m.voice }); // (the first go warms it up)
      const rtf = [];let bad = false;
      for (let i = 0; i < 2; i++) {
        const t = performance.now(), a = await g.generate(m.text, { voice: m.voice, speed: m.speed });
        rtf.push(Math.round((performance.now() - t) / 10 / (a.audio.length / a.sampling_rate)) / 100);
        if (a.audio.some((v) => !isFinite(v))) bad = true; // (broken audio, as the half-size model gives on some graphics chips)
      }
      return { load: Math.round(load), rtf: Math.min(...rtf), bad };
    };
    try { say("cpu", await time("q8", "wasm", "cpu")) } catch (err) { say("cpu", { err: String((err && err.message) || err) }) }
    try {
      const ad = self.navigator.gpu && (await self.navigator.gpu.requestAdapter());
      if (!ad) throw new Error("This phone can’t use its graphics chip for this (no WebGPU).");
      const info = ad.info || {};
      say("gpu", { ...(await time("fp32", "webgpu", "gpu")), chip: [info.vendor, info.architecture].filter(Boolean).join(" ") });
    } catch (err) { say("gpu", { err: String((err && err.message) || err) }) }
    say("done", {});
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
