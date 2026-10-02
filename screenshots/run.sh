#!/usr/bin/env bash
# Takes the Cookpal store screenshots. Needs nothing but Docker: the published app images are
# pulled and started, and a Playwright container seeds them and takes the pictures.
#
#   ./run.sh [--tag TAG] [--apiserver-tag TAG] [--frontend-tag TAG] [--no-pull] [--keep]
#            [--landing-out DIR] [--lang de] [--only weekplan]
#   --no-pull                uses the images as they are, for ones built locally (--tag local)
#   --landing-out DIR        copies the landing page pictures and banners into the landing project at DIR
#   ./run.sh down            stops a stack that --keep left running
#   ./run.sh fetch-photos    downloads the photos listed in src/photos.json again
set -euo pipefail

invoked_from="$PWD"
cd "$(dirname "$0")"

export APISERVER_TAG=latest FRONTEND_TAG=latest
# So the screenshots belong to whoever ran this, not to root.
export HOST_UID HOST_GID
HOST_UID="$(id -u)"
HOST_GID="$(id -g)"
keep=false
pull=true
landing_out=""
runner_args=()

case "${1:-}" in
  down)
    docker compose --profile runner down --remove-orphans
    exit
    ;;
  fetch-photos)
    docker compose run --rm --build --entrypoint node runner src/fetch-photos.mjs
    exit
    ;;
esac

while [[ $# -gt 0 ]]; do
  case "$1" in
    --tag) APISERVER_TAG="$2"; FRONTEND_TAG="$2"; shift 2 ;;
    --apiserver-tag) APISERVER_TAG="$2"; shift 2 ;;
    --frontend-tag) FRONTEND_TAG="$2"; shift 2 ;;
    --no-pull) pull=false; shift ;;
    --keep) keep=true; shift ;;
    --landing-out) landing_out="$2"; shift 2 ;;
    -h|--help) sed -n '2,10p' "$0" | sed 's/^# \{0,1\}//'; exit ;;
    # Everything else is for the screenshot script, such as --lang and --only.
    *) runner_args+=("$1"); shift ;;
  esac
done

# Checked before anything is started, so a wrong path does not cost a whole run.
if [[ -n "$landing_out" ]]; then
  landing_out="$(cd "$invoked_from" && cd "$landing_out" 2>/dev/null && pwd)" || {
    echo "--landing-out: no such directory." >&2
    exit 1
  }
  if [[ ! -f "$landing_out/astro.config.mjs" ]]; then
    echo "--landing-out: $landing_out has no astro.config.mjs, so it is not the landing project." >&2
    exit 1
  fi
fi

cleanup() {
  if [[ "$keep" != true ]]; then
    docker compose --profile runner down --remove-orphans >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT

mkdir -p out
echo "Starting apiserver:$APISERVER_TAG and frontend:$FRONTEND_TAG"
# Pulled every time, so "latest" really is the latest release.
if [[ "$pull" == true ]]; then
  docker compose pull --quiet apiserver web
fi
if ! docker compose up --detach --wait postgres apiserver web; then
  docker compose logs --tail 60 apiserver web
  echo "The apps did not come up; their last log lines are above." >&2
  exit 1
fi

docker compose run --rm --build runner ${runner_args[@]+"${runner_args[@]}"}

if [[ -n "$landing_out" ]]; then
  cp -R out/landing/. "$landing_out/"
  echo "Landing page pictures are in $landing_out"
fi
echo "Screenshots are in $(pwd)/out"
