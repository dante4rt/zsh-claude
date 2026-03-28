# zsh-claude

ZSH plugin for Claude-powered command line completions. Type a comment or partial command, press `Ctrl+X`, get the completed command.

## Requirements

- [Bun](https://bun.sh)
- Anthropic API key or OpenRouter API key

## Install

```bash
git clone https://github.com/dante4rt/zsh-claude ~/.oh-my-zsh/custom/plugins/zsh-claude
cd ~/.oh-my-zsh/custom/plugins/zsh-claude && bun install
```

Add to `.zshrc`:

```zsh
plugins=(... zsh-claude)
bindkey '^X' create_completion
```

> [!IMPORTANT]
> If you get a `zsh-syntax-highlighting` warning, add `zle -N create_completion` after the plugins line.

## Configuration

Set one of these in `.zshrc`:

```zsh
export ANTHROPIC_API_KEY="sk-ant-..."     # primary
export OPENROUTER_API_KEY="sk-or-..."     # fallback (used when no Anthropic key)
export ZSH_CLAUDE_MODEL="claude-haiku-4-20250414"  # optional
```

Or use a config file:

```bash
mkdir -p ~/.config/zsh-claude
cat > ~/.config/zsh-claude/config.json << 'EOF'
{
  "apiKey": "sk-ant-...",
  "openrouterApiKey": "sk-or-...",
  "model": "claude-haiku-4-20250414",
  "maxTokens": 256
}
EOF
```

Env vars override config file. Anthropic overrides OpenRouter.

## Usage

```bash
# describe what you want, press Ctrl+X
# list all docker containers sorted by size
→ docker ps --size --format "table {{.Names}}\t{{.Size}}" | sort -k2 -h

# complete a partial command
docker compose up
→ docker compose up -d --build --remove-orphans

# fix a broken command
find . -name "*.ts" -exec grep -l "console.log" {} ;
→ find . -name "*.ts" -exec grep -l "console.log" {} \;
```

## Development

```bash
bun install
bun test
```

## License

[MIT](LICENSE)
