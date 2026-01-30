# 🎯 Contributing Guidelines

Thank you for considering contributing to our Next.js standardization project!

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community

**Unacceptable behavior includes:**
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without permission

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git
- Familiarity with Next.js, React, and TypeScript

### Setup Development Environment

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/nextjs-standardization.git

# 3. Navigate to project
cd nextjs-standardization

# 4. Add upstream remote
git remote add upstream https://github.com/original-repo/nextjs-standardization.git

# 5. Install dependencies
npm install

# 6. Create a branch
git checkout -b feature/my-new-feature

# 7. Start development server
npm run dev
```

## Development Workflow

### Branch Naming

Use descriptive branch names:

```bash
feature/add-authentication-docs
fix/typo-in-readme
docs/update-deployment-guide
refactor/improve-code-examples
```

### Making Changes

1. **Create a branch** from `develop`
2. **Make your changes** following our style guidelines
3. **Write/update tests** for your changes
4. **Update documentation** if needed
5. **Commit your changes** using conventional commits
6. **Push to your fork**
7. **Create a Pull Request**

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format
<type>(<scope>): <description>

# Examples
feat(docs): add deployment guide for Docker
fix(readme): correct installation command
docs(auth): update NextAuth.js configuration
style(components): format code with Prettier
refactor(utils): simplify date formatting function
```

**Types:**
- `feat`: New feature or documentation
- `fix`: Bug fix or correction
- `docs`: Documentation only changes
- `style`: Code style changes (formatting, missing semi-colons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run linting
npm run lint

# Run type check
npm run type-check

# Run formatting
npm run format
```

## Pull Request Process

### Before Submitting

- [ ] Code follows the style guidelines
- [ ] Self-review of your code
- [ ] Comments added to complex code
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] No console.log or debugger statements

### PR Template

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Documentation update
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Refactoring

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
Describe how you tested the changes.

## Screenshots (if applicable)
Add screenshots for UI changes.

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests
- [ ] All tests pass locally
```

### Review Process

1. **Automated checks** must pass (CI/CD)
2. **Code review** by at least one maintainer
3. **Changes requested** (if any) must be addressed
4. **Final approval** from maintainer
5. **Merge** to develop/main branch

## Style Guidelines

### Markdown

- Use ATX-style headers (`#` instead of underlines)
- Add blank line before and after headers
- Use `-` for unordered lists
- Use `1.` for ordered lists (auto-numbering)
- Use fenced code blocks with language specifiers
- Keep lines under 80 characters when possible

```markdown
# Good Example

This is a paragraph.

## Subsection

- Item 1
- Item 2

\`\`\`typescript
const example = "code";
\`\`\`
```

### Code Examples

- Use TypeScript for all code examples
- Include proper types and interfaces
- Add comments explaining complex logic
- Show both good (✅) and bad (❌) examples when relevant

```typescript
// ✅ Good: Descriptive variable names and types
interface User {
  id: string;
  name: string;
}

function getUser(userId: string): Promise<User> {
  return fetch(`/api/users/${userId}`).then((res) => res.json());
}

// ❌ Bad: No types, unclear names
function get(id) {
  return fetch(`/api/users/${id}`).then((r) => r.json());
}
```

### Documentation Structure

Each documentation file should include:

1. **Title and description**
2. **Table of contents**
3. **Clear sections with headers**
4. **Code examples**
5. **Best practices**
6. **Resources/links**

## Reporting Issues

### Before Creating an Issue

- Check existing issues to avoid duplicates
- Verify the issue with the latest version
- Collect relevant information (versions, errors, etc.)

### Issue Template

```markdown
## Description
Clear description of the issue.

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen.

## Actual Behavior
What actually happens.

## Environment
- OS: [e.g., Windows 11, macOS 13]
- Node version: [e.g., 20.0.0]
- npm version: [e.g., 9.0.0]
- Browser: [e.g., Chrome 120]

## Additional Context
Any other relevant information.

## Screenshots
If applicable, add screenshots.
```

## Documentation Contributions

### Adding New Documentation

1. Create a new file in `/docs` directory
2. Follow the naming convention: `FEATURE_NAME.md`
3. Add entry to main README.md table of contents
4. Include all required sections
5. Add code examples and best practices
6. Link to related documentation

### Updating Existing Documentation

1. Keep the same structure and formatting
2. Update the "Last Updated" date if applicable
3. Ensure links are still valid
4. Verify code examples still work
5. Update related documentation if needed

## Questions?

If you have questions:

1. Check existing documentation
2. Search closed issues
3. Ask in discussions tab
4. Contact maintainers

## Recognition

Contributors will be recognized in:
- Contributors section of README
- Release notes  
- GitHub contributors page

Thank you for contributing! 🎉

---

**Resources:**
- [Conventional Commits](https://www.conventionalcommits.org/)
- [How to Write a Good PR](https://github.blog/2015-01-21-how-to-write-the-perfect-pull-request/)
- [Markdown Guide](https://www.markdownguide.org/)
