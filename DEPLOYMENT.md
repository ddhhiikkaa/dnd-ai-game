# Deployment & Versioning Guide

## 1. Pushing to GitHub

Since you have a local git repository, you need to link it to a remote GitHub repository.

### Step 1: Create a Repo on GitHub
1.  Go to [github.com/new](https://github.com/new).
2.  Name it `dnd-ai-game` (or whatever you prefer).
3.  **Do not** initialize with README, .gitignore, or License (we already have these).
4.  Click **Create repository**.

### Step 2: Push Local Code
Run these commands in your terminal (I cannot do this for you as it requires your GitHub credentials):

```bash
# Replace <YOUR_USERNAME> with your actual GitHub username
git remote add origin https://github.com/<YOUR_USERNAME>/dnd-ai-game.git
git branch -M main
git push -u origin main
```

## 2. Versioning Best Practices

We follow **Semantic Versioning (SemVer)**: `MAJOR.MINOR.PATCH` (e.g., `1.0.0`).

-   **MAJOR**: Incompatible API changes or massive rewrites (e.g., `2.0.0`).
-   **MINOR**: Backwards-compatible new features (e.g., `1.1.0`).
-   **PATCH**: Backwards-compatible bug fixes (e.g., `1.0.1`).

### Workflow for New Features

1.  **Create a Branch**: Never work directly on `main`.
    ```bash
    git checkout -b feature/new-dice-animation
    ```
2.  **Commit Changes**:
    ```bash
    git add .
    git commit -m "feat: add 3d dice rolling animation"
    ```
    *Tip: Use "conventional commits" prefixes like `feat:`, `fix:`, `chore:`, `style:`.*

3.  **Merge & Tag**:
    When the feature is ready and merged back to `main`:
    ```bash
    git checkout main
    git merge feature/new-dice-animation
    git tag v1.1.0
    git push origin main --tags
    ```

### Using GitHub Releases
After pushing tags, go to your GitHub repo > **Releases** > **Draft a new release**.
-   Choose the tag (e.g., `v1.0.0`).
-   Click **Generate release notes** (GitHub does this automatically based on PRs!).
-   Publish.

## 3. Deployment (Vercel)

For a Next.js app, **Vercel** is the best deployment platform.

1.  Go to [vercel.com](https://vercel.com).
2.  Sign up/Login with GitHub.
3.  Click **Add New...** > **Project**.
4.  Import your `dnd-ai-game` repository.
5.  **Environment Variables**:
    -   Add `OPENAI_API_KEY` and paste your key.
6.  Click **Deploy**.

Vercel will automatically redeploy whenever you push to `main`.
