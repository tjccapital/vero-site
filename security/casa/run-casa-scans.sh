#!/usr/bin/env bash
# CASA Tier 2 SAST + dependency scans for vero-site (Next.js)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
CASA_DIR="$ROOT/security/casa"
mkdir -p "$CASA_DIR"

echo "==> [1/3] Semgrep SAST (typescript + react + nextjs + owasp + security-audit + secrets)"
semgrep scan \
  --config p/typescript \
  --config p/javascript \
  --config p/react \
  --config p/nextjs \
  --config p/owasp-top-ten \
  --config p/security-audit \
  --config p/secrets \
  --exclude node_modules \
  --exclude .next \
  --exclude out \
  --exclude build \
  --exclude dist \
  --exclude security \
  --json --output "$CASA_DIR/semgrep-results.json" \
  --sarif --sarif-output "$CASA_DIR/semgrep-results.sarif" \
  --error \
  "$ROOT" || SEMGREP_RC=$?
SEMGREP_RC=${SEMGREP_RC:-0}

echo "==> [2/3] npm audit (production deps)"
( cd "$ROOT" && npm audit --omit=dev --json > "$CASA_DIR/npm-audit.json" ) || NPM_RC=$?
NPM_RC=${NPM_RC:-0}
( cd "$ROOT" && npm audit --omit=dev > "$CASA_DIR/npm-audit.txt" ) || true

echo "==> [3/3] Snyk (if authenticated)"
if command -v snyk >/dev/null 2>&1; then
  ( cd "$ROOT" && snyk test --severity-threshold=high --json > "$CASA_DIR/snyk-test.json" ) || SNYK_RC=$?
  ( cd "$ROOT" && snyk code test --severity-threshold=high --json > "$CASA_DIR/snyk-code.json" ) || SNYK_CODE_RC=$?
else
  echo "  (snyk CLI not installed, skipping)"
fi

cat <<EOF

==> Results written to: $CASA_DIR
  - semgrep-results.json / .sarif    (SAST)
  - npm-audit.json / .txt            (deps)
  - snyk-test.json / snyk-code.json  (if snyk available)

Exit codes:
  semgrep: ${SEMGREP_RC}
  npm audit: ${NPM_RC}
  snyk:      ${SNYK_RC:-skipped}
  snyk code: ${SNYK_CODE_RC:-skipped}
EOF
