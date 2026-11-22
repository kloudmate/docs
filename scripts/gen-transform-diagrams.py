"""Generate the input -> output diagrams on the dashboard Transformations page.

Run: python3 scripts/gen-transform-diagrams.py
Writes one SVG per transformation into the page's images/ folder.
"""
import os, sys
from html import escape

OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), "..", "src/content/docs/docs/visualize-data/dashboards/panel-options/images")
CW = 7.25          # mono char width at 12px
ROW_H = 26
PAD_X = 10
FONT_MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace"
FONT_SANS = "ui-sans-serif, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

INK, MUTED, LINE, HEAD_BG, CARD = "#1f2937", "#6b7280", "#e5e7eb", "#f3f4f6", "#ffffff"
ACCENT = "#f45b26"
# series colors: (solid, tint)
C = {
    "blue": ("#2563eb", "#e8f0fe"),
    "green": ("#15803d", "#e6f4ea"),
    "purple": ("#7c3aed", "#f1ebfe"),
    "amber": ("#b45309", "#fdf3e1"),
}

def is_num(s):
    try:
        float(str(s).replace(",", "").replace("%", "").replace(" MiB", "")); return True
    except ValueError:
        return False

def table(x, y, cols, rows, col_color=None, row_color=None, dropped=(), hl_col=None, dropped_cols=()):
    """Return (svg, w, h). col_color: {col_idx: color}, row_color: {row_idx: color}."""
    col_color, row_color = col_color or {}, row_color or {}
    widths = []
    for i, c in enumerate(cols):
        n = max([len(c)] + [len(str(r[i])) for r in rows])
        extra = 14 if i in col_color else 0  # room for the dot
        widths.append(round(n * CW + 2 * PAD_X + extra))
    w, h = sum(widths), ROW_H * (len(rows) + 1)
    s = [f'<g transform="translate({x},{y})">']
    s.append(f'<rect width="{w}" height="{h}" rx="6" fill="{CARD}" stroke="{LINE}"/>')
    s.append(f'<path d="M0 6a6 6 0 0 1 6-6h{w-12}a6 6 0 0 1 6 6v{ROW_H-6}h-{w}z" fill="{HEAD_BG}"/>')
    # cell tints
    for ri, r in enumerate(rows):
        cy = ROW_H * (ri + 1)
        cx = 0
        for ci, wd in enumerate(widths):
            tint = None
            if ri in dropped: tint = None
            elif ri in row_color: tint = C[row_color[ri]][1]
            elif ci in col_color: tint = C[col_color[ci]][1]
            if hl_col == ci and ri not in dropped: tint = "#fde7dd"
            if ci in dropped_cols: tint = None
            if tint:
                last = ri == len(rows) - 1
                if last and (ci == 0 or ci == len(widths) - 1):
                    # keep rounded bottom corners clean
                    s.append(f'<rect x="{cx+0.5}" y="{cy}" width="{wd-1}" height="{ROW_H-0.5}" rx="5" fill="{tint}"/>')
                    s.append(f'<rect x="{cx+0.5}" y="{cy}" width="{wd-1}" height="{ROW_H/2}" fill="{tint}"/>')
                    s.append(f'<rect x="{cx + (0 if ci else wd/2)}" y="{cy}" width="{wd/2-0.5}" height="{ROW_H-0.5}" fill="{tint}"/>')
                else:
                    s.append(f'<rect x="{cx}" y="{cy}" width="{wd}" height="{ROW_H}" fill="{tint}"/>')
            cx += wd
    # grid
    for ri in range(1, len(rows) + 1):
        s.append(f'<line x1="0" x2="{w}" y1="{ROW_H*ri}" y2="{ROW_H*ri}" stroke="{LINE}"/>')
    cx = 0
    for wd in widths[:-1]:
        cx += wd
        s.append(f'<line x1="{cx}" x2="{cx}" y1="0" y2="{h}" stroke="{LINE}"/>')
    s.append(f'<rect width="{w}" height="{h}" rx="6" fill="none" stroke="#d1d5db"/>')
    # text
    def cell(ci, cx, cy, text, header=False, faded=False):
        wd = widths[ci]
        color = MUTED if header else INK
        if faded or ci in dropped_cols: color = "#b6bcc6"
        weight = "600" if header else "400"
        num = not header and is_num(text)
        tx = cx + PAD_X
        out = []
        if header and ci in col_color:
            out.append(f'<circle cx="{cx+PAD_X+3.5}" cy="{cy+ROW_H/2}" r="3.5" fill="{C[col_color[ci]][0]}"/>')
            tx += 14
        if header and hl_col == ci:
            color = ACCENT
        anchor = "start"
        if num:
            tx, anchor = cx + wd - PAD_X, "end"
        out.append(f'<text x="{tx}" y="{cy+ROW_H/2+4}" text-anchor="{anchor}" fill="{color}" font-weight="{weight}">{escape(str(text))}</text>')
        if faded:
            tl = len(str(text)) * CW
            x1 = tx - tl if anchor == "end" else tx
            out.append(f'<line x1="{x1-1}" x2="{x1+tl+1}" y1="{cy+ROW_H/2}" y2="{cy+ROW_H/2}" stroke="#b6bcc6"/>')
        return out
    cx = 0
    for ci, c in enumerate(cols):
        s += cell(ci, cx, 0, c, header=True); cx += widths[ci]
    for ri, r in enumerate(rows):
        cx = 0
        for ci, v in enumerate(r):
            s += cell(ci, cx, ROW_H * (ri + 1), v, faded=ri in dropped); cx += widths[ci]
    # row dots for row-colored rows
    s.append('</g>')
    return "\n".join(s), w, h

