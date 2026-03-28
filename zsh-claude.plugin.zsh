#!/bin/zsh

_ZSH_CLAUDE_DIR=$(dirname $0)

create_completion() {
    local text=$BUFFER
    local completion=$(echo -n "$text" | bun $_ZSH_CLAUDE_DIR/src/complete.ts $CURSOR 2>/dev/null)

    if [[ -n "$completion" ]]; then
        BUFFER="$completion"
        CURSOR=${#BUFFER}
    fi
}

zle -N create_completion
bindkey '^X' create_completion
