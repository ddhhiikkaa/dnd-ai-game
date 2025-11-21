# How to Fix "Password authentication is not supported"

GitHub no longer allows you to use your account password for the terminal. Instead, you must use a **Personal Access Token (PAT)**.

## Step 1: Generate a Token
1.  Log in to GitHub.
2.  Go to **Settings** (click your profile picture in the top right).
3.  Scroll down to the bottom of the left sidebar and click **Developer settings**.
4.  Click **Personal access tokens** > **Tokens (classic)**.
5.  Click **Generate new token** > **Generate new token (classic)**.
6.  **Note**: Give it a name like "MacBook Air".
7.  **Expiration**: Set to "No expiration" (or whatever you prefer).
8.  **Select scopes**: Check the box for **repo** (this is required to push code).
9.  Click **Generate token**.

## Step 2: Use the Token
1.  **COPY THE TOKEN IMMEDIATELY**. You won't be able to see it again.
2.  Go back to your terminal and run:
    ```bash
    git push -u origin main
    ```
3.  **Username**: Enter your GitHub username (`ddhhiikkaa`).
4.  **Password**: **PASTE THE TOKEN HERE**.
    *   *Note: You won't see any characters appear when you paste. This is normal security behavior. Just paste and press Enter.*

## Alternative: SSH (Advanced)
If you prefer not to use tokens every time, look up "Connecting to GitHub with SSH", but the Token method above is the quickest fix.
