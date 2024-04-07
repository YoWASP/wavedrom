import sys
import json
import pathlib
import quickjs
try:
    import importlib.resources as importlib_resources
    importlib_resources.files(__package__)
except (ImportError, AttributeError):
    import importlib_resources


def render(source):
    ctx = quickjs.Context()
    ctx.set("module", ctx.globalThis)
    ctx.eval((importlib_resources.files(__package__) /  "bundle.js").read_text())
    return ctx.eval("render(" + json.dumps(source) + ")")


def _run_argv():
    if len(sys.argv) not in (1, 2, 3):
        print(f"Usage: {sys.argv[0]} [- | <input.json>] [- | <output.svg>]", file=sys.stderr)
        sys.exit(1)
    with (sys.stdin  if len(sys.argv) < 2 or sys.argv[1] == "-" else open(sys.argv[1], "r")) as f:
        source = json.load(f)
    output = render(source)
    with (sys.stdout if len(sys.argv) < 3 or sys.argv[2] == "-" else open(sys.argv[2], "w")) as f:
        f.write(output)
