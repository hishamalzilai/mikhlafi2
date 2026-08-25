#!/usr/bin/env bash
set -euo pipefail

status=0

for secret_file in .env.local coolify-creds.txt; do
  if [[ ! -e "$secret_file" ]]; then
    continue
  fi

  if git ls-files --error-unmatch "$secret_file" >/dev/null 2>&1; then
    echo "ERROR: $secret_file is tracked by Git."
    status=1
  fi

  mode=$(stat -c '%a' "$secret_file")
  if (( (8#$mode & 8#077) != 0 )); then
    echo "ERROR: $secret_file permissions are $mode; expected 600 or stricter."
    status=1
  fi
done

if (( status == 0 )); then
  echo "Local secret files are untracked and have restrictive permissions."
fi

exit "$status"
