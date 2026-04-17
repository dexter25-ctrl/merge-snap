import re

with open("index.html", "r") as f:
    html = f.read()

# Already handled in JS but we can ensure CSS is clean
html = re.sub(
    r"\.item-text \{ pointer-events: none; display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%; height: 100%; font-size: 0\.8rem; text-align: center; position: relative; z-index: 1; \}",
    r".item-text { pointer-events: none; display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; text-align: center; position: relative; z-index: 1; }",
    html
)

with open("index.html", "w") as f:
    f.write(html)
