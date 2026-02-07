/**
 * @fileoverview Preset database for coding and development applications.
 * Contains metadata (icon, description, genre) for popular dev tools.
 * @module renderer/features/library/data/codingAppsPresets
 */

/** Preset data for a coding application. */
export interface CodingAppPreset {
  /** Display name of the application. */
  name: string
  /** Short description of the application. */
  description: string
  /** Category/genre of the application. */
  genre: string
  /** URL to the icon/logo image. */
  icon: string
  /** Keywords for search matching. */
  keywords: string[]
}

/** Database of popular coding and development applications. */
export const CODING_APPS_PRESETS: CodingAppPreset[] = [
  // Code Editors
  {
    name: 'Visual Studio Code',
    description:
      'Lightweight but powerful source code editor by Microsoft with built-in Git support, debugging, and extensions marketplace.',
    genre: 'Code Editor',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Visual_Studio_Code_1.35_icon.svg/512px-Visual_Studio_Code_1.35_icon.svg.png',
    keywords: ['vscode', 'vs code', 'visual studio code', 'code', 'microsoft']
  },
  {
    name: 'Cursor',
    description:
      'AI-powered code editor built for pair programming with intelligent code completion and chat-based assistance.',
    genre: 'Code Editor',
    icon: 'https://www.cursor.com/brand/icon.svg',
    keywords: ['cursor', 'ai editor', 'ai code']
  },
  {
    name: 'Sublime Text',
    description:
      'Sophisticated text editor for code, markup and prose with a sleek interface and powerful features.',
    genre: 'Code Editor',
    icon: 'https://upload.wikimedia.org/wikipedia/en/d/d2/Sublime_Text_3_logo.png',
    keywords: ['sublime', 'sublime text', 'subl']
  },
  {
    name: 'Notepad++',
    description:
      'Free source code editor with syntax highlighting supporting multiple programming languages.',
    genre: 'Code Editor',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Notepad%2B%2B_Logo.svg/512px-Notepad%2B%2B_Logo.svg.png',
    keywords: ['notepad++', 'notepad plus plus', 'npp']
  },
  {
    name: 'Atom',
    description: 'A hackable text editor for the 21st Century built by GitHub.',
    genre: 'Code Editor',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Atom_editor_logo.svg/512px-Atom_editor_logo.svg.png',
    keywords: ['atom', 'github atom']
  },
  {
    name: 'Vim',
    description:
      'Highly configurable text editor built to make creating and changing any kind of text very efficient.',
    genre: 'Code Editor',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Vimlogo.svg/512px-Vimlogo.svg.png',
    keywords: ['vim', 'vi', 'neovim', 'nvim']
  },

  // IDEs
  {
    name: 'Visual Studio 2022',
    description: 'Full-featured IDE for .NET, C++, and cloud development on Windows.',
    genre: 'IDE',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Visual_Studio_Icon_2022.svg/512px-Visual_Studio_Icon_2022.svg.png',
    keywords: ['visual studio', 'vs2022', 'vs 2022', 'dotnet', '.net']
  },
  {
    name: 'IntelliJ IDEA',
    description:
      'Powerful IDE for Java and Kotlin development by JetBrains with smart code assistance.',
    genre: 'IDE',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/IntelliJ_IDEA_Icon.svg/512px-IntelliJ_IDEA_Icon.svg.png',
    keywords: ['intellij', 'idea', 'jetbrains', 'java', 'kotlin']
  },
  {
    name: 'PyCharm',
    description:
      'Professional Python IDE by JetBrains with intelligent code completion and debugging.',
    genre: 'IDE',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/PyCharm_Icon.svg/512px-PyCharm_Icon.svg.png',
    keywords: ['pycharm', 'python', 'jetbrains']
  },
  {
    name: 'WebStorm',
    description: 'Powerful JavaScript and TypeScript IDE by JetBrains for modern web development.',
    genre: 'IDE',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/WebStorm_Icon.svg/512px-WebStorm_Icon.svg.png',
    keywords: ['webstorm', 'javascript', 'typescript', 'jetbrains', 'js', 'ts']
  },
  {
    name: 'Android Studio',
    description: 'Official IDE for Android app development with emulator and design tools.',
    genre: 'IDE',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Android_Studio_icon_%282023%29.svg/512px-Android_Studio_icon_%282023%29.svg.png',
    keywords: ['android studio', 'android', 'mobile', 'kotlin', 'java']
  },
  {
    name: 'Xcode',
    description: 'Apple integrated development environment for macOS, iOS, watchOS, and tvOS.',
    genre: 'IDE',
    icon: 'https://upload.wikimedia.org/wikipedia/en/5/56/Xcode_14_icon.png',
    keywords: ['xcode', 'apple', 'ios', 'macos', 'swift']
  },
  {
    name: 'CLion',
    description: 'Cross-platform C and C++ IDE by JetBrains with smart coding assistance.',
    genre: 'IDE',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Clion.svg/512px-Clion.svg.png',
    keywords: ['clion', 'c++', 'cpp', 'c', 'jetbrains']
  },
  {
    name: 'GoLand',
    description: 'Cross-platform Go IDE by JetBrains with intelligent code completion.',
    genre: 'IDE',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/GoLand_icon.svg/512px-GoLand_icon.svg.png',
    keywords: ['goland', 'go', 'golang', 'jetbrains']
  },
  {
    name: 'Rider',
    description: 'Cross-platform .NET IDE by JetBrains for Unity, ASP.NET and more.',
    genre: 'IDE',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/JetBrains_Rider_Icon.svg/512px-JetBrains_Rider_Icon.svg.png',
    keywords: ['rider', '.net', 'dotnet', 'unity', 'c#', 'csharp', 'jetbrains']
  },
  {
    name: 'Eclipse',
    description: 'Open-source IDE primarily for Java development with plugin ecosystem.',
    genre: 'IDE',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Eclipse-Luna-Logo.svg/512px-Eclipse-Luna-Logo.svg.png',
    keywords: ['eclipse', 'java', 'enterprise']
  },
  {
    name: 'NetBeans',
    description: 'Open-source IDE for Java, PHP, and HTML5 development.',
    genre: 'IDE',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Apache_NetBeans_Logo.svg/512px-Apache_NetBeans_Logo.svg.png',
    keywords: ['netbeans', 'java', 'php', 'apache']
  },

  // Terminals
  {
    name: 'Windows Terminal',
    description: 'Modern terminal application for Windows with tabs, themes, and GPU acceleration.',
    genre: 'Terminal',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Windows_Terminal_Logo_256x256.png/512px-Windows_Terminal_Logo_256x256.png',
    keywords: ['windows terminal', 'terminal', 'wt', 'microsoft']
  },
  {
    name: 'Git Bash',
    description: 'Git command line interface for Windows with Unix-like shell experience.',
    genre: 'Terminal',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Git_icon.svg/512px-Git_icon.svg.png',
    keywords: ['git bash', 'git', 'bash', 'mingw']
  },
  {
    name: 'Hyper',
    description: 'Beautiful and extensible terminal built on web technologies.',
    genre: 'Terminal',
    icon: 'https://hyper.is/static/hyper-logo.png',
    keywords: ['hyper', 'terminal', 'electron']
  },
  {
    name: 'iTerm2',
    description: 'Terminal emulator for macOS with advanced features and customization.',
    genre: 'Terminal',
    icon: 'https://iterm2.com/img/logo2x.jpg',
    keywords: ['iterm', 'iterm2', 'macos', 'terminal']
  },
  {
    name: 'Tabby',
    description: 'Modern terminal emulator with SSH, serial port, and Telnet support.',
    genre: 'Terminal',
    icon: 'https://raw.githubusercontent.com/Eugeny/tabby/master/src/assets/icons/png/512x512.png',
    keywords: ['tabby', 'terminal', 'ssh']
  },
  {
    name: 'PowerShell',
    description: 'Cross-platform task automation and configuration management framework.',
    genre: 'Terminal',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/PowerShell_5.0_icon.png/512px-PowerShell_5.0_icon.png',
    keywords: ['powershell', 'pwsh', 'ps', 'microsoft']
  },

  // DevOps & Containers
  {
    name: 'Docker Desktop',
    description:
      'Container platform for building, sharing, and running containerized applications.',
    genre: 'DevOps',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Docker_%28container_engine%29_logo.svg/512px-Docker_%28container_engine%29_logo.svg.png',
    keywords: ['docker', 'container', 'devops', 'virtualization']
  },
  {
    name: 'Podman Desktop',
    description: 'Open-source container management tool as an alternative to Docker.',
    genre: 'DevOps',
    icon: 'https://raw.githubusercontent.com/containers/podman-desktop/main/website/static/img/icon.png',
    keywords: ['podman', 'container', 'devops']
  },
  {
    name: 'Kubernetes (kubectl)',
    description: 'Command-line tool for controlling Kubernetes clusters.',
    genre: 'DevOps',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Kubernetes_logo_without_workmark.svg/512px-Kubernetes_logo_without_workmark.svg.png',
    keywords: ['kubernetes', 'kubectl', 'k8s', 'container', 'orchestration']
  },

  // API & Testing Tools
  {
    name: 'Postman',
    description: 'API platform for building, testing, and documenting APIs.',
    genre: 'API Tool',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Postman_%28software%29.png',
    keywords: ['postman', 'api', 'rest', 'testing']
  },
  {
    name: 'Insomnia',
    description: 'Open-source API client for REST, GraphQL, and gRPC.',
    genre: 'API Tool',
    icon: 'https://insomnia.rest/images/insomnia-logo.svg',
    keywords: ['insomnia', 'api', 'rest', 'graphql']
  },
  {
    name: 'Bruno',
    description: 'Fast, Git-friendly, offline-only API client.',
    genre: 'API Tool',
    icon: 'https://www.usebruno.com/images/landing-2.png',
    keywords: ['bruno', 'api', 'rest', 'offline']
  },

  // Version Control
  {
    name: 'GitHub Desktop',
    description: 'Official GitHub GUI client for managing repositories easily.',
    genre: 'Version Control',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Github-desktop-logo-symbol.svg/512px-Github-desktop-logo-symbol.svg.png',
    keywords: ['github desktop', 'github', 'git', 'gui']
  },
  {
    name: 'GitKraken',
    description: 'Cross-platform Git GUI client with visual merge tools and integrations.',
    genre: 'Version Control',
    icon: 'https://www.gitkraken.com/wp-content/uploads/2021/03/gitkraken-keif-teal-sq.png',
    keywords: ['gitkraken', 'git', 'gui', 'merge']
  },
  {
    name: 'Sourcetree',
    description: 'Free Git GUI client by Atlassian for Windows and Mac.',
    genre: 'Version Control',
    icon: 'https://wac-cdn.atlassian.com/assets/img/favicons/sourcetree/apple-touch-icon.png',
    keywords: ['sourcetree', 'git', 'atlassian', 'gui']
  },
  {
    name: 'Fork',
    description: 'Fast and friendly Git client for Mac and Windows.',
    genre: 'Version Control',
    icon: 'https://git-fork.com/images/logo.png',
    keywords: ['fork', 'git', 'gui', 'client']
  },
  {
    name: 'Lazygit',
    description: 'Simple terminal UI for Git commands.',
    genre: 'Version Control',
    icon: 'https://raw.githubusercontent.com/jesseduffield/lazygit/master/docs/img/gopher.png',
    keywords: ['lazygit', 'git', 'terminal', 'tui']
  },

  // Database Tools
  {
    name: 'DBeaver',
    description: 'Universal database management tool supporting all popular databases.',
    genre: 'Database',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/DBeaver_logo.svg/512px-DBeaver_logo.svg.png',
    keywords: ['dbeaver', 'database', 'sql', 'mysql', 'postgres', 'mongodb']
  },
  {
    name: 'DataGrip',
    description: 'Database IDE by JetBrains with intelligent query console.',
    genre: 'Database',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/DataGrip.svg/512px-DataGrip.svg.png',
    keywords: ['datagrip', 'database', 'sql', 'jetbrains']
  },
  {
    name: 'TablePlus',
    description: 'Modern, native database management tool with a clean UI.',
    genre: 'Database',
    icon: 'https://tableplus.com/resources/favicons/apple-touch-icon.png',
    keywords: ['tableplus', 'database', 'sql', 'native']
  },
  {
    name: 'MongoDB Compass',
    description: 'Official GUI for MongoDB with visual query builder.',
    genre: 'Database',
    icon: 'https://www.mongodb.com/assets/images/global/favicon.ico',
    keywords: ['mongodb compass', 'mongodb', 'nosql', 'database']
  },
  {
    name: 'Redis Insight',
    description: 'Official GUI for Redis database management and visualization.',
    genre: 'Database',
    icon: 'https://redis.io/wp-content/themes/flavor-flavor-flavor/images/ri-logo.svg',
    keywords: ['redis insight', 'redis', 'cache', 'database']
  },
  {
    name: 'pgAdmin',
    description: 'Open-source administration and development platform for PostgreSQL.',
    genre: 'Database',
    icon: 'https://www.pgadmin.org/static/docs/pgadmin4-dev/docs/en_US/_images/logo-right-128.png',
    keywords: ['pgadmin', 'postgresql', 'postgres', 'database']
  },
  {
    name: 'MySQL Workbench',
    description: 'Visual tool for MySQL database design, development, and administration.',
    genre: 'Database',
    icon: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/62/MySQL_Workbench_icon.png/512px-MySQL_Workbench_icon.png',
    keywords: ['mysql workbench', 'mysql', 'database']
  },

  // Design Tools
  {
    name: 'Figma',
    description: 'Collaborative design tool for UI/UX design and prototyping.',
    genre: 'Design',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Figma-logo.svg/512px-Figma-logo.svg.png',
    keywords: ['figma', 'design', 'ui', 'ux', 'prototype']
  },
  {
    name: 'Adobe XD',
    description: 'Vector-based design tool for UI/UX design and prototyping.',
    genre: 'Design',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Adobe_XD_CC_icon.svg/512px-Adobe_XD_CC_icon.svg.png',
    keywords: ['adobe xd', 'xd', 'design', 'ui', 'adobe']
  },
  {
    name: 'Sketch',
    description: 'Vector graphics editor for macOS focused on UI/UX design.',
    genre: 'Design',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Sketch_Logo.svg/512px-Sketch_Logo.svg.png',
    keywords: ['sketch', 'design', 'ui', 'macos', 'vector']
  },
  {
    name: 'Zeplin',
    description: 'Collaboration tool for designers and developers.',
    genre: 'Design',
    icon: 'https://zeplin.io/favicon.ico',
    keywords: ['zeplin', 'design', 'handoff', 'collaboration']
  },

  // Game Engines
  {
    name: 'Unity Hub',
    description: 'Management tool for Unity Editor installations and projects.',
    genre: 'Game Engine',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Unity_Technologies_logo.svg/512px-Unity_Technologies_logo.svg.png',
    keywords: ['unity', 'unity hub', 'game engine', 'game dev', '3d']
  },
  {
    name: 'Unreal Engine',
    description: 'Powerful game engine by Epic Games for AAA game development.',
    genre: 'Game Engine',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/UE_Logo_Black_Centered.svg/512px-UE_Logo_Black_Centered.svg.png',
    keywords: ['unreal', 'unreal engine', 'ue5', 'game engine', 'epic']
  },
  {
    name: 'Godot',
    description: 'Open-source game engine with an intuitive scene system.',
    genre: 'Game Engine',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Godot_icon.svg/512px-Godot_icon.svg.png',
    keywords: ['godot', 'game engine', 'open source', 'gdscript']
  },
  {
    name: 'Blender',
    description: 'Open-source 3D creation suite for modeling, animation, and rendering.',
    genre: '3D Modeling',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Blender_logo_no_text.svg/512px-Blender_logo_no_text.svg.png',
    keywords: ['blender', '3d', 'modeling', 'animation', 'render']
  },

  // Productivity & Notes
  {
    name: 'Obsidian',
    description: 'Knowledge base and note-taking app with Markdown and graph view.',
    genre: 'Productivity',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/2023_Obsidian_logo.svg/512px-2023_Obsidian_logo.svg.png',
    keywords: ['obsidian', 'notes', 'markdown', 'knowledge base', 'zettelkasten']
  },
  {
    name: 'Notion',
    description: 'All-in-one workspace for notes, docs, wikis, and project management.',
    genre: 'Productivity',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Notion-logo.svg/512px-Notion-logo.svg.png',
    keywords: ['notion', 'notes', 'wiki', 'project management', 'docs']
  },
  {
    name: 'Logseq',
    description: 'Open-source outliner for knowledge management and note-taking.',
    genre: 'Productivity',
    icon: 'https://logseq.com/logo.png',
    keywords: ['logseq', 'notes', 'outliner', 'knowledge', 'open source']
  },

  // Communication
  {
    name: 'Slack',
    description: 'Team communication and collaboration platform with channels.',
    genre: 'Communication',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/512px-Slack_icon_2019.svg.png',
    keywords: ['slack', 'chat', 'team', 'communication', 'channels']
  },
  {
    name: 'Discord',
    description: 'Voice, video, and text communication platform for communities.',
    genre: 'Communication',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Discord_Logo_without_Text.svg/512px-Discord_Logo_without_Text.svg.png',
    keywords: ['discord', 'chat', 'voice', 'community', 'gaming']
  },
  {
    name: 'Microsoft Teams',
    description: 'Business communication platform with chat, meetings, and file sharing.',
    genre: 'Communication',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Microsoft_Office_Teams_%282018%E2%80%93present%29.svg/512px-Microsoft_Office_Teams_%282018%E2%80%93present%29.svg.png',
    keywords: ['teams', 'microsoft teams', 'chat', 'meetings', 'microsoft']
  },
  {
    name: 'Zoom',
    description: 'Video conferencing platform for meetings and webinars.',
    genre: 'Communication',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Zoom_Communications_Logo.svg/512px-Zoom_Communications_Logo.svg.png',
    keywords: ['zoom', 'video', 'meetings', 'conference', 'webinar']
  },

  // Browsers (Developer Edition)
  {
    name: 'Firefox Developer Edition',
    description: 'Browser tailored for web developers with advanced DevTools.',
    genre: 'Browser',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Firefox_Developer_Edition_Logo_%282019%29.svg/512px-Firefox_Developer_Edition_Logo_%282019%29.svg.png',
    keywords: ['firefox', 'developer edition', 'browser', 'mozilla', 'devtools']
  },
  {
    name: 'Google Chrome',
    description: 'Fast and secure browser with powerful developer tools.',
    genre: 'Browser',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Google_Chrome_icon_%28February_2022%29.svg/512px-Google_Chrome_icon_%28February_2022%29.svg.png',
    keywords: ['chrome', 'google chrome', 'browser', 'devtools']
  },
  {
    name: 'Arc',
    description: 'Modern browser reimagined with spaces and split views.',
    genre: 'Browser',
    icon: 'https://arc.net/favicon.png',
    keywords: ['arc', 'browser', 'modern', 'spaces']
  },

  // Miscellaneous
  {
    name: 'Warp',
    description: 'Modern terminal with AI-powered command suggestions.',
    genre: 'Terminal',
    icon: 'https://www.warp.dev/favicon.ico',
    keywords: ['warp', 'terminal', 'ai', 'modern']
  },
  {
    name: 'Raycast',
    description: 'Productivity tool with extensions and quick actions.',
    genre: 'Productivity',
    icon: 'https://raycast.com/favicon.png',
    keywords: ['raycast', 'productivity', 'launcher', 'extensions']
  },
  {
    name: 'ngrok',
    description: 'Secure tunnels to localhost for testing and demos.',
    genre: 'DevOps',
    icon: 'https://ngrok.com/favicon.ico',
    keywords: ['ngrok', 'tunnel', 'localhost', 'testing', 'demo']
  },
  {
    name: 'FileZilla',
    description: 'Free FTP solution with support for SFTP and FTPS.',
    genre: 'DevOps',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/FileZilla_logo.svg/512px-FileZilla_logo.svg.png',
    keywords: ['filezilla', 'ftp', 'sftp', 'file transfer']
  }
]

/**
 * Searches for matching coding app presets by name or keywords.
 * @param query - Search query string
 * @returns Array of matching presets, sorted by relevance
 */
export function searchCodingAppPresets(query: string): CodingAppPreset[] {
  if (!query || query.length < 2) return []

  const normalizedQuery = query.toLowerCase().trim()

  return CODING_APPS_PRESETS.filter((app) => {
    // Check name match
    if (app.name.toLowerCase().includes(normalizedQuery)) return true

    // Check keywords match
    return app.keywords.some((kw) => kw.includes(normalizedQuery))
  }).sort((a, b) => {
    // Prioritize exact name matches
    const aExact = a.name.toLowerCase().startsWith(normalizedQuery)
    const bExact = b.name.toLowerCase().startsWith(normalizedQuery)
    if (aExact && !bExact) return -1
    if (!aExact && bExact) return 1
    return a.name.localeCompare(b.name)
  })
}

/**
 * Finds a preset by exact name match.
 * @param name - Exact application name
 * @returns Matching preset or undefined
 */
export function findCodingAppPreset(name: string): CodingAppPreset | undefined {
  return CODING_APPS_PRESETS.find((app) => app.name.toLowerCase() === name.toLowerCase())
}
