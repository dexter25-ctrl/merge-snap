# Document de Design (GDD) - Merge & Snap

## 1. Concept de Merge & Évolution

**Mécanique de base :**
Dès le début, le joueur dispose d'une grille (le Studio) remplie d'appareils photo de base. En fusionnant deux appareils identiques sur la grille, il obtient un modèle plus avancé. Cette mécanique simple est au cœur de la création des objets nécessaires pour honorer les commandes des clients.

**Hiérarchie des objets :**
La chaîne de fusion couvre l'histoire entière de la photographie, depuis ses balbutiements jusqu'à un futur lointain.
* **Vintage :** Daguerréotype, Brownie, etc.
* **Récents :** Argentique, Reflex, Hybride, etc.
* **Futuristes :** Appareils holographiques, drones optiques, etc.

## 2. Progression par "Recettes" et Niveaux

**Objectifs des Niveaux :**
Pour passer au niveau suivant, il ne suffit pas de simplement fusionner des objets. Le joueur doit compléter des **"Recettes de Shooting"** spécifiques. 
*Exemple de Recette Type :* Le client "Explorateur National" demande un Reportage en Jungle. Pour réussir, le joueur doit fusionner ses objets jusqu'à obtenir un *Appareil Tropicalisé* et un *Téléobjectif*. Une fois ces deux objets présents sur la grille, le joueur les donne à la recette pour gagner des points, valider la mission et progresser.

**Structure :**
Le jeu est structuré en niveaux, avec un minimum de 10 niveaux pour la phase de lancement. Chaque niveau demande de valider un nombre défini de recettes (commandes) pour des clients. Plus le niveau est élevé, plus les recettes demandent des objets de haut niveau (futuristes).

**Récompenses :**
À chaque fin de niveau ou recette validée, le joueur gagne :
* De la monnaie virtuelle.
* De l'énergie (nécessaire pour générer de nouveaux objets de base sur la grille).
* Des éléments de décoration pour personnaliser le studio photo de Clara.

**Déblocages de Fonctionnalités :**
Certains paliers de niveaux permettent de débloquer de nouvelles mécaniques pour enrichir le gameplay :
* **Niveau 3 :** *Flash Boost* - Permet d'accélérer une fusion ou d'obtenir un bonus d'énergie.
* **Niveau 5 :** *Laboratoire de réparation* & *Mode Rafale* - Le Mode Rafale permet de générer des objets sur la grille deux fois plus vite pendant 30 secondes.
* **Niveau 8 :** *Ventes aux enchères d'antiquités* - Permet de revendre des appareils de haut niveau ou d'acheter des pièces rares.

## 3. Narration et Univers

**Personnage Principal :**
*Clara*, une photographe de mode élégante, charismatique et passionnée. Elle fait office de guide pour le joueur, lui explique les mécaniques et lui présente les clients. Elle est toujours là pour donner des conseils et animer le studio.

**Univers Graphique :**
Les environnements mettent en scène des **paysages réels** emblématiques (Islande, Tokyo, New York), mais traités dans un **style cartoon et stylisé**. 
L'interface de départ est très "classe", moderne, propre et épurée, soulignant l'aspect professionnel de la photographie de mode.

**Missions :**
Les clients sont variés et apportent une touche de narration aux niveaux. On y retrouve des *influenceurs*, des *agences de presse* ou encore des *explorateurs*. Ils envoient des commandes de photos que Clara et le joueur doivent honorer en fusionnant les outils adéquats.

## 4. Aperçu de l'Interface de Jeu

**Le Menu Principal :**
* L'écran principal prend la forme d'une vue à travers l'appareil photo de Clara (ou l'appareil lui-même).
* Des boutons tactiles élégants et minimalistes sont disposés pour accéder au "Studio" (qui est la grille de jeu), à la boutique, ou aux options.

**L'Écran de Jeu (Le Studio) :**
* **En haut :** Clara (animée ou sous forme de portrait réactif), qui commente l'action, ainsi que le décor stylisé du niveau actuel (ex: vue sur New York cartoon). On y voit également les encarts des "Recettes" demandées par les clients.
* **En bas :** La grande **grille de fusion**. C'est ici que les objets apparaissent et que le joueur effectue ses actions de "merge" en glissant-déposant les éléments.
* **Interface globale :** Des compteurs pour l'énergie, la monnaie et le bouton pour accéder aux fonctionnalités spéciales (comme le Mode Rafale au niveau 5).

## 5. Chaîne de Fusion : Les 15 premiers objets (Appareils Photo)

Voici le tableau d'évolution des appareils photo, du plus ancien au plus futuriste, qui constitue la base de la chaîne de fusion.

| Niveau d'objet | Nom de l'objet | Catégorie | Description rapide |
| :---: | :--- | :--- | :--- |
| **1** | **Chambre Noire (Camera Obscura)** | Antique | Les prémices de la projection optique. |
| **2** | **Daguerréotype** | Antique | Le premier vrai appareil, lourd et sur trépied. |
| **3** | **Stéréoscope** | Vintage | Pour capturer des images en 3D d'époque. |
| **4** | **Kodak Brownie** | Vintage | L'appareil populaire en forme de boîte. |
| **5** | **Appareil à Soufflet (Folding)** | Vintage | Appareil de poche ancien, très élégant. |
| **6** | **Télémétrique Classique** | Rétro | Le favori des reporters du milieu du 20e siècle. |
| **7** | **Argentique Grand Public** | Rétro | L'appareil de famille des années 80-90. |
| **8** | **Polaroid (Instantané)** | Récents | La photo qui sort tout de suite ! |
| **9** | **Reflex Numérique (DSLR)** | Récents | L'outil professionnel par excellence. |
| **10** | **Appareil Tropicalisé** | Récents | Robuste, parfait pour les reportages en jungle. |
| **11** | **Hybride (Mirrorless)** | Récents | Compact, moderne et très performant. |
| **12** | **Caméra 360°** | Modernes | Pour capturer tout l'environnement d'un coup. |
| **13** | **Drone Optique** | Futuristes | Une caméra volante autonome. |
| **14** | **Lentille Bionique** | Futuristes | Un objectif qui s'intègre presque à l'œil. |
| **15** | **Appareil Holographique** | Futuristes | Capture et projette la scène en lumière solide. |
