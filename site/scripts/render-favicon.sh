#!/bin/sh
# Regenerate public/favicon.svg from the current GitHub avatar.
#
# Browsers do NOT fetch external resources (even same-origin ones) referenced
# inside a favicon SVG's <image href> - the favicon render path is a separate
# pipeline from normal page rendering and never waits on sub-resource loads.
# So the avatar has to be baked in as a base64 data URI at build time; re-run
# this script whenever the GitHub avatar changes.
#
# Requires macOS (uses `sips` to resize) - run locally, not in CI.
set -e
cd "$(dirname "$0")/.."

TMP=$(mktemp -d)
curl -sL "https://avatars.githubusercontent.com/u/22003767?s=128&v=4" -o "$TMP/avatar.png"
sips -z 96 96 "$TMP/avatar.png" --out "$TMP/avatar.png" >/dev/null
B64=$(base64 -i "$TMP/avatar.png")

cat > public/favicon.svg <<EOF
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <clipPath id="roundedSquare">
      <rect x="0" y="0" width="64" height="64" rx="14" ry="14" />
    </clipPath>
  </defs>
  <image
    href="data:image/png;base64,$B64"
    x="0"
    y="0"
    width="64"
    height="64"
    clip-path="url(#roundedSquare)"
    preserveAspectRatio="xMidYMid slice"
  />
</svg>
EOF

rm -rf "$TMP"
echo "Wrote public/favicon.svg ($(wc -c < public/favicon.svg) bytes)"
