class Terminal {
    constructor(container) {
        this.container = container;
        this.history = [];
        this.historyIndex = -1;
        this.currentPath = '/';
        this.commands = {
            help: () => this.printHelp(),
            clear: () => this.clear(),
            echo: (args) => this.echo(args),
            ls: () => this.ls(),
            cd: (args) => this.cd(args),
            pwd: () => this.pwd(),
            about: () => this.about(),
            contact: () => this.contact()
        };
        this.init();
    }

    init() {
        // Create input line
        this.inputLine = document.createElement('div');
        this.inputLine.className = 'terminal-input-line';
        this.inputLine.innerHTML = `
            <span class="prompt">$</span>
            <input type="text" class="terminal-input" autofocus>
        `;
        this.container.appendChild(this.inputLine);
        
        this.input = this.inputLine.querySelector('input');
        this.setupEventListeners();
        
        // Print welcome message
        this.print(`
Welcome to Void-Strike's Terminal
Type 'help' for available commands
        `);
    }

    setupEventListeners() {
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.executeCommand(this.input.value);
                this.input.value = '';
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigateHistory('up');
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.navigateHistory('down');
            }
        });

        // Focus input when clicking anywhere in the terminal
        this.container.addEventListener('click', () => {
            this.input.focus();
        });
    }

    executeCommand(cmd) {
        if (!cmd.trim()) return;
        
        // Add to history
        this.history.push(cmd);
        this.historyIndex = this.history.length;
        
        // Display command
        this.print(`<span class="prompt">$</span> ${cmd}`);
        
        // Parse and execute command
        const [command, ...args] = cmd.split(' ');
        const commandFn = this.commands[command.toLowerCase()];
        
        if (commandFn) {
            commandFn(args);
        } else {
            this.print(`Command not found: ${command}. Type 'help' for available commands.`);
        }
    }

    print(text) {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = text;
        this.container.insertBefore(line, this.inputLine);
    }

    navigateHistory(direction) {
        if (this.history.length === 0) return;
        
        if (direction === 'up') {
            if (this.historyIndex > 0) {
                this.historyIndex--;
            }
        } else {
            if (this.historyIndex < this.history.length - 1) {
                this.historyIndex++;
            } else {
                this.historyIndex = this.history.length;
                this.input.value = '';
                return;
            }
        }
        
        this.input.value = this.history[this.historyIndex];
        this.input.selectionStart = this.input.selectionEnd = this.input.value.length;
    }

    printHelp() {
        this.print(`
Available commands:
  help     - Show this help message
  clear    - Clear the terminal
  echo     - Print text to the terminal
  ls       - List contents of current directory
  cd       - Change directory
  pwd      - Print current working directory
  about    - Show information about me
  contact  - Show contact information
        `);
    }

    clear() {
        const lines = this.container.querySelectorAll('.terminal-line');
        lines.forEach(line => line.remove());
    }

    echo(args) {
        this.print(args.join(' '));
    }

    pwd() {
        this.print(this.currentPath);
    }

    cd(args) {
        if (!args.length) {
            this.currentPath = '/';
            return;
        }

        const target = args[0];
        
        if (target === '..') {
            if (this.currentPath === '/') return;
            this.currentPath = this.currentPath.split('/').slice(0, -1).join('/') || '/';
            return;
        }

        if (target === '/') {
            this.currentPath = '/';
            return;
        }

        // Handle navigation to /notes
        if (this.currentPath === '/' && target === 'notes') {
            this.currentPath = '/notes';
            return;
        }

        // Handle navigation within /notes
        if (this.currentPath === '/notes') {
            // Check if the target is a valid category
            const categories = this.getPostCategories();
            if (categories.includes(target)) {
                this.currentPath = `/notes/${target}`;
                return;
            }
        }

        this.print(`cd: no such directory: ${target}`);
    }

    ls() {
        if (this.currentPath === '/') {
            this.print(`
Directory listing:
  notes/     - Security notes and writeups
  projects/  - My projects
  about/     - About me
            `);
            return;
        }

        if (this.currentPath === '/notes') {
            const categories = this.getPostCategories();
            const listing = categories.map(cat => `  ${cat}/`).join('\n');
            this.print(`
Directory listing:
${listing}
            `);
            return;
        }

        if (this.currentPath.startsWith('/notes/')) {
            const category = this.currentPath.split('/').pop();
            const posts = this.getPostsByCategory(category);
            const listing = posts.map(post => `  ${post.title}`).join('\n');
            this.print(`
Directory listing:
${listing}
            `);
            return;
        }

        this.print('ls: directory not found');
    }

    getPostCategories() {
        // This would typically fetch from your actual posts data
        // For now, returning a static list
        return [
            'web-security',
            'network-security',
            'malware-analysis',
            'ctf-writeups'
        ];
    }

    getPostsByCategory(category) {
        // This would typically fetch from your actual posts data
        // For now, returning static data
        const posts = {
            'web-security': [
                { title: 'XSS-Attacks.md', date: '2024-03-20' },
                { title: 'SQL-Injection.md', date: '2024-03-15' }
            ],
            'network-security': [
                { title: 'Network-Scanning.md', date: '2024-03-18' },
                { title: 'Firewall-Config.md', date: '2024-03-10' }
            ],
            'malware-analysis': [
                { title: 'Ransomware-Analysis.md', date: '2024-03-12' },
                { title: 'Trojan-Investigation.md', date: '2024-03-05' }
            ],
            'ctf-writeups': [
                { title: 'HackTheBox-Writeup.md', date: '2024-03-19' },
                { title: 'TryHackMe-Walkthrough.md', date: '2024-03-14' }
            ]
        };
        return posts[category] || [];
    }

    about() {
        this.print(`
About Void-Strike:
  I am a cybersecurity enthusiast and researcher.
  My focus areas include:
  - Web Security
  - Network Security
  - Malware Analysis
  - CTF Challenges
        `);
    }

    contact() {
        this.print(`
Contact Information:
  GitHub   - github.com/v0id-strike
  Telegram - t.me/v0id_strike
        `);
    }
}

// Initialize terminal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const terminals = document.querySelectorAll('.terminal-container');
    terminals.forEach(terminal => new Terminal(terminal));
}); 