def label(x, y, text, color=MUTED, chip=None):
    out = []
    tx = x
    if chip:
        out.append(f'<circle cx="{x+4}" cy="{y-4}" r="4" fill="{C[chip][0]}"/>')
        tx += 13
    out.append(f'<text x="{tx}" y="{y}" fill="{color}" font-family="{FONT_SANS}" font-size="11" font-weight="600" letter-spacing="0.06em">{escape(text.upper())}</text>')
    return "\n".join(out)

def arrow(x, cy, w, name, detail):
    s = []
    s.append(f'<line x1="{x+8}" x2="{x+w-14}" y1="{cy}" y2="{cy}" stroke="{ACCENT}" stroke-width="2"/>')
    s.append(f'<path d="M{x+w-16} {cy-6} L{x+w-6} {cy} L{x+w-16} {cy+6} z" fill="{ACCENT}"/>')
    cw = max(len(name) * 7.4, len(detail) * 6.3 if detail else 0) + 24
    bx = x + (w - cw) / 2
    bh = 44 if detail else 28
    s.append(f'<rect x="{bx}" y="{cy-bh/2}" width="{cw}" height="{bh}" rx="{bh/2 if not detail else 10}" fill="#fff4ef" stroke="{ACCENT}"/>')
    ny = cy + 4 - (8 if detail else 0)
    s.append(f'<text x="{x+w/2}" y="{ny}" text-anchor="middle" fill="#c2410c" font-family="{FONT_SANS}" font-size="12.5" font-weight="700">{escape(name)}</text>')
    if detail:
        s.append(f'<text x="{x+w/2}" y="{cy+13}" text-anchor="middle" fill="#9a3412" font-family="{FONT_MONO}" font-size="10.5">{escape(detail)}</text>')
    return "\n".join(s), cw

