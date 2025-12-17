#!/usr/bin/env bash
# A small wrapper to add a changelog entry to the backend MongoDB
# Usage: ./add-changelog.sh --version 0.7.9 --title "Fix: ..." [--date 2025-12-16] [--description "Short desc"] [--details "line1||line2"] [--force]

set -euo pipefail

# Forward all args to the backend script via npx ts-node (run from backend folder so ts-node resolves correctly)
cd "$(dirname "$0")/backend" || exit 1
npx ts-node scripts/add-changelog.ts "$@"
