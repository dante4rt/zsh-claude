# zsh-claude

ZSH plugin for Claude-powered command line completions. Type a comment or partial command, press `Ctrl+X`, and get the completed command.

## Requirements

- [Bun](https://bun.sh) runtime
- Anthropic API key

## Installation

### Manual

Clone the repo and source the plugin in your `.zshrc`:

```zsh
source /path/to/zsh-claude/zsh-claude.plugin.zsh
```

### Oh My Zsh

Clone into your custom plugins directory:

```zsh
git clone https://github.com/yourusername/zsh-claude ~/.oh-my-zsh/custom/plugins/zsh-claude
```

Add to your plugins array in `.zshrc`:

```zsh
plugins=(... zsh-claude)
```

## Configuration

Set your API key via environment variable:

```zsh
export ANTHROPIC_API_KEY="sk-ant-..."
```

Or create a config file at `~/.config/zsh-claude/config.json`:

```json
{
  "apiKey": "sk-ant-...",
  "model": "claude-haiku-4-20250414",
  "maxTokens": 256
}
```

Environment variables take priority over the config file.

| Variable | Description | Default |
|---|---|---|
| `ANTHROPIC_API_KEY` | Your Anthropic API key | (required) |
| `ZSH_CLAUDE_MODEL` | Model to use | `claude-haiku-4-20250414` |

## Usage

Type a comment describing what you want, then press `Ctrl+X`:

```
# list all docker containers sorted by size
```

Or start a partial command:

```
docker ps --format
```

Press `Ctrl+X` and the buffer gets replaced with the completed command.

## Development

```zsh
bun install
bun test
```

## License

MIT