def render(fname, title, inputs, output, step, detail=None, caption=None):
    """inputs: list of (label, chip, table_kwargs); output: table_kwargs."""
    M, GAP_LABEL, STACK_GAP = 24, 20, 22
    # measure
    ins = []
    for lab, chip, kw in inputs:
        _, w, h = table(0, 0, **kw); ins.append((lab, chip, kw, w, h))
    _, ow, oh = table(0, 0, **output)
    in_w = max(i[3] for i in ins)
    in_h = sum(GAP_LABEL + i[4] for i in ins) + STACK_GAP * (len(ins) - 1)
    out_h = GAP_LABEL + oh
    _, chip_w = arrow(0, 0, 10, step, detail)
    arrow_w = max(170, chip_w + 72)
    top = M + 30
    body_h = max(in_h, out_h)
    W = round(M + in_w + arrow_w + ow + M)
    H = round(top + body_h + M + (22 if caption else 0))
    s = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" font-family="{FONT_MONO}" font-size="12" role="img" aria-label="{escape(title)}">']
    s.append(f'<rect x="0.5" y="0.5" width="{W-1}" height="{H-1}" rx="12" fill="#fafafa" stroke="{LINE}"/>')
    s.append(f'<text x="{M}" y="{M+12}" fill="{INK}" font-family="{FONT_SANS}" font-size="14" font-weight="700">{escape(title)}</text>')
    # inputs
    y = top + (body_h - in_h) / 2
    for lab, chip, kw, w, h in ins:
        s.append(label(M, y + 12, lab, chip=chip))
        t, _, _ = table(M, y + GAP_LABEL, **kw); s.append(t)
        y += GAP_LABEL + h + STACK_GAP
    # arrow
    ax = M + in_w
    a, _ = arrow(ax, top + body_h / 2 + GAP_LABEL / 2, arrow_w, step, detail); s.append(a)
    # output
    ox = ax + arrow_w
    oy = top + (body_h - out_h) / 2
    s.append(label(ox, oy + 12, "Output"))
    t, _, _ = table(ox, oy + GAP_LABEL, **output); s.append(t)
    if caption:
        s.append(f'<text x="{M}" y="{H-M+4}" fill="{MUTED}" font-family="{FONT_SANS}" font-size="12">{escape(caption)}</text>')
    s.append('</svg>')
    with open(os.path.join(OUT, "transform-" + fname), "w") as f:
        f.write("\n".join(s))
    print(fname, W, H)

# ---------- Reduce ----------
render("reduce.svg", "Reduce",
    [("Input · CPU % per host", None, dict(
        cols=["time", "web-1", "web-2", "db-1"],
        rows=[["10:00", 42, 61, 77], ["10:01", 48, 83, 79], ["10:02", 45, 92, 81], ["10:03", 51, 74, 86]],
        col_color={1: "blue", 2: "green", 3: "purple"}))],
    dict(cols=["host", "Last", "Max", "Mean"],
         rows=[["web-1", 51, 51, 46.5], ["web-2", 74, 92, 77.5], ["db-1", 86, 86, 80.8]],
         row_color={0: "blue", 1: "green", 2: "purple"}),
    "Reduce", "Last · Max · Mean",
    caption="Each series over time becomes one row, with a column per calculation.")

# ---------- Filter rows ----------
render("filter-rows.svg", "Filter rows",
    [("Input", None, dict(
        cols=["host", "Last", "Max", "Mean"],
        rows=[["web-1", 51, 51, 46.5], ["web-2", 74, 92, 77.5], ["db-1", 86, 86, 80.8], ["db-2", 60, 64, 58.2]],
        dropped={0, 3}, hl_col=2))],
    dict(cols=["host", "Last", "Max", "Mean"],
         rows=[["web-2", 74, 92, 77.5], ["db-1", 86, 86, 80.8]], hl_col=2),
    "Filter rows", "Max greater than 80",
    caption="Rows that fail the condition are removed.")

# ---------- Group by ----------
render("group-by.svg", "Group by",
    [("Input", None, dict(
        cols=["k8s.namespace.name", "k8s.pod.name", "memory"],
        rows=[["checkout", "checkout-7f9c", "412 MiB"], ["checkout", "checkout-b21d", "388 MiB"],
              ["payments", "payments-4k2p", "256 MiB"], ["payments", "payments-9xq1", "301 MiB"],
              ["search", "search-0", "1024 MiB"]],
        row_color={0: "blue", 1: "blue", 2: "green", 3: "green", 4: "purple"}, dropped_cols={1}))],
    dict(cols=["k8s.namespace.name", "memory (Total)"],
         rows=[["checkout", "800 MiB"], ["payments", "557 MiB"], ["search", "1024 MiB"]],
         row_color={0: "blue", 1: "green", 2: "purple"}),
    "Group by", "namespace · Total",
    caption="Rows with the same namespace collapse into one. k8s.pod.name isn't grouped, so it's dropped.")

