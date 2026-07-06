"""Generate soft male neural-voice MP3s for each project intro, per language.
Reads public/audio/scripts.json (produced by gen-audio-manifest.ts) and writes
public/audio/<file>.mp3. Uses Microsoft Edge TTS (free, no API key)."""
import asyncio
import json
import os
import edge_tts

ROOT = os.path.join(os.path.dirname(__file__), "..")
AUDIO_DIR = os.path.join(ROOT, "public", "audio")
RATE = "-4%"   # a touch slower = calmer, softer delivery
PITCH = "-2Hz"  # very slight drop for a warmer male tone


async def synth(item):
    out = os.path.join(AUDIO_DIR, item["file"] + ".mp3")
    tts = edge_tts.Communicate(item["text"], item["voice"], rate=RATE, pitch=PITCH)
    await tts.save(out)
    return item["file"], os.path.getsize(out)


async def main():
    with open(os.path.join(AUDIO_DIR, "scripts.json"), encoding="utf-8") as f:
        items = json.load(f)
    # small concurrency to be gentle on the endpoint
    sem = asyncio.Semaphore(4)

    async def guarded(it):
        async with sem:
            for attempt in range(3):
                try:
                    return await synth(it)
                except Exception as e:  # transient network — retry
                    if attempt == 2:
                        print("FAILED", it["file"], e)
                        return it["file"], 0
                    await asyncio.sleep(1.5)

    results = await asyncio.gather(*(guarded(it) for it in items))
    ok = [r for r in results if r[1] > 0]
    print(f"generated {len(ok)}/{len(items)} clips")
    total = sum(r[1] for r in ok)
    print(f"total size: {total/1024:.0f} KB")


if __name__ == "__main__":
    asyncio.run(main())
