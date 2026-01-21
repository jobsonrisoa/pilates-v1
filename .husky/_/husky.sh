#!/usr/bin/env sh
if [ -z "$husky_skip_init" ]; then
  readonly hook_name="$(basename "$0")"

  if [ "$HUSKY" = "0" ]; then
    exit 0
  fi

  if [ -f ~/.huskyrc ]; then
    . ~/.huskyrc
  fi

  export husky_skip_init=1
  sh -e "$0" "$@"
  exitCode="$?"

  if [ "$exitCode" != "0" ]; then
    echo "husky - $hook_name hook exited with code $exitCode" >&2
  fi

  exit "$exitCode"
fi
