#!/usr/bin/env bash
# Smoke test: verify API, Web, and auth endpoints after Docker Compose is up.
set -euo pipefail

API_URL="${API_URL:-http://localhost:3001}"
WEB_URL="${WEB_URL:-http://localhost:3000}"
PASS=0
FAIL=0

CURL_OPTS="--connect-timeout 5 --max-time 10 -s -o /dev/null -w '%{http_code}'"

run() {
  local name="$1"
  local cmd="$2"
  local expect="${3:-200}"
  local code
  code=$(eval "$cmd" 2>/dev/null || echo "000")
  if [[ "$code" == "$expect" ]]; then
    echo "  ✅ $name (HTTP $code)"
    ((PASS++)) || true
    return 0
  else
    echo "  ❌ $name (expected $expect, got HTTP $code)"
    ((FAIL++)) || true
    return 1
  fi
}

echo "=============================================="
echo "Smoke Test — API: $API_URL | Web: $WEB_URL"
echo "=============================================="

echo ""
echo "1. API Health"
run "GET /api/v1/health/live"   "curl $CURL_OPTS $API_URL/api/v1/health/live"
run "GET /api/v1/health/ready"  "curl $CURL_OPTS $API_URL/api/v1/health/ready"
run "GET /api/v1/health"        "curl $CURL_OPTS $API_URL/api/v1/health"

echo ""
echo "2. API Observability & Docs"
run "GET /api/v1/metrics"       "curl $CURL_OPTS $API_URL/api/v1/metrics"
run "GET /api (Swagger)"        "curl $CURL_OPTS $API_URL/api"

echo ""
echo "3. Auth"
# Invalid credentials: API may return 400 (validation) or 401 (invalid credentials)
code_invalid=$(curl --connect-timeout 5 --max-time 10 -s -o /dev/null -w '%{http_code}' -X POST "$API_URL/api/v1/auth/login" -H 'Content-Type: application/json' -d '{"email":"invalid@test.com","password":"wrong"}')
if [[ "$code_invalid" == "401" || "$code_invalid" == "400" ]]; then
  echo "  ✅ POST /api/v1/auth/login (invalid → $code_invalid)"
  ((PASS++)) || true
else
  echo "  ❌ POST /api/v1/auth/login (invalid) (expected 400/401, got HTTP $code_invalid)"
  ((FAIL++)) || true
fi
run "POST /api/v1/auth/login (valid)" "curl $CURL_OPTS -X POST $API_URL/api/v1/auth/login -H 'Content-Type: application/json' -d '{\"email\":\"admin@pilates.with\",\"password\":\"Admin@123\"}'" "200"

echo ""
echo "4. Web"
run "GET / (home)"               "curl $CURL_OPTS $WEB_URL/"
run "GET /login"                 "curl $CURL_OPTS $WEB_URL/login"

echo ""
echo "=============================================="
echo "Result: $PASS passed, $FAIL failed"
echo "=============================================="
[[ $FAIL -eq 0 ]]
