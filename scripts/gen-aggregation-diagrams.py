"""Generate the aggregation diagrams on the Metrics Aggregations page.

Run: python3 scripts/gen-aggregation-diagrams.py
Writes one SVG per diagram into the page's images/ folder.
"""
import os, sys
from html import escape

OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), "..", "src/content/docs/docs/visualize-data/explore/metrics-aggregations/images")
FONT_MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace"
FONT_SANS = "ui-sans-serif, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
INK, MUTED, LINE, HEAD_BG, CARD = "#1f2937", "#6b7280", "#e5e7eb", "#f3f4f6", "#ffffff"
FAINT = "#b6bcc6"
ACCENT, ACCENT_TINT, ACCENT_DARK = "#f45b26", "#fde7dd", "#c2410c"
C = {"blue": ("#2563eb", "#e8f0fe"), "green": ("#15803d", "#e6f4ea"),
     "purple": ("#7c3aed", "#f1ebfe"), "amber": ("#b45309", "#fdf3e1"),
     "sky": ("#0891b2", "#e0f5fa"), "lime": ("#4d7c0f", "#eef6e0")}
BUCKETS = ["10:00", "10:05", "10:10", "10:15"]

# active_connections{service, region}: a raw point every minute, 5 per 5-minute interval
SERIES = [  # (service, region, color, dashed, raw points per interval)
    ("checkout", "us-east", "blue", False, [[6, 7, 7, 8, 7], [7, 8, 9, 8, 8], [8, 9, 8, 7, 8]]),
    ("checkout", "eu-west", "blue", True, [[3, 4, 5, 4, 4], [4, 5, 6, 5, 5], [5, 6, 7, 6, 6]]),
    ("payments", "us-east", "green", False, [[1, 2, 3, 2, 2], [2, 3, 4, 3, 3], [3, 2, 1, 2, 2]]),
    ("payments", "eu-west", "green", True, [[1, 1, 2, 1, 0], [0, 1, 1, 2, 1], [0, 0, 0, 0, 0]]),
]
AVG = [[sum(b) // len(b) for b in r] for *_, r in SERIES]
for (*_, r), a in zip(SERIES, AVG):
    assert all(sum(b) == len(b) * v for b, v in zip(r, a))
TOTAL = [sum(a[i] for a in AVG) for i in range(3)]
BY_SERVICE = {svc: [sum(a[i] for (sv, *_), a in zip(SERIES, AVG) if sv == svc) for i in range(3)]
              for svc in ("checkout", "payments")}

def t(x, y, s, size=12, fill=INK, anchor="start", weight="400", font=FONT_SANS, extra=""):
    return (f'<text x="{x:.1f}" y="{y:.1f}" font-family="{font}" font-size="{size}" fill="{fill}" '
            f'text-anchor="{anchor}" font-weight="{weight}" {extra}>{escape(str(s))}</text>')

def label(x, y, text):
    return t(x, y, text.upper(), 11, MUTED, weight="600", extra='letter-spacing="0.06em"')

def chip(cx, cy, name, detail=None):
    w = max(len(name) * 7.4, len(detail) * 6.3 if detail else 0) + 24
    h = 44 if detail else 28
    s = [f'<rect x="{cx-w/2:.1f}" y="{cy-h/2:.1f}" width="{w:.1f}" height="{h}" rx="{10 if detail else h/2}" fill="#fff4ef" stroke="{ACCENT}"/>',
         t(cx, cy + 4 - (8 if detail else 0), name, 12.5, ACCENT_DARK, "middle", "700")]
    if detail:
        s.append(t(cx, cy + 13, detail, 10.5, "#9a3412", "middle", font=FONT_MONO))
    return "\n".join(s), w

def harrow(x, cy, w, name, detail=None):
    c, cw = chip(x + w / 2, cy, name, detail)
    return "\n".join([
        f'<line x1="{x+6}" x2="{x+w-12}" y1="{cy}" y2="{cy}" stroke="{ACCENT}" stroke-width="2"/>',
        f'<path d="M{x+w-14} {cy-6} L{x+w-4} {cy} L{x+w-14} {cy+6} z" fill="{ACCENT}"/>', c])

def varrow(cx, y, h, name, detail=None, note=None, note_x=None):
    c, cw = chip(cx, y + h / 2, name, detail)
    s = [f'<line x1="{cx}" x2="{cx}" y1="{y+4}" y2="{y+h-10}" stroke="{ACCENT}" stroke-width="2"/>',
         f'<path d="M{cx-6} {y+h-12} L{cx} {y+h-2} L{cx+6} {y+h-12} z" fill="{ACCENT}"/>', c]
    if note:
        nx = note_x if note_x is not None else cx + cw / 2 + 16
        for i, line in enumerate(note):
            s.append(t(nx, y + h / 2 - 2 + i * 15 - (len(note) - 1) * 7, line, 12, MUTED))
    return "\n".join(s)

def card(W, H, title, body, caption=None):
    s = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img" aria-label="{escape(title)}">',
         f'<rect x="0.5" y="0.5" width="{W-1}" height="{H-1}" rx="12" fill="#fafafa" stroke="{LINE}"/>',
         t(24, 36, title, 14, INK, weight="700"), body]
    if caption:
        s.append(t(24, H - 20, caption, 12, MUTED))
    s.append("</svg>")
    return "\n".join(s)

def save(name, svg):
    with open(os.path.join(OUT, name), "w") as f:
        f.write(svg)
    print(name)

# ---------------------------------------------------------------- chart
def chart(x, y, w, h, ymax, ticks, series, raw=None, ghost=None, hl_bucket=None,
          value_labels=False, end_labels=True):
    """series: list of (name, color, [v per interval], dashed)."""
    PL, PB = 30, 22
    px, pw, ph = x + PL, w - PL - (62 if end_labels else 22), h - PB
    bw = pw / 3
    sy = lambda v: y + ph - v / ymax * ph
    s = []
    for i in range(3):
        fill = ACCENT_TINT if hl_bucket == i else (HEAD_BG if i % 2 == 0 else CARD)
        s.append(f'<rect x="{px+i*bw:.1f}" y="{y}" width="{bw:.1f}" height="{ph}" fill="{fill}"/>')
    for v in ticks:
        yy = sy(v)
        s.append(f'<line x1="{px}" x2="{px+pw}" y1="{yy:.1f}" y2="{yy:.1f}" stroke="{LINE}" stroke-dasharray="{"" if v == 0 else "2 3"}"/>')
        s.append(t(px - 6, yy + 4, v, 10.5, MUTED, "end", font=FONT_MONO))
    for i, b in enumerate(BUCKETS):
        s.append(f'<line x1="{px+i*bw:.1f}" x2="{px+i*bw:.1f}" y1="{y+ph}" y2="{y+ph+4}" stroke="{FAINT}"/>')
        s.append(t(px + i * bw, y + ph + 16, b, 10.5, MUTED, "middle", font=FONT_MONO))
    def pts_raw(vals):
        return [(px + bi * bw + (j + 0.5) / len(b) * bw, sy(v)) for bi, b in enumerate(vals) for j, v in enumerate(b)]
    for vals in (ghost or []):
        for (cx, cy) in pts_raw(vals):
            s.append(f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="2.5" fill="{FAINT}"/>')
    for col, vals in (raw or []):
        P = pts_raw(vals)
        s.append(f'<polyline points="{" ".join(f"{a:.1f},{b:.1f}" for a, b in P)}" fill="none" stroke="{C[col][0]}" stroke-width="1.5" stroke-opacity="0.55"/>')
        for (cx, cy) in P:
            s.append(f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="3" fill="{CARD}" stroke="{C[col][0]}" stroke-width="1.5"/>')
    for name, col, vals, dashed in series:
        solid = ACCENT if col == "accent" else C[col][0]
        P = [(px + (i + 0.5) * bw, sy(v)) for i, v in enumerate(vals)]
        dash = ' stroke-dasharray="6 4"' if dashed else ""
        s.append(f'<polyline points="{" ".join(f"{a:.1f},{b:.1f}" for a, b in P)}" fill="none" stroke="{solid}" stroke-width="2.5"{dash}/>')
        for i, (cx, cy) in enumerate(P):
            s.append(f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="4" fill="{solid}" stroke="{CARD}" stroke-width="1.5"/>')
            if value_labels or hl_bucket == i:
                s.append(t(cx, cy - 9, vals[i], 11, solid, "middle", "700", FONT_MONO, extra='stroke="#fafafa" stroke-width="3" paint-order="stroke"'))
        if end_labels:
            s.append(t(px + pw + 6, P[-1][1] + 4, name, 11, solid, weight="600", font=FONT_MONO))
    return "\n".join(s)

def legend(x, y, items, colw=158):
    """items: (text, color, dashed); laid out two per row."""
    s = []
    for i, (text, col, dashed) in enumerate(items):
        lx, ly = x + (i % 2) * colw, y + (i // 2) * 17
        dash = ' stroke-dasharray="5 3"' if dashed else ""
        s.append(f'<line x1="{lx}" x2="{lx+16}" y1="{ly-4}" y2="{ly-4}" stroke="{C[col][0]}" stroke-width="2.5"{dash}/>')
        s.append(t(lx + 22, ly, text, 11, MUTED, font=FONT_MONO))
    return "\n".join(s)

SERIES_LEGEND = [(f"{sv}, {rg}", col, d) for sv, rg, col, d, _ in SERIES]

# ---------------------------------------------------------------- 1. overview grid
def grid(x, y, labcols, rows, cols, cellw, labws, hl=None, hl_col=None, raw=False, outline=None):
    """labcols: header for each label column. rows: (labels tuple, color, cells)."""
    RH = 30
    labw = sum(labws)
    w, h = labw + cellw * len(cols), RH * (len(rows) + 1)
    s = [f'<g transform="translate({x},{y})">',
         f'<rect width="{w}" height="{h}" rx="6" fill="{CARD}" stroke="#d1d5db"/>',
         f'<path d="M0 6a6 6 0 0 1 6-6h{w-12}a6 6 0 0 1 6 6v{RH-6}h-{w}z" fill="{HEAD_BG}"/>']
    for ri in range(len(rows)):
        for ci in range(len(cols)):
            if (hl and hl == (ri, ci)) or hl_col == ci:
                s.append(f'<rect x="{labw+ci*cellw}" y="{RH*(ri+1)}" width="{cellw}" height="{RH}" fill="{ACCENT_TINT}"/>')
    if outline:
        ri, ci = outline
        s.append(f'<rect x="{labw+ci*cellw+2}" y="{RH*(ri+1)+2}" width="{cellw-4}" height="{RH-4}" rx="4" fill="none" stroke="{ACCENT}" stroke-width="1.5" stroke-dasharray="4 3"/>')
    for ri in range(1, len(rows) + 1):
        s.append(f'<line x1="0" x2="{w}" y1="{RH*ri}" y2="{RH*ri}" stroke="{LINE}"/>')
    xs, acc = [], 0
    for lw in labws:
        xs.append(acc); acc += lw
    for i in range(1, len(labws)):
        s.append(f'<line x1="{xs[i]}" x2="{xs[i]}" y1="0" y2="{h}" stroke="{LINE}" stroke-dasharray="2 3"/>')
    for ci in range(len(cols)):
        s.append(f'<line x1="{labw+ci*cellw}" x2="{labw+ci*cellw}" y1="0" y2="{h}" stroke="{LINE}"/>')
    for i, lc in enumerate(labcols):
        s.append(t(xs[i] + 10, RH / 2 + 4, lc, 11.5, MUTED, "start", "600", FONT_MONO))
    for ci, c in enumerate(cols):
        s.append(t(labw + ci * cellw + cellw / 2, RH / 2 + 4, c, 11.5, MUTED, "middle", "600", FONT_MONO))
    for ri, (labs, col, cells) in enumerate(rows):
        cy = RH * (ri + 1) + RH / 2 + 4
        if col:
            s.append(f'<circle cx="12" cy="{cy-4}" r="3.5" fill="{C[col][0]}"/>')
        for i, lab in enumerate(labs):
            s.append(t(xs[i] + (22 if i == 0 and col else 10), cy, lab, 12, INK, weight="600", font=FONT_MONO))
        for ci, v in enumerate(cells):
            cx = labw + ci * cellw + cellw / 2
            if raw:
                s.append(t(cx, cy, " ".join(map(str, v)), 11.5, INK, "middle", font=FONT_MONO))
            else:
                s.append(t(cx, cy, v, 12.5, INK, "middle", "700", FONT_MONO))
    s.append("</g>")
    return "\n".join(s), w, h

def overview():
    W = 740
    labws, cellw = [100, 84], 112
    gw = sum(labws) + cellw * 3
    gx = (W - gw) / 2
    cols = ["10:00", "10:05", "10:10"]
    body, y = [], 64
    body.append(label(gx, y, "Raw points every minute · active_connections"))
    g, _, gh = grid(gx, y + 10, ["service", "region"], [((sv, rg), col, r) for sv, rg, col, _, r in SERIES],
                    cols, cellw, labws, outline=(0, 0), raw=True)
    body.append(g); y += 10 + gh
    body.append(varrow(gx + sum(labws) + cellw / 2, y + 4, 76, "Within series", "Avg · Interval 5m",
                       note=["Combines the points in one series", "and one interval into one value."],
                       note_x=gx + sum(labws) + cellw + 56))
    y += 84
    body.append(label(gx, y + 12, "Four series · one value per interval"))
    g, _, gh = grid(gx, y + 22, ["service", "region"], [((sv, rg), col, a) for (sv, rg, col, _, _), a in zip(SERIES, AVG)],
                    cols, cellw, labws, hl_col=1, outline=(0, 0))
    body.append(g); y += 22 + gh
    body.append(varrow(gx + sum(labws) + cellw * 1.5, y + 4, 76, "Across series", "Sum by service",
                       note=["Adds up the series that share", "a service, in each interval."],
                       note_x=gx + sum(labws) + cellw * 2 + 40))
    y += 84
    body.append(label(gx, y + 12, "Two series · one per service"))
    g, _, gh = grid(gx, y + 22, ["service"], [((svc,), col, BY_SERVICE[svc]) for svc, col in (("checkout", "blue"), ("payments", "green"))],
                    cols, cellw, [sum(labws)], hl_col=1)
    body.append(g); y += 22 + gh
    H = int(y + 56)
    save("aggregation-overview.svg", card(W, H, "Aggregation within series, then across series", "\n".join(body),
         caption="Grouping by service drops region, so the four series become two."))

# ---------------------------------------------------------------- 2. within series
def within():
    W, cw, ch, aw = 740, 262, 190, 172
    x0, y0 = 24, 74
    sv, rg, col, _, raw = SERIES[0]
    body = [label(x0, y0 - 10, f"Input · {sv}, {rg}")]
    body.append(chart(x0, y0, cw, ch, 10, [0, 5, 10], [], raw=[(col, raw)], end_labels=False, hl_bucket=0))
    body.append(harrow(x0 + cw + 4, y0 + ch / 2 - 10, aw, "Within series", "Avg · Interval 5m"))
    ox = x0 + cw + aw + 10
    body.append(label(ox, y0 - 10, "Output · one point per interval"))
    body.append(chart(ox, y0, cw, ch, 10, [0, 5, 10], [(sv, col, AVG[0], False)],
                      ghost=[raw], value_labels=True, end_labels=False, hl_bucket=0))
    H = y0 + ch + 52
    a = raw[0]
    save("aggregation-within-series.svg", card(W, H, "Aggregation within series (temporal)", "\n".join(body),
         caption=f"A point every minute. The five points from 10:00 to 10:05 add up to {sum(a)}, so Avg gives {AVG[0][0]}."))

# ---------------------------------------------------------------- 3 & 4. across series
def across(fname, title, detail, outputs, ymax, ticks, out_label, caption):
    W, cw, ch, aw = 740, 262, 190, 172
    x0, y0 = 24, 74
    body = [label(x0, y0 - 10, "Input · four series")]
    body.append(chart(x0, y0, cw, ch, 10, [0, 5, 10],
                      [(f"{sv}, {rg}", col, a, d) for (sv, rg, col, d, _), a in zip(SERIES, AVG)],
                      hl_bucket=1, end_labels=False))
    body.append(legend(x0 + 4, y0 + ch + 18, SERIES_LEGEND))
    body.append(harrow(x0 + cw + 4, y0 + ch / 2 - 10, aw, "Across series", detail))
    ox = x0 + cw + aw + 10
    body.append(label(ox, y0 - 10, out_label))
    body.append(chart(ox, y0, cw, ch, ymax, ticks, outputs, hl_bucket=1, value_labels=True))
    H = y0 + ch + 82
    save(fname, card(W, H, title, "\n".join(body), caption=caption))

def across_all():
    a = [v[1] for v in AVG]
    across("aggregation-across-series.svg", "Aggregation across series (spatial)", "Sum",
           [("total", "accent", TOTAL, False)], 20, [0, 10, 20], "Output · one series",
           f"No Group by, so every series is added together. At 10:05: {' + '.join(map(str, a))} = {TOTAL[1]}.")

def across_by_service():
    c, p = [AVG[i][1] for i in (0, 1)], [AVG[i][1] for i in (2, 3)]
    across("aggregation-group-by.svg", "Across series with Group by", "Sum by service",
           [("checkout", "blue", BY_SERVICE["checkout"], False), ("payments", "green", BY_SERVICE["payments"], False)],
           15, [0, 5, 10, 15], "Output · one series per service",
           f"Group by service drops region. At 10:05, checkout is {c[0]} + {c[1]} = {sum(c)} and payments is {p[0]} + {p[1]} = {sum(p)}.")

overview(); within(); across_all(); across_by_service()
