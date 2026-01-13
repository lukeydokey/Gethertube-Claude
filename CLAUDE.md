# CLAUDE.md - AI Assistant Development Guide

**Last Updated:** 2026-01-13
**Project:** Gethertube-Claude
**Repository Status:** Early Initialization Stage

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Current Repository State](#current-repository-state)
3. [Codebase Structure](#codebase-structure)
4. [Development Workflow](#development-workflow)
5. [Git Conventions](#git-conventions)
6. [Code Style & Conventions](#code-style--conventions)
7. [AI Assistant Guidelines](#ai-assistant-guidelines)
8. [Project Roadmap](#project-roadmap)

---

## 🎯 Project Overview

### Project Name
**Gethertube-Claude** - An integration project combining Gethertube functionality with Claude AI capabilities.

### Project Type
To be determined - This is a greenfield project awaiting initial implementation.

### Purpose
Based on the project name, this appears to be intended as:
- A YouTube-related application or tool ("Gethertube")
- Integration with Claude AI for enhanced functionality
- Specific use case to be defined during initial development

---

## 📊 Current Repository State

### Status: EARLY INITIALIZATION
This repository has just been created and contains minimal content.

### Existing Files
```
/home/user/Gethertube-Claude/
├── .git/                    # Git repository metadata
├── README.md                # Project title only
└── CLAUDE.md                # This file
```

### Git Configuration
- **Repository URL:** `http://local_proxy@127.0.0.1:65496/git/lukeydokey/Gethertube-Claude`
- **Owner:** lukeydokey
- **Author:** Lucas Song (pudingles@gmail.com)
- **Initial Commit:** 8095e4b - "Initial commit" (2026-01-13)
- **Current Branch:** `claude/claude-md-mkcgi924jnpjbjrj-PLo14`

### Technology Stack
**Not yet decided.** Potential options to consider:
- **Frontend:** React, Vue.js, Svelte
- **Backend:** Node.js/Express, Python/FastAPI, Go
- **AI Integration:** Anthropic Claude API
- **Video Processing:** FFmpeg, youtube-dl/yt-dlp
- **Database:** PostgreSQL, MongoDB, Redis

---

## 🏗️ Codebase Structure

### Recommended Structure (To Be Implemented)

```
Gethertube-Claude/
├── .git/                      # Git repository
├── .github/                   # GitHub Actions workflows (if using GitHub)
│   └── workflows/
├── docs/                      # Documentation
│   ├── API.md
│   ├── ARCHITECTURE.md
│   └── CONTRIBUTING.md
├── src/                       # Source code
│   ├── api/                   # API routes/endpoints
│   ├── components/            # UI components (if frontend)
│   ├── services/              # Business logic
│   ├── utils/                 # Utility functions
│   └── config/                # Configuration files
├── tests/                     # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── scripts/                   # Build/deployment scripts
├── public/                    # Static assets (if web app)
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules
├── CLAUDE.md                  # This file
├── README.md                  # Project documentation
├── package.json               # Dependencies (if Node.js)
└── requirements.txt           # Dependencies (if Python)
```

### Key Directories (Once Implemented)

- **`/src`** - All application source code
- **`/tests`** - Test suites (unit, integration, e2e)
- **`/docs`** - Detailed documentation
- **`/scripts`** - Automation and utility scripts
- **`/public`** - Static assets served directly

---

## 🔄 Development Workflow

### Initial Setup (To Be Done)

1. **Technology Stack Selection**
   - Choose primary language and framework
   - Document decision in README.md
   - Initialize package manager (npm, pip, etc.)

2. **Project Structure Creation**
   - Create directory structure as outlined above
   - Set up configuration files
   - Initialize testing framework

3. **Dependency Management**
   - Install core dependencies
   - Set up linting and formatting tools
   - Configure build system

### Development Process (Once Established)

1. **Feature Development**
   ```bash
   # Create feature branch
   git checkout -b claude/feature-name-<session-id>

   # Develop and test
   # Run tests: [command TBD]
   # Run linter: [command TBD]

   # Commit changes
   git add .
   git commit -m "feat: descriptive commit message"

   # Push to remote
   git push -u origin claude/feature-name-<session-id>
   ```

2. **Testing**
   - Write tests for new functionality
   - Ensure all tests pass before committing
   - Maintain test coverage above [TBD]%

3. **Code Review**
   - Create pull request from feature branch
   - Address review comments
   - Merge once approved

---

## 🌿 Git Conventions

### Branch Naming

**CRITICAL:** All Claude AI development branches MUST follow this pattern:
```
claude/<descriptive-name>-<session-id>
```

**Examples:**
- `claude/initial-setup-abc123xyz789`
- `claude/add-video-api-def456uvw123`
- `claude/fix-authentication-ghi789rst456`

**Branch Prefixes:**
- `claude/*` - AI assistant development branches (required for push)
- `feat/*` - Feature branches (human developers)
- `fix/*` - Bug fix branches
- `docs/*` - Documentation updates
- `refactor/*` - Code refactoring
- `test/*` - Test additions/modifications

### Commit Message Format

Follow conventional commits specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, no logic change)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

**Examples:**
```
feat(api): add YouTube video metadata fetching endpoint

Implements a new API endpoint that fetches video metadata
using the YouTube Data API v3.

Closes #123
```

```
fix(auth): resolve token expiration handling

Previously, expired tokens would cause the app to crash.
Now properly refreshes tokens when expired.
```

### Git Operations

**Push Commands:**
```bash
# Always use -u flag for new branches
git push -u origin <branch-name>

# Branch must start with 'claude/' and end with session ID
# Otherwise, push will fail with 403 error
```

**Network Retry Policy:**
- Retry up to 4 times on network failures
- Exponential backoff: 2s, 4s, 8s, 16s
- Applies to: push, fetch, pull operations

**Fetch/Pull:**
```bash
# Prefer specific branch fetching
git fetch origin <branch-name>

# Pull specific branch
git pull origin <branch-name>
```

---

## 💻 Code Style & Conventions

### General Principles

1. **Keep It Simple**
   - Avoid over-engineering
   - Don't add features not explicitly requested
   - Prefer clarity over cleverness

2. **Security First**
   - Prevent command injection, XSS, SQL injection
   - Validate all user inputs
   - Use parameterized queries
   - Sanitize outputs
   - Follow OWASP Top 10 guidelines

3. **No Premature Optimization**
   - Write clear code first
   - Optimize only when necessary
   - Profile before optimizing

4. **Error Handling**
   - Handle errors at system boundaries (user input, external APIs)
   - Trust internal code and framework guarantees
   - Provide meaningful error messages
   - Log errors appropriately

### Code Organization

1. **File Naming**
   - Use descriptive, clear names
   - Follow language conventions (camelCase, snake_case, etc.)
   - Keep file names lowercase with hyphens for multi-word files

2. **Function/Method Size**
   - Keep functions focused and small
   - One function, one responsibility
   - Extract complex logic into separate functions

3. **Comments**
   - Only add comments where logic isn't self-evident
   - Explain "why", not "what"
   - Keep comments up-to-date
   - Don't add comments to unchanged code

4. **Naming Conventions**
   - Use descriptive variable names
   - Avoid single-letter variables (except loop counters)
   - Use verbs for functions/methods
   - Use nouns for classes/variables

### Documentation

1. **Code Documentation**
   - Document public APIs
   - Include usage examples
   - Document complex algorithms

2. **README Updates**
   - Keep README.md current
   - Include setup instructions
   - Document environment variables
   - Add usage examples

---

## 🤖 AI Assistant Guidelines

### When Working on This Project

1. **Always Read Before Editing**
   - Use Read tool to examine files before modifications
   - Understand existing code structure
   - Maintain consistent style with existing code

2. **Use Appropriate Tools**
   - **Read** - For viewing file contents (not cat/head/tail)
   - **Edit** - For modifying existing files (not sed/awk)
   - **Write** - For creating new files (not echo/cat heredoc)
   - **Bash** - Only for git, build commands, and system operations
   - **Glob** - For finding files by pattern
   - **Grep** - For searching code content
   - **Task** - For complex multi-step operations

3. **Task Management**
   - Use TodoWrite for planning complex tasks
   - Mark tasks in_progress before starting
   - Complete tasks immediately when done
   - Break large tasks into smaller steps

4. **Git Workflow**
   - Always work on `claude/*` branches
   - Never push to main/master without explicit permission
   - Run tests before committing
   - Use meaningful commit messages
   - Push with retry logic for network failures

5. **Security Awareness**
   - Never commit secrets (.env files, API keys, credentials)
   - Scan for vulnerabilities before committing
   - Use environment variables for sensitive data
   - Validate and sanitize all inputs

6. **Testing Requirements**
   - Write tests for new features
   - Run existing tests before committing
   - Fix any broken tests
   - Maintain or improve test coverage

7. **Don't Over-Engineer**
   - Only implement what's requested
   - Don't add extra features "for the future"
   - Don't refactor code unnecessarily
   - Don't add abstractions for one-time use
   - Trust framework guarantees

8. **Communication**
   - Output text directly to communicate with users
   - Never use echo/printf for communication
   - Provide clear, concise updates
   - Reference specific files and line numbers: `file.js:123`

### Common Pitfalls to Avoid

❌ **Don't:**
- Commit without reading existing code
- Add features not requested
- Create unnecessary abstractions
- Add comments to unchanged code
- Use bash for file operations (use specialized tools)
- Skip tests
- Push to wrong branch
- Commit secrets
- Over-validate internal code

✅ **Do:**
- Read files before editing
- Keep changes focused and minimal
- Write clear, simple code
- Test thoroughly
- Use proper git branches
- Follow existing code style
- Document public APIs
- Handle errors at boundaries

---

## 🗺️ Project Roadmap

### Phase 1: Initial Setup (Current Phase)
- [ ] Define project purpose and scope
- [ ] Choose technology stack
- [ ] Set up project structure
- [ ] Initialize package manager
- [ ] Configure linting and formatting
- [ ] Set up testing framework
- [ ] Create basic CI/CD pipeline

### Phase 2: Core Implementation
- [ ] Implement core functionality
- [ ] Create API endpoints
- [ ] Set up database (if needed)
- [ ] Integrate Claude API
- [ ] Implement YouTube integration
- [ ] Write comprehensive tests

### Phase 3: Enhancement
- [ ] Add advanced features
- [ ] Optimize performance
- [ ] Improve error handling
- [ ] Enhance documentation
- [ ] Add monitoring and logging

### Phase 4: Production Ready
- [ ] Security audit
- [ ] Load testing
- [ ] Documentation review
- [ ] Deployment setup
- [ ] User acceptance testing

---

## 📝 Notes for Future Development

### API Integration Considerations
- **Claude API:** Authentication, rate limiting, error handling
- **YouTube API:** Quota management, video metadata extraction
- **Error Recovery:** Implement retry logic with exponential backoff

### Scalability Considerations
- Consider caching strategies
- Design for horizontal scaling
- Plan database indexing strategy
- Implement rate limiting

### Security Checklist
- [ ] Input validation
- [ ] Output sanitization
- [ ] Authentication/Authorization
- [ ] HTTPS/TLS configuration
- [ ] Secrets management
- [ ] Dependency vulnerability scanning
- [ ] Regular security updates

---

## 📞 Contact & Support

**Project Owner:** Lucas Song (pudingles@gmail.com)
**Repository:** lukeydokey/Gethertube-Claude

For questions, issues, or contributions, please refer to the project's issue tracker (once established).

---

## 📄 Version History

| Date | Version | Changes |
|------|---------|---------|
| 2026-01-13 | 1.0.0 | Initial CLAUDE.md creation - Project initialization phase |

---

**Last Updated:** 2026-01-13
**Document Maintained By:** AI Assistants & Project Contributors
