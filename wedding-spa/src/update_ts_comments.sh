#!/bin/bash
# This script recursively processes all files matching *.ts* and ensures that
# the first line is a comment containing the file’s relative path.

find . -type f -name '*.ts*' | while IFS= read -r file; do
    # Remove the leading "./" from the file path.
    rel="${file#./}"
    comment="// ${rel}"

    # Check if the first line starts with "//"
    if head -n 1 "$file" | grep -q '^//'; then
        # Replace the first line with the new comment.
        sed -i '' "1s|.*|$comment|" "$file"
    else
        # Insert the comment as the new first line.
        # The syntax below works on macOS; note the backslash-newline requirement.
        sed -i '' "1i\\
$comment
" "$file"
    fi
done
