import { UserGuide } from './interface-guide';

export const dataUserGuide: UserGuide[] = [
    // 'Divers' section

    {
        title: 'Créer ou continuer dessin',
        isTool: 'Divers',
        description:
            "En tant qu'utilisateur, il vous est possible de créer un nouveau dessin en cliquant sur Créer nouveau dessin dans la page d'acceuil ou bien sur l'icône + en bas à droite de votre écran lorsque vous vous trouvez sur la vue dessin. Il est aussi possible d'utiliser le raccourci clavier Ctrl + O afin de créer un nouveau dessin. Si jamais vous pressez accidentellement le bouton créer nouveau dessin, un message de confirmation apparaitra afin de vous puissiez soit revenir à votre dessin actuel ou en recommencer un nouveau. Il vous est aussi possible de récupérer le dessin sauvegardé automatiquement le plus à jour. L'option de continuer un dessin est seulement vivible si un dessin a été sauvegardé par l'application.",
        gifPath: '',
        screenshotPath: 'assets/user_guide/newdraw.png',
    },
    {
        title: 'Caroussel de dessin',
        isTool: 'Divers',
        description:
            "Le carroussel de dessin vous permet d'accéder à vos précédents dessins sauvegardés sur le serveur. Vos dessins seront affichés sous forme de petites fiches comportant votre dessin, son nom et les étiquettes associées au dessin. Il vous est possible de filtrer le contenu du carrousel en spécifiant une ou plusieurs étiquettes.",
        gifPath: '',
        screenshotPath: 'assets/user_guide/carroussel.png',
    },
    {
        title: 'Sauvegarde automatique et manuelle',
        isTool: 'Divers',
        description:
            "En tant qu'utilisateur, il vous est possible de sauvegarder vos dessins sur un serveur. Il vous faudra fournir un nom pour votre dessin et vous pouurez aussi rajouter des étiquettes (tags) valides afin de mieux répertorier votre dessin dans le serveur. Le format du dessin sauvegardé sera PNG.",
        gifPath: '',
        screenshotPath: 'assets/user_guide/sauvegarde.png',
    },
    {
        title: 'Exportation - Envoi par courriel',
        isTool: 'Divers',
        description:
            'La fonctionnalité Exportation offre de créer une image à partir de la surface de dessin et de l’exporter dans un des formats suivants : JPG ou PNG. Il vous faudra entrer un nom pour le fichier exporté. Si vous le souhaitez, plutôt que de sauvegarder localement votre dessin exporté, il vous est possible de l’envoyer par courriel. Il vous est aussi possible d’appliquer un filtre sur l’image avant que l’exportation ne soit effectuée parmiles  cinq filtres différents disponibles.',
        gifPath: '',
        screenshotPath: 'assets/user_guide/exportation.png',
    },

    // 'Dessiner' section

    {
        title: 'Outils',
        isTool: 'Dessiner',
        description:
            'Les outils servent à modifier la surface de dessin.Vous pouvez sélectionnez un outil via la barre latérale ou grâce aux raccourcis clavier. Quand un outil est sélectionné, il devient l’outil actif contrôlé par votre souris. Le barre latérale secondaire affiche alors ses attributs configurables que vous pouvez modifier. Les outils disponibles sont : crayon, pinceau, ligne, rectangle, ellipse ou encore la palette de couleur.',
        gifPath: '',
        screenshotPath: '',
    },
    {
        title: 'Outils - Crayon',
        isTool: 'Dessiner',
        description:
            "Le crayon est l’outil de base du logiciel de dessin. Il ne sert qu’à faire de simples traits sans texture particulière. Il dispose d'une pointe ronde et il est possible de modifier son épaisseur via la barre latérale secondaire. Il est aussi possible d'utiliser la touche C de votre clavier afin de basculer directement sur l'outil crayon.",
        gifPath: 'assets/user_guide/pencil.gif',
        screenshotPath: 'assets/user_guide/pencil.png',
    },
    {
        title: 'Outils - Efface',
        isTool: 'Dessiner',
        description:
            "Cet outil permet d’effacer (rendre blanc) des pixels de la surface de dessin. Lorsque le clic gauche de la souris est enfoncé, tous les pixels se trouvant sous l’icône du pointeur de la souris deviennent blancs. Pour représenter l’efface, l’icône du pointeur de la souris est représenté par un carré blanc avec une très mince bordure noire. Il est possible de modifier son épaisseur via la barre latérale secondaire. Il est aussi possible d'utiliser la touche E de votre clavier afin de basculer directement sur l'outil efface.",
        gifPath: 'assets/user_guide/eraser.gif',
        screenshotPath: 'assets/user_guide/eraser.png',
    },
    {
        title: 'Outils - Pinceau',
        isTool: 'Dessiner',
        description:
            "Cet outil est similaire au crayon. Il n’en diffère que par la texture du trait. Il est possible de choisir parmi cinq textures différentes. On peut modifier son épaisseur et la texture via la barre latérale secondaire. Il est aussi possible d'utiliser la touche W de votre clavier afin de basculer directement sur l'outil pinceau.",
        gifPath: 'assets/user_guide/brush.gif',
        screenshotPath: 'assets/user_guide/brush.png',
    },
    {
        title: 'Outils - Ligne',
        isTool: 'Dessiner',
        description:
            "Cet outil permet de tracer une ligne composée d’un ou plusieurs segments. Votre premier clic définit la position de départ de la ligne. Ensuite, chaque clic qui suit « connecte » avec le clic qui le précède pour former un segment de la ligne. Lorsque vous maintenez la touche Shift enfoncée, le segment temporaire s’orientera selon l’un des angles suivants : 0, 45, 90, 135, 180, 225, 270 ou 315 degrés. Afin de quitter l'outil ligne, il vous faudra effectuer un double-clique gauche. Il est aussi possible d'utiliser la touche L de votre clavier afin de basculer directement sur l'outil ligne.",
        gifPath: 'assets/user_guide/line.gif',
        screenshotPath: 'assets/user_guide/line.png',
    },
    {
        title: 'Outils - Rectangle',
        isTool: 'Dessiner',
        description:
            "Cet outil permet de dessiner des rectangles. Il vous est possible de créer des rectangles sur la surface de dessin en faisant des glisser-déposer. Si vous souhaitez tracé un carré, appuyez sur la touche Shift pendant votre glisser-déposer. De plus, il vous est possible de choisir entre trois types de rectangles : contour (on ne dessine que les contours), plein (intérieur rempli sans contour) ou plein avec contour (on dessine l'intérieur et les contours du rectangle). Aussi, vous pouvez modifier l'épaisseur des contours via la barre latérale secondaire. Il est possible d'utiliser la touche 1 de votre clavier afin de basculer directement sur l'outil rectangle.",
        gifPath: 'assets/user_guide/rectangle.gif',
        screenshotPath: 'assets/user_guide/assets/user_guide/rectangle.png',
    },
    {
        title: 'Outils - Ellipse',
        isTool: 'Dessiner',
        description:
            "Cet outil permet de dessiner des ellipses. Il vous est possible de créer des ellipses sur la surface de dessin en faisant des glisser-déposer. Si vous souhaitez tracé un cercle, appuyez sur la touche Shift pendant votre glisser-déposer. De plus, il vous est possible de choisir entre trois types d'ellipses : contour (on ne dessine que les contours), plein (intérieur rempli sans contour) ou plein avec contour (on dessine l'intérieur et les contours). Aussi, vous pouvez modifier l'épaisseur des contours via la barre latérale secondaire. Il est possible d'utiliser la touche 2 de votre clavier afin de basculer directement sur l'outil ellipse.",
        gifPath: 'assets/user_guide/ellipse.gif',
        screenshotPath: 'assets/user_guide/ellipse.png',
    },
    {
        title: 'Outils - Polygone',
        isTool: 'Dessiner',
        description:
            "Cet outil permet de dessiner des polygones. Il vous est possible de créer des polygones sur la surface de dessin en faisant des glisser-déposer. Le nombre de côtés peut être modifié (de 3 à 12) afin de tracé le polygone souhaité. De plus, il vous est possible de choisir entre trois types de polygones : contour (on ne dessine que les contours), plein (intérieur rempli sans contour) ou plein avec contour (on dessine l'intérieur et les contours). Aussi, vous pouvez modifier l'épaisseur des contours via la barre latérale secondaire. Il est possible d'utiliser la touche 3 de votre clavier afin de basculer directement sur l'outil polygone.",
        gifPath: 'assets/user_guide/polygone.gif',
        screenshotPath: 'assets/user_guide/polygone.PNG',
    },
    {
        title: 'Outils - Plume',
        isTool: 'Dessiner',
        description:
            "Cet outil est aussi similaire au crayon. Cependant, la forme de sa pointe doit être une mince ligne plutôt que d’être ronde.. Vous pouvez configurer les attributs suivants : la longueur de la ligne en pixels et l'angle d’orientation de la ligne en degrés. Il vous est aussi possible de changer l’angle de la ligne à l’aide de la roulette de votre souris. À chaque cran de roulette, une rotation de 15 degrés est effectuée. Si vous maintenez la touche Alt de votre clavier pendant cette action, la rotation sera de 1 degré.",
        gifPath: 'assets/user_guide/plume.gif',
        screenshotPath: '',
    },

    // Selection
    {
        title: 'Outils de sélection',
        isTool: 'Dessiner',
        description:
            'Les trois outils vous permettent de sélectionner une partie de la surface de dessin que vous pouvez ensuite déplacer, redimensionner ou faire pivoter. Votre sélection sera toujours accompagnée de deux types d’indicateurs visuels : un contour de sélection et une boite englobante. Le contour de votre sélection représente la frontière d’un groupe de pixels sélectionnés et sera illustré par une ligne pointillée. Aussi, des manipulations peuvent faire en sorte que la sélection se retrouve, en partie ou en tout, en dehors de la surface de dessin. Il vous est possible de sélectionner la zone que vous souhaitez selon un rectangle ou une ellipse. Si vous maintenez la touche Shift de votre clavier, la sélection devriendra un carré ou un cercle respectivement.',
        gifPath: 'assets/user_guide/selection.gif',
        screenshotPath: '',
    },
    {
        title: 'Manipulation de sélection',
        isTool: 'Dessiner',
        description:
            "Des manipulations peuvent faire en sorte que la sélection se retrouve, en partie ou en tout, en dehors de la surface de dessin. Il vous est possible de déplacer une sélection en utilisant votre souris ou les touches directionnelles de votre clavier. Les fonctions couper,copier et coller sont disponibles ainsi que l'option supprimer.",
        gifPath: 'assets/user_guide/move-selection.gif',
        screenshotPath: '',
    },
    {
        title: "Rotation d'une sélection",
        isTool: 'Dessiner',
        description:
            'Pour faire pivoter une sélection, il vous suffit d’utiliser votre roulette de souris. De plus, une sélection pivote autour de son centre. À chaque cran de roulette, une rotation de 15 degrées est effectuée. Toutefois, si vous maitenez la touche ALT enfoncée, la rotation sera de 1 degré.',
        gifPath: '',
        screenshotPath: '',
    },
    {
        title: "Redimensionnement d'une sélection",
        isTool: 'Dessiner',
        description:
            "En tant qu'utilisateur, vous pouvez redimensionner une sélection à l'aide des 8 points de contrôle. Si vous maintenez la touche Shift appuyée pendant le déplacement d’un point de contrôle de coin, celui-ci ne pourra se déplacer que sur la droite passant par lui-même et son coin opposé : le redimensionnement n’altèrera pas le rapport d’aspect de la sélection. Il vous est possible de produire un effet mirroir en déplaçant le point de contrôle de l'autre côté de son opposé.",
        gifPath: '',
        screenshotPath: '',
    },
    {
        title: 'Sélection par baguette magique',
        isTool: 'Dessiner',
        description:
            'La baguette magique offre les mêmes modes d’opération que l’outil sceau de peinture : pour le mode pixels contigus (clic gauche de votre souris), une sélection sera formée avec la région de pixels. Celle-ci sera délimitée par un contour de sélection qui sera lui-même encadré par une boite englobante. Dans le cas du mode pixels non contigus (clic droit de votre souris), la sélection sera formée d’un ou plusieurs groupes de pixels disjoints.',
        gifPath: '',
        screenshotPath: '',
    },

    {
        title: 'Palette de couleur',
        isTool: 'Dessiner',
        description:
            "La palette de couleur est un attribut partagé par tous les outils. Dans la barre latérale secondaire, vous pouvez voir que le panneau d’attributs contient deux couleurs configurables : couleurs principale et secondaire Le panneau possède un bouton permettant d’intervertir ces deux couleurs. Il vous est aussi possible de modifier l'opacité. Une couleur parfaitement opaque masquera la couleur originale. À l’opposé, une opacité nulle équivaut à l’absence de pigments. Vous pouvez sélectionner la couleur principale ou secondaire à partir d'une palette de couleurs. Une fois la couleur choisie et confirmée, la palette sera de nouveau masquée. L'outil palette de couleur vous offre aussi la possibilité d’y entrer les valeurs de rouge, vert et bleu manuellement (en hexadécimale) dans des champs texte prévus à cet effet.",
        gifPath: 'assets/user_guide/color.gif',
        screenshotPath: 'assets/user_guide/color.gif',
    },
    {
        title: 'Outils - Sceau de peinture',
        isTool: 'Dessiner',
        description:
            "Cet outil permet d’effectuer un « remplissage » qui colore une ou plusieurs étendues de pixels en fonction de leur couleur. L’outil peut s’utiliser selon deux modes d’opérations : « pixels contigus » (clic gauche) et « pixels non contigus » (clic droit). Il est possible de sélectionner l'outil Sceau de Peinture avec la touche B.",
        gifPath: 'assets/user_guide/paint-bucket.gif',
        screenshotPath: '',
    },
    {
        title: 'Outils - Pipette',
        isTool: 'Dessiner',
        description:
            "Cet outil est utilisé pour saisir la couleur sous le pointeur de votre souris. Un clic avec votre bouton gauche assigne la couleur saisie à la couleur principale. Un clic avec votre bouton droit l’assigne à la couleur secondaire. Un cercle de prévisualisation (comme une loupe), représentant la surdimension des pixels sous le pointeur et ceux qui l'entourent, sera disponible de la barre latérale secondaire.",
        gifPath: 'assets/user_guide/pipette.gif',
        screenshotPath: '',
    },
    {
        title: 'Annuler-refaire',
        isTool: 'Dessiner',
        description:
            "En activant la fonction annuler à répétition, vous pouvez « reculer » dans l’état de votre dessin, et ce jusqu’à en revenir à l’état de départ. Pour ce faire, vous pouvez utiliser le raccourci clavier Crtl + Z. À l'inverse, il vous sera possible de refaire chaque action annulée en suivant l’ordre inverse. Pour ce faire, vous pouvez utiliser le raccourci clavier Crtl + Maj + Z.",
        gifPath: 'assets/user_guide/undo-redo.gif',
        screenshotPath: '',
    },
    {
        title: 'Grille',
        isTool: 'Dessiner',
        description:
            'L’application vous permez d’afficher une grille superposée à la surface de dessin et de son contenu. Son point d’origine est le coin supérieur gauche de la surface. Il vous est possible d’activer ou de désactiver la grille, de lui assigner une valeur d’opacité et finalement de lui indiquer la taille (en pixels) des carrés la composant.',
        gifPath: '',
        screenshotPath: 'assets/user_guide/grille.PNG',
    },
    {
        title: 'Magnétisme',
        isTool: 'Dessiner',
        description:
            "Lorsque vous choisissez d'activer cette option , chaque fois qu’une boite englobante est déplacée à l’aide de la souris celle-ci se « collera » ou s’alignera sur la ligne de grille la plus près. Vous pouvez choisir le point utilisé pour l'alignement sur la grille parmi les 9 points suivants : un des quatre points de contrôle, un des quatre coins de la boîte englobante ou le centre de la boîte. Cette option peut être activée / désactivée avec la touche M.",
        gifPath: 'assets/user_guide/magnetisme.gif',
        screenshotPath: '',
    },
    {
        title: 'Étampe',
        isTool: 'Dessiner',
        description:
            "Cet outil vous permet d’apposer de petites images sur votre dessin. Pour l’utiliser, il vous suffit d'effectuer un simple clic du bouton gauche à l’endroit où vous désirez apposer l’image. Le clic doit être fait sur la surface de dessin. Il est possible d'apposer une image partiellement. La barre latérale secondaire vous permet de configurer le facteur de mise à échelle de l’étampe, l'angle d’orientation de l’étampe (en degrés) et le choix d’image.",
        gifPath: 'assets/user_guide/etampe.gif',
        screenshotPath: '',
    },
    {
        title: 'Texte',
        isTool: 'Dessiner',
        description:
            "Cet outil vous permet d’écrire des chaines de caractères sur la surface de dessin. Pendant l’édition du texte, il vous est possible de vous déplacer dans le texte avec les touches directionnelles (flèches) du clavier ainsi que de supprimer avec la touche de retour arrière (Backspace) ou la touche de suppression (Delete). Pour terminer la création de votre texte, il vous suffit de cliquer à l’extérieur la zone de création ou de sélectionner un autre outil. Attention, toute partie de votre texte se trouvant en dehors de la surface de dessin sera perdue. Le panneau d’attributs vous permet de modifier votre texte avec les configurations suivantes : police du texte, taille de la police, texte en gras et/ou italique et alignement du texte : gauche, centre, droit. La touche T vous permet de sélectionner l'outil texte. ",
        gifPath: 'assets/user_guide/texte.gif',
        screenshotPath: '',
    },
    {
        title: 'Aérosol',
        isTool: 'Dessiner',
        description:
            'Cet outil simule un effet de peinture en aérosol : un jet de peinture est vaporisé sous le pointeur de la souris lorsque le bouton est enfoncé. La barre latérale secondaire vous permet de modifier les attributs suivants : le nombre d’émissions par seconde, le diamètre du jet en pixels et le diamètre des gouttelettes composant le jet',
        gifPath: 'assets/user_guide/aerosol.gif',
        screenshotPath: '',
    },

    // keyboard shortcuts
    {
        title: 'Aide - Raccourcis clavier',
        isTool: 'Raccourcis clavier',
        description:
            'Voici un tableau récapitulatif de tous les raccourcis clavier présents sur notre application PolyDessin. Les raccourcis clavier seront utilisables au fur et à mesure que les outils et/ou fonctionnalités seront ajoutés.',
        gifPath: '',
        screenshotPath: 'assets/user_guide/shortcut_keyboard.png',
    },
];
