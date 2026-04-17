import re

with open("index.html", "r") as f:
    html = f.read()

# Update createItemElement for Family A and others
old_js = """        function createItemElement(family, level) {
            const item = document.createElement('div');
            item.className = 'item';
            item.draggable = true;
            item.dataset.family = family;
            item.dataset.level = level;

            const textSpan = document.createElement('span');
            textSpan.className = 'item-text';

            if (family === 'A') {
                const img = document.createElement('div');
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.backgroundImage = `url('assets/appareil_lvl${level}.png')`;
                img.style.backgroundSize = 'contain';
                img.style.backgroundRepeat = 'no-repeat';
                img.style.backgroundPosition = 'center';
                img.style.position = 'absolute';
                img.style.top = '0';
                img.style.left = '0';
                img.style.zIndex = '0';
                item.appendChild(img);

                textSpan.textContent = '';
                item.style.position = 'relative'; // ensure child absolute positioning works
            } else {
                let nameParts = (itemNames[family][level - 1] || (family + ' Lvl ' + level)).split(' ');
                if (nameParts.length > 1) {
                    textSpan.innerHTML = `<span style="font-size: 2rem;">${nameParts[0]}</span><br/><span>${nameParts.slice(1).join(' ')}</span>`;
                } else {
                    textSpan.textContent = nameParts[0];
                }

            }


            item.appendChild(textSpan);

            item.addEventListener('dragstart', handleDragStart);
            item.addEventListener('dragend', handleDragEnd);
            item.addEventListener('click', handleItemClick);

            return item;
        }"""

new_js = """        function createItemElement(family, level) {
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

html = html.replace(old_js, new_js)

with open("index.html", "w") as f:
    f.write(html)
