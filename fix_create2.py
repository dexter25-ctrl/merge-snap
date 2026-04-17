import re

with open("index.html", "r") as f:
    html = f.read()

# Update createItemElement by looking for the actual text in the file
pattern = r"function createItemElement\(family, level\) \{[\s\S]*?return item;\n        \}"

new_js = """function createItemElement(family, level) {
            const item = document.createElement('div');
            item.className = 'item';
            item.draggable = true;
            item.dataset.family = family;
            item.dataset.level = level;

            const contentDiv = document.createElement('div');
            contentDiv.style.width = '80%';
            contentDiv.style.height = '80%';
            contentDiv.style.display = 'flex';
            contentDiv.style.justifyContent = 'center';
            contentDiv.style.alignItems = 'center';
            contentDiv.style.pointerEvents = 'none';

            if (family === 'A') {
                const img = document.createElement('img');
                img.src = `assets/appareil_lvl${level}.png`;
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'contain';
                contentDiv.appendChild(img);
            } else {
                const textSpan = document.createElement('span');
                textSpan.className = 'item-text';
                let nameParts = (itemNames[family][level - 1] || (family + ' Lvl ' + level)).split(' ');

                // For non-camera families, we just want the emoji as requested for the 80% view
                if (nameParts.length > 1) {
                    textSpan.innerHTML = `<span style="font-size: 2.5rem;">${nameParts[0]}</span>`;
                } else {
                    textSpan.textContent = nameParts[0];
                }
                contentDiv.appendChild(textSpan);
            }

            item.appendChild(contentDiv);

            item.addEventListener('dragstart', handleDragStart);
            item.addEventListener('dragend', handleDragEnd);
            item.addEventListener('click', handleItemClick);

            return item;
        }"""

html = re.sub(pattern, new_js, html)

with open("index.html", "w") as f:
    f.write(html)