# ---------- Join by field ----------
render("join-by-field.svg", "Join by field",
    [("Query A · requests", "blue", dict(
        cols=["service", "requests"],
        rows=[["checkout", "1,240"], ["payments", "860"], ["search", "3,410"]],
        col_color={1: "blue"})),
     ("Query B · errors", "purple", dict(
        cols=["service", "errors"],
        rows=[["checkout", 12], ["payments", 31], ["search", 4]],
        col_color={1: "purple"}))],
    dict(cols=["service", "requests", "errors"],
         rows=[["checkout", "1,240", 12], ["payments", "860", 31], ["search", "3,410", 4]],
         col_color={1: "blue", 2: "purple"}),
    "Join by field", None,
    caption="Rows from each query are matched on service, with one column per query.")

# ---------- Series to rows ----------
render("series-to-rows.svg", "Series to rows",
    [("Input · a column per host", None, dict(
        cols=["time", "web-1", "web-2"],
        rows=[["10:00", 42, 61], ["10:01", 48, 83]],
        col_color={1: "blue", 2: "green"}))],
    dict(cols=["time", "host", "cpu"],
         rows=[["10:00", "web-1", 42], ["10:00", "web-2", 61], ["10:01", "web-1", 48], ["10:01", "web-2", 83]],
         row_color={0: "blue", 1: "green", 2: "blue", 3: "green"}),
    "Series to rows", None,
    caption="Each series becomes rows, with its label in a host column beside one value column.")

# ---------- Organize fields ----------
render("organize-fields.svg", "Organize fields",
    [("Input", None, dict(
        cols=["service.namespace", "host.name", "cpu"],
        rows=[["shop", "web-1", 51], ["shop", "web-2", 74], ["shop", "db-1", 86]],
        dropped_cols={0}, col_color={1: "blue"}))],
    dict(cols=["Host", "cpu"],
         rows=[["web-1", 51], ["web-2", 74], ["db-1", 86]],
         col_color={0: "blue"}),
    "Organize fields", "move · hide · rename",
    caption="host.name moves first and is renamed to Host. service.namespace is hidden.")

# ---------- Sort by ----------
render("sort-by.svg", "Sort by",
    [("Input", None, dict(
        cols=["host", "Max"],
        rows=[["web-1", 51], ["web-2", 92], ["db-1", 86], ["db-2", 64]],
        hl_col=1, row_color={1: "blue"}))],
    dict(cols=["host", "Max"],
         rows=[["web-2", 92], ["db-1", 86], ["db-2", 64], ["web-1", 51]],
         hl_col=1, row_color={0: "blue"}),
    "Sort by", "Max · Descending",
    caption="Rows are reordered by one column. The busiest host comes first.")

# ---------- Extract fields ----------
render("extract-fields.svg", "Extract fields",
    [("Input", None, dict(
        cols=["time", "attributes"],
        rows=[["10:00", '{"method":"GET","status":200}'], ["10:01", '{"method":"POST","status":502}']],
        col_color={1: "purple"}))],
    dict(cols=["time", "method", "status"],
         rows=[["10:00", "GET", 200], ["10:01", "POST", 502]],
         col_color={1: "purple", 2: "purple"}),
    "Extract fields", "Column: attributes",
    caption="Each key in the JSON column becomes its own column.")

# ---------- Filter by query ----------
render("filter-by-query.svg", "Filter by query",
    [("Query A · requests", "blue", dict(
        cols=["time", "requests"],
        rows=[["10:00", "1,240"], ["10:01", "1,310"]],
        col_color={1: "blue"})),
     ("Query B · helper", "purple", dict(
        cols=["time", "total"],
        rows=[["10:00", "5,510"], ["10:01", "5,620"]],
        dropped_cols={0, 1}))],
    dict(cols=["time", "requests"],
         rows=[["10:00", "1,240"], ["10:01", "1,310"]],
         col_color={1: "blue"}),
    "Filter by query", "Draw everything else · B",
    caption="Query B still runs, so an expression can use it, but the panel doesn't draw it.")
