#!/bin/bash

OUTPUT="project-snapshot.md"

{
  echo "# PROJECT SNAPSHOT"
  echo
  echo "Generated: $(date)"
  echo

  echo "# PROJECT STRUCTURE"
  echo

  find . \
    -not -path './node_modules/*' \
    -not -path './.git/*' \
    -not -path './dist/*' \
    -not -path './build/*' \
    -not -path './coverage/*' \
    -not -path './.next/*' \
    -not -path './.cache/*' \
    -not -path './.vite/*' \
    -not -path './.turbo/*' \
    -not -path './.idea/*' \
    -not -path './.vscode/*' \
    -not -path './storybook-static/*' \
    -not -name "$OUTPUT" \
    -not -name '*.log' \
    -not -name '*.lock' \
    -print \
    | sort

  echo
  echo "# FILE CONTENTS"
  echo

  find . -type f \
    -not -path './node_modules/*' \
    -not -path './.git/*' \
    -not -path './dist/*' \
    -not -path './build/*' \
    -not -path './coverage/*' \
    -not -path './.next/*' \
    -not -path './.cache/*' \
    -not -path './.vite/*' \
    -not -path './.turbo/*' \
    -not -path './.idea/*' \
    -not -path './.vscode/*' \
    -not -path './storybook-static/*' \
    -not -name "$OUTPUT" \
    -not -name '*.log' \
    -not -name '*.lock' \
    -not -name '*.png' \
    -not -name '*.jpg' \
    -not -name '*.jpeg' \
    -not -name '*.gif' \
    -not -name '*.webp' \
    -not -name '*.svg' \
    -not -name '*.ico' \
    -not -name '*.mp3' \
    -not -name '*.wav' \
    -not -name '*.mp4' \
    -not -name '*.mov' \
    -not -name '*.avi' \
    -not -name '*.woff' \
    -not -name '*.woff2' \
    -not -name '*.ttf' \
    -not -name '*.otf' \
    -not -name '*.zip' \
    -not -name '*.tar' \
    -not -name '*.gz' \
    | sort \
    | while read -r file; do

      echo
      echo "========================================"
      echo "FILE: $file"
      echo "========================================"
      echo

      # Skip binary files
      if file "$file" | grep -qE 'binary|image|audio|video|font|archive'; then
        echo "[Binary file omitted]"
        continue
      fi

      # Redact environment secrets
      if [[ "$file" == *.env* ]]; then
        sed -E \
          's/^([A-Za-z_][A-Za-z0-9_]*=).*/\1<REDACTED>/' \
          "$file"
        continue
      fi

      echo '```'
      cat "$file"
      echo
      echo '```'

  done

} > "$OUTPUT"

echo
echo "✅ Snapshot created: $OUTPUT"
echo "📦 Size: $(du -h "$OUTPUT" | cut -f1)"
echo
echo "You can now give $OUTPUT to an AI."