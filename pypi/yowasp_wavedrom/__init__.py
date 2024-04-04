import sys
import json
import pathlib
import quickjs
try:
    import importlib.resources as importlib_resources
except ImportError:
    import importlib_resources


def render(source):
    ctx = quickjs.Context()
    ctx.set("module", ctx.globalThis)
    ctx.eval((importlib_resources.files() /  "bundle.js").read_text())
    return ctx.eval("render(" + json.dumps(source) + ")")


def _run_argv():
    if len(sys.argv) not in (1, 2, 3):
        print(f"Usage: {sys.argv[0]} [- | <input.json>] [- | <output.svg>]", file=sys.stderr)
        sys.exit(1)
    with (open(sys.argv[1], "r") if len(sys.argv) >= 2 or sys.argv[1] == "-" else sys.stdin) as f:
        source = json.load(f)
    output = render(source)
    with (open(sys.argv[2], "w") if len(sys.argv) >= 3 or sys.argv[2] == "-" else sys.stdout) as f:
        f.write(output)
