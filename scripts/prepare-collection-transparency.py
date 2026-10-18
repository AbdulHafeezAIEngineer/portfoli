"""Prepare the owner's rotating-gallery clip; requires ffmpeg, NumPy and Pillow.

Only the outer gallery silhouette is matted. Dark website interiors are retained.
MP4 has no alpha channel, so its fallback uses the site's exact purple backdrop.
"""
import argparse
import json
from pathlib import Path
import subprocess
import tempfile

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]


def hull(points):
    points = sorted(set(points))
    def cross(o, a, b):
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
    lower, upper = [], []
    for point in points:
        while len(lower) >= 2 and cross(lower[-2], lower[-1], point) <= 0:
            lower.pop()
        lower.append(point)
    for point in reversed(points):
        while len(upper) >= 2 and cross(upper[-2], upper[-1], point) <= 0:
            upper.pop()
        upper.append(point)
    return lower[:-1] + upper[:-1]


def run(args):
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", *args], check=True)


def prepare(source):
    metadata = json.loads(subprocess.check_output([
        "ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
        "stream=width,height,r_frame_rate", "-of", "json", str(source),
    ]))["streams"][0]
    width, height = metadata["width"], metadata["height"]
    fps = metadata["r_frame_rate"]
    small_w, small_h = 320, round(320 * height / width)
    analysis = subprocess.Popen([
        "ffmpeg", "-hide_banner", "-loglevel", "error", "-i", str(source),
        "-vf", f"scale={small_w}:{small_h}", "-an", "-f", "rawvideo", "-pix_fmt", "rgb24", "pipe:1",
    ], stdout=subprocess.PIPE)
    masks = []
    while True:
        data = analysis.stdout.read(small_w * small_h * 3)
        if not data:
            break
        frame = np.frombuffer(data, dtype=np.uint8).reshape(small_h, small_w, 3)
        bright = frame.max(axis=2) > 42
        points = []
        for y in range(small_h):
            xs = np.flatnonzero(bright[y])
            if len(xs) >= 2:
                points.extend([(int(xs[0]), y), (int(xs[-1]), y)])
        if len(points) < 3:
            raise RuntimeError("No gallery silhouette detected")
        mask = Image.new("L", (small_w, small_h))
        ImageDraw.Draw(mask).polygon(hull(points), fill=255)
        masks.append(np.array(mask))
    if analysis.wait():
        raise RuntimeError("Video analysis failed")
    masks = np.stack(masks)
    palette = json.loads((ROOT / "data/theme-tokens.json").read_text())
    def rgb(value):
        return [int(value[i:i + 2], 16) for i in (1, 3, 5)]
    purple = [round(a * 0.22 + b * 0.78) for a, b in zip(rgb(palette["light"]["accent"]), rgb(palette["neutral"]["black"]))]
    backdrop = "0x" + "".join(f"{channel:02x}" for channel in purple)
    output = ROOT / "public/videos/home-collection-transparent"
    with tempfile.TemporaryDirectory(prefix="elvora-alpha-") as directory:
        master = Path(directory) / "gallery-alpha.mkv"
        decoder = subprocess.Popen([
            "ffmpeg", "-hide_banner", "-loglevel", "error", "-i", str(source),
            "-an", "-f", "rawvideo", "-pix_fmt", "rgb24", "pipe:1",
        ], stdout=subprocess.PIPE)
        encoder = subprocess.Popen([
            "ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-f", "rawvideo",
            "-pix_fmt", "rgba", "-s", f"{width}x{height}", "-r", fps, "-i", "pipe:0",
            "-an", "-c:v", "ffv1", "-level", "3", "-pix_fmt", "bgra", "-threads", "2", str(master),
        ], stdin=subprocess.PIPE)
        count = 0
        while True:
            data = decoder.stdout.read(width * height * 3)
            if not data:
                break
            frame = np.frombuffer(data, dtype=np.uint8).reshape(height, width, 3)
            # A temporal median prevents the outline wobbling as the website tiles rotate.
            low = np.median(masks[max(0, count - 3):min(len(masks), count + 4)], axis=0).astype(np.uint8)
            alpha = Image.fromarray(low).filter(ImageFilter.MaxFilter(3))
            alpha = np.array(alpha.resize((width, height), Image.Resampling.BICUBIC).filter(ImageFilter.GaussianBlur(2)))
            if alpha[0, 0] != 0 or alpha[height // 2, width // 2] < 250:
                raise RuntimeError("Matte must preserve the gallery center and clear its outer background")
            encoder.stdin.write(np.dstack((frame, alpha)).tobytes())
            count += 1
        encoder.stdin.close()
        if decoder.wait() or encoder.wait():
            raise RuntimeError("Alpha master generation failed")
        print(f"Matted {count} frames; dark website interiors preserved.", flush=True)
        for mobile, target in [(False, 1280), (True, 854)]:
            suffix = "-mobile" if mobile else ""
            run(["-i", str(master), "-an", "-vf", f"scale={target}:-2,format=yuva420p",
                 "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-auto-alt-ref", "0", "-b:v", "0",
                 "-crf", "35", "-deadline", "good", "-cpu-used", "4", "-threads", "2",
                 str(output) + suffix + ".webm"])
            composition = (f"color=c={backdrop}:s={width}x{height}:r={fps},format=rgba[bg];"
                           f"[bg][0:v]overlay=shortest=1:format=rgb,scale={target}:-2,format=yuv420p[out]")
            run(["-i", str(master), "-filter_complex", composition, "-map", "[out]", "-an",
                 "-c:v", "libx264", "-preset", "medium", "-crf", "24", "-threads", "2", "-movflags", "+faststart",
                 str(output) + suffix + ".mp4"])
            print(f"Prepared {'mobile' if mobile else 'desktop'} alpha WebM and purple MP4 fallback.", flush=True)
        run(["-ss", "1", "-i", str(master), "-frames:v", "1", "-vf", "format=rgba",
             "-c:v", "libwebp", "-quality", "88", str(output) + "-poster.webp"])
    print("Transparent poster ready; source clip and site palette were not changed.", flush=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    prepare(parser.parse_args().source)
