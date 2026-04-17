import re

with open("index.html", "r") as f:
    html = f.read()

# Make sure item is 100% width and height and transparent
html = re.sub(
    r"\.item \{\n            width: 100%;\n            height: 100%;\n            background: transparent;\n            border: none;\n            box-shadow: none;\n            display: flex;\n            justify-content: center;\n            align-items: center;\n            cursor: grab;\n            user-select: none;\n            transition: transform 0\.1s;\n            position: relative;\n            /\* L'ombre de base de l'objet \*/\n            filter: drop-shadow\(0 4px 3px rgba\(0,0,0,0\.25\)\);\n        \}",
    r".item {\n            width: 100%;\n            height: 100%;\n            background: transparent;\n            border: none;\n            box-shadow: none;\n            display: flex;\n            justify-content: center;\n            align-items: center;\n            cursor: grab;\n            user-select: none;\n            transition: transform 0.1s;\n            position: relative;\n            filter: drop-shadow(0 4px 3px rgba(0,0,0,0.25));\n            box-sizing: border-box;\n        }",
    html
)

html = re.sub(
    r"\.item \{\n            width: 100%;\n            height: 100%;\n            background: transparent;\n            border: none;\n            box-shadow: none;\n            display: flex;\n            justify-content: center;\n            align-items: center;\n            font-size: 12px;\n            font-weight: bold;\n            color: #333;\n            text-align: center;\n            cursor: grab;\n            transition: transform 0\.1s;\n            user-select: none;\n            box-sizing: border-box;\n            position: relative;\n        \}",
    r"", # Remove duplicate
    html
)


# Remove the specific inventory-slot scaling, it's handled by img/emoji sizing now
html = re.sub(
    r"\.inventory-slot \.item \{\n            width: 80%; /\* 80% de la taille de la case \*/\n            height: 80%;\n        \}",
    r"",
    html
)

# And clear .inventory-slot .item .item-text duplicate / bad logic
html = re.sub(
    r"\.inventory-slot \.item \.item-text \{\n            display: none !important; /\* Pas de texte dans l'inventaire \*/\n        \}",
    r"",
    html
)


with open("index.html", "w") as f:
    f.write(html)
