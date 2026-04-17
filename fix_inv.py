import re

with open("index.html", "r") as f:
    html = f.read()

# Update .inventory-slot CSS
html = re.sub(
    r"\.inventory-slot \{\n            background-color: transparent;\n            border: none;\n            box-shadow: none;\n            aspect-ratio: 1; /\* Cases carrées \*/\n            display: flex;\n            justify-content: center;\n            align-items: center;\n            position: relative;\n        \}",
    r".inventory-slot {\n            background-color: rgba(255,255,255,0.1);\n            border-radius: 6px;\n            border: 1px solid rgba(255,255,255,0.2);\n            box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);\n            aspect-ratio: 1 / 1;\n            display: flex;\n            justify-content: center;\n            align-items: center;\n            position: relative;\n            box-sizing: border-box;\n        }",
    html
)

with open("index.html", "w") as f:
    f.write(html)
