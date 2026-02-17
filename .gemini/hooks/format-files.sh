#!/bin/bash

# Check if prettier is installed locally or globally
if npx prettier --version > /dev/null 2>&1; then
    FILES=$(git diff --name-only --diff-filter=d | grep -E '\.(ts|tsx|md|js|css)$' | xargs)
    if [ -n "$FILES" ]; then
        echo "Running Prettier on changed files..."
        npx prettier --write $FILES
    else
        echo "No files to format."
    fi
else
    echo "Error: Prettier is not installed. Run 'npm install --save-dev --save-exact prettier' first."
    exit 1
fi

# Remember to grant execute access to script file
# chmod +x .gemini/hooks/format-files.sh
