# zsh-claude

ZSH plugin for Claude-powered command line completions. Type a comment or partial command, press `Ctrl+X`, and get the completed command.

## Demo

```bash
# find all files modified in the last 24 hours
# Press Ctrl+X...
find . -type f -mtime -1
```

```bash
docker ps --format
# Press Ctrl+X...
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

## Requirements

- [Bun](https://bun.sh) runtime
- [Anthropic API key](https://console.anthropic.com/settings/keys)

## Installation

### Oh My Zsh

```bash
git clone https://github.com/dante4rt/zsh-claude ~/.oh-my-zsh/custom/plugins/zsh-claude
cd ~/.oh-my-zsh/custom/plugins/zsh-claude && bun install
```

Add to your `.zshrc`:

```zsh
plugins=(... zsh-claude)
bindkey '^X' create_completion
```

### Manual

```bash
git clone https://github.com/dante4rt/zsh-claude ~/zsh-claude
cd ~/zsh-claude && bun install
```

Add to your `.zshrc`:

```zsh
source ~/zsh-claude/zsh-claude.plugin.zsh
bindkey '^X' create_completion
```

> [!IMPORTANT]
> You need to create the `create_completion` widget before binding. If you get a `zsh-syntax-highlighting` warning, add `zle -N create_completion` after loading the plugin but before the `bindkey` line.

## Configuration

### Environment Variables (recommended)

```zsh
export ANTHROPIC_API_KEY="sk-ant-..."
export ZSH_CLAUDE_MODEL="claude-haiku-4-20250414"  # optional
```

### Config File

Create `~/.config/zsh-claude/config.json`:

```json
{
  "apiKey": "sk-ant-...",
  "model": "claude-haiku-4-20250414",
  "maxTokens": 256
}
```

> [!NOTE]
> Environment variables take priority over the config file. The config file takes priority over defaults.

### Options

| Variable | Description | Default |
|---|---|---|
| `ANTHROPIC_API_KEY` | Your Anthropic API key | _(required)_ |
| `ZSH_CLAUDE_MODEL` | Model to use | `claude-haiku-4-20250414` |

> [!TIP]
> Haiku is the default because it's fast and cheap for shell completions. For more complex commands, try `claude-sonnet-4-20250514`.

## Usage

**Comment to command** — describe what you want:

```bash
# list all docker containers sorted by size
# Press Ctrl+X →
docker ps --size --format "table {{.Names}}\t{{.Size}}" | sort -k2 -h
```

**Partial command completion** — start typing, let Claude finish:

```bash
git log --oneline --graph
# Press Ctrl+X →
git log --oneline --graph --all --decorate
```

**Fix a command** — paste a broken command and let Claude correct it:

```bash
find . -name "*.ts" -exec grep -l "console.log" {} ;
# Press Ctrl+X →
find . -name "*.ts" -exec grep -l "console.log" {} \;
```

## How It Works

1. ZSH captures your current command line buffer
2. Pipes it to the TypeScript CLI via Bun
3. Claude (Haiku) generates the completion
4. Buffer gets replaced with the completed command

No Python dependency. No SDK bloat. Just raw API calls with Bun's built-in fetch.

## Development

```bash
bun install
bun test
```

> [!WARNING]
> Running tests does not call the Anthropic API. All API calls are mocked in the test suite.

## License

[MIT](LICENSE)
