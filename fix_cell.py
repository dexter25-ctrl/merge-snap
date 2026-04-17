import re

with open("index.html", "r") as f:
    html = f.read()

# Update .cell CSS
html = re.sub(
    r"\.cell \{\n            background: transparent; /\* Transparente comme demandé \*/\n            border: none;\n            box-shadow: none;\n            display: flex;\n            justify-content: center;\n            align-items: center;\n            position: relative;\n        \}",
    r".cell {\n            background: rgba(255,255,255,0.5);\n            border-radius: 8px;\n            border: 1px solid rgba(0,0,0,0.1);\n            box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);\n            display: flex;\n            justify-content: center;\n            align-items: center;\n            position: relative;\n            aspect-ratio: 1 / 1;\n            box-sizing: border-box;\n        }",
    html
)

with open("index.html", "w") as f:
    f.write(html)
