class Terminal {
    constructor(container) {
        this.container = container;
        this.history = [];
        this.historyIndex = -1;
        this.currentPath = '~';
        this.commands = {
            help: () => this.printHelp(),
            clear: () => this.clear(),
            echo: (args) => this.echo(args),
            ls: () => this.ls(),
            cd: (args) => this.cd(args),
            pwd: () => this.pwd(),
            cat: (args) => this.cat(args),
            about: () => this.about(),
            contact: () => this.contact(),
            skills: () => this.skills(),
            projects: () => this.projects(),
            notes: () => this.notes(),
            theme: (args) => this.theme(args),
            date: () => this.date(),
            whoami: () => this.whoami(),
            exit: () => this.exit()
        };
        this.init();
    }

    init() {
        // Create input line
        this.inputLine = document.createElement('div');
        this.inputLine.className = 'terminal-input-line';
        this.inputLine.innerHTML = `
            <span class="prompt">void-strike@terminal:${this.currentPath}$</span>
            <input type="text" class="terminal-input" autofocus>
        `;
        this.container.appendChild(this.inputLine);
        
        this.input = this.inputLine.querySelector('input');
        this.setupEventListeners();
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
        this.print(`<span class="prompt">void-strike@terminal:${this.currentPath}$</span> ${cmd}`);
        
        // Parse and execute command
        const [command, ...args] = cmd.split(' ');
        const commandFn = this.commands[command.toLowerCase()];
        
        if (commandFn) {
            commandFn(args);
        } else {
            this.print(`Command not found: ${command}. Type 'help' for available commands.`, 'error');
        }
    }

    print(text, type = '') {
        const line = document.createElement('div');
        line.className = `terminal-line ${type}`;
        line.innerHTML = text;
        this.container.insertBefore(line, this.inputLine);
        this.container.scrollTop = this.container.scrollHeight;
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
  ls       - List available sections
  cd       - Change directory/section
  pwd      - Show current directory
  cat      - Display content of a file
  about    - Show information about me
  contact  - Show contact information
  skills   - List my technical skills
  projects - Show my projects
  notes    - Access security notes
  theme    - Change terminal theme
  date     - Show current date and time
  whoami   - Show current user info
  exit     - Exit the terminal
        `);
    }

    clear() {
        const lines = this.container.querySelectorAll('.terminal-line');
        lines.forEach(line => line.remove());
    }

    echo(args) {
        this.print(args.join(' '));
    }

    ls() {
        const sections = {
            '~': ['about', 'projects', 'notes', 'skills'],
            '/about': ['bio.txt', 'experience.txt'],
            '/projects': ['web-security', 'malware-analysis', 'ctf-writeups'],
            '/notes': ['web-pentest', 'network-security', 'malware-analysis']
        };

        const currentSection = sections[this.currentPath] || [];
        this.print(currentSection.join('  '));
    }

    cd(args) {
        const path = args[0];
        if (!path) {
            this.currentPath = '~';
            this.updatePrompt();
            return;
        }

        const validPaths = ['~', '/about', '/projects', '/notes'];
        if (validPaths.includes(path)) {
            this.currentPath = path;
            this.updatePrompt();
        } else {
            this.print(`cd: no such directory: ${path}`, 'error');
        }
    }

    pwd() {
        this.print(this.currentPath);
    }

    cat(args) {
        const file = args[0];
        if (!file) {
            this.print('cat: missing file operand', 'error');
            return;
        }

        const files = {
            'bio.txt': `
Name: Void-Strike
Role: Cybersecurity Researcher
Experience: 5+ years in security research
Focus: Web Security, Malware Analysis, CTF
            `,
            'experience.txt': `
- Senior Security Researcher
- CTF Player and Organizer
- Bug Bounty Hunter
- Security Tool Developer
            `
        };

        if (files[file]) {
            this.print(files[file]);
        } else {
            this.print(`cat: ${file}: No such file`, 'error');
        }
    }

    about() {
        this.print(`
About Void-Strike:
  I am a cybersecurity enthusiast and researcher with a passion for
  discovering vulnerabilities and developing security tools.

  My focus areas include:
  - Web Security & Penetration Testing
  - Network Security & Analysis
  - Malware Analysis & Reverse Engineering
  - CTF Challenges & Security Research

  Type 'skills' to see my technical expertise
  Type 'projects' to view my work
  Type 'notes' to access security writeups
        `);
    }

    contact() {
        this.print(`
Contact Information:
  GitHub   - github.com/v0id-strike
  Telegram - t.me/v0id_strike
  Email    - [redacted]
        `);
    }

    skills() {
        this.print(`
Technical Skills:
  Languages:
    - Python, JavaScript, C/C++, Assembly
    - HTML/CSS, SQL, Shell Scripting

  Security Tools:
    - Burp Suite, Wireshark, IDA Pro
    - Metasploit, Nmap, Ghidra
    - Custom Exploitation Tools

  Areas of Expertise:
    - Web Application Security
    - Network Protocol Analysis
    - Malware Analysis
    - Reverse Engineering
    - Exploit Development
        `);
    }

    projects() {
        this.print(`
Current Projects:
  1. Web Security Scanner
     - Automated vulnerability detection
     - Custom rule engine
     - Report generation

  2. Malware Analysis Framework
     - Dynamic analysis
     - Behavior monitoring
     - IOC extraction

  3. CTF Platform
     - Challenge development
     - Infrastructure management
     - Score tracking
        `);
    }

    notes() {
        this.print(`
Security Notes:
  Available Categories:
  1. Web Pentest
     - OWASP Top 10
     - Custom exploits
     - Bypass techniques

  2. Network Security
     - Protocol analysis
     - Traffic inspection
     - Attack vectors

  3. Malware Analysis
     - Static analysis
     - Dynamic analysis
     - Reverse engineering
        `);
    }

    theme(args) {
        const theme = args[0];
        if (!theme) {
            this.print('Available themes: dark, light, matrix, neon', 'error');
            return;
        }

        // Theme switching logic would go here
        this.print(`Theme changed to: ${theme}`, 'success');
    }

    date() {
        const now = new Date();
        this.print(now.toLocaleString());
    }

    whoami() {
        this.print(`
User: void-strike
Role: Security Researcher
Location: [redacted]
Status: Active
        `);
    }

    exit() {
        this.print('Goodbye!', 'success');
        setTimeout(() => {
            window.close();
        }, 1000);
    }

    updatePrompt() {
        const prompt = this.inputLine.querySelector('.prompt');
        prompt.textContent = `void-strike@terminal:${this.currentPath}$`;
    }
}

// Initialize terminal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const terminals = document.querySelectorAll('.terminal-container');
    terminals.forEach(terminal => new Terminal(terminal));
}); 