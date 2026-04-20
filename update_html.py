import re

with open('index.html', 'r') as f:
    content = f.read()

# 1. Add CSS
css_to_add = """
        .btn-new-game {
            width: 80px !important;
            height: 80px !important;
            padding: 0 !important;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            white-space: normal !important; /* Permet le retour à la ligne */
            font-size: 12px !important;
            background-color: #f39c12 !important;
            color: #fff !important;
            text-transform: uppercase;
        }
"""
content = content.replace("        .btn-new {", css_to_add + "        .btn-new {")

# 2. Update renderMainMenu empty slot
empty_slot_pattern = r'<button class="save-slot-btn btn-new" onclick="newGameSlot\(\$\{i\}\)">Nouvelle Partie</button>'
empty_slot_repl = """<button class="save-slot-btn btn-new-game" onclick="newGameSlot(${i})">Nouvelle


Partie</button>"""
content = re.sub(empty_slot_pattern, empty_slot_repl, content)

# 3. Update renderMainMenu filled slot
filled_slot_pattern = r'<div class="save-slot-title">Slot \$\{i\}</div>\s*<div class="save-slot-info">\$\{data\.name \|\| \'Inconnu\'\} - \$\{data\.gender === \'male\' \? \'Homme\' : \'Femme\'\}</div>\s*<div class="save-slot-actions">\s*<button class="save-slot-btn btn-play" onclick="playSlot\(\$\{i\}\)">Jouer</button>\s*<button class="save-slot-btn btn-delete" onclick="deleteSlot\(\$\{i\}\)">🗑️</button>\s*</div>'

filled_slot_repl = """<p class="save-name" style="margin: 0 0 5px 0; font-weight: bold; color: #fff;">${data.name || 'Inconnu'}</p>
                        <div style="display: flex; flex-direction: column; gap: 5px;">
                            <button class="save-slot-btn btn-play" onclick="playSlot(${i})">Jouer</button>
                            <button class="save-slot-btn btn-delete" onclick="deleteSlot(${i})">🗑️</button>
                        </div>"""
content = re.sub(filled_slot_pattern, filled_slot_repl, content)


with open('index.html', 'w') as f:
    f.write(content)
