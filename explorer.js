// Éléments DOM
const fileList = document.getElementById('fileList');
const themeToggle = document.getElementById('themeToggle');

// Variables d'état
let fileSystem = {};

// Charger les données depuis le fichier JSON
async function loadFileSystem() {
    try {
        const response = await fetch('data.json');
        fileSystem = await response.json();
        renderFileSystem(fileSystem, fileList);
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        fileList.innerHTML = '<li>Impossible de charger les fichiers</li>';
    }
}

// Obtenir l'icône selon le type de fichier
function getIcon(type) {
    const icons = {
        'folder': '📁',
        'pdf': '📕',
        'txt': '📄',
        'md': '📄',
        'jpg': '🖼️',
        'png': '🖼️',
        'mp3': '🎵',
        'mp4': '🎬',
        'ppt': '📊',
        'doc': '📝',
        'docx': '📝',
        'xls': '📊',
        'xlsx': '📊',
        'zip': '📦',
        'html': '🌐',
        'css': '🎨',
        'js': '📜',
        'default': '📄'
    };
    return icons[type] || icons['default'];
}

// Rendu récursif de l'arborescence
function renderFileSystem(node, parentElement) {
    if (node.type === 'folder') {
        const li = document.createElement('li');
        li.className = 'file-item folder';
        li.dataset.name = node.name;
        li.dataset.type = 'folder';
        
        li.innerHTML = `
            <span class="file-icon folder-icon">${getIcon('folder')}</span>
            <span class="file-name">${node.name}</span>
        `;
        
        parentElement.appendChild(li);
        
        const childrenContainer = document.createElement('ul');
        childrenContainer.className = 'folder-children';
        parentElement.appendChild(childrenContainer);
        
        // Ouvrir/fermer le dossier
        li.addEventListener('click', (e) => {
            li.classList.toggle('folder-open');
            if (li.classList.contains('folder-open') && node.children) {
                childrenContainer.innerHTML = '';
                node.children.forEach(child => {
                    renderFileSystem(child, childrenContainer);
                });
            }
        });
        
        // Si le dossier est ouvert, afficher ses enfants
        if (li.classList.contains('folder-open') && node.children) {
            node.children.forEach(child => {
                renderFileSystem(child, childrenContainer);
            });
        }
    } else {
        // C'est un fichier
        const li = document.createElement('li');
        li.className = 'file-item';
        li.dataset.name = node.name;
        li.dataset.type = node.type;
        
        const link = document.createElement('a');
        link.href = node.url || '#';
        link.target = node.url ? '_blank' : '_self';
        link.className = 'file-link';
        
        link.innerHTML = `
            <span class="file-icon">${getIcon(node.type)}</span>
            <span class="file-name">${node.name}</span>
        `;
        
        li.appendChild(link);
        parentElement.appendChild(li);
    }
}

// Initialisation
function init() {
    loadFileSystem();
    
    // Écouteurs d'événements
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        themeToggle.textContent = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
    });
}

// Démarrer l'application
init();