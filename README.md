<p align="center">
  <h1 align="center">zsh-claude</h1>
  <p align="center">AI-powered command completion for ZSH, using Claude.</p>
</p>

<p align="center">
  <a href="#install">Install</a> ·
  <a href="#usage">Usage</a> ·
  <a href="#configuration">Configuration</a> ·
  <a href="#development">Development</a>
</p>

---

Type what you want in plain English. Press `Ctrl+X`. Get the command.

## Requirements

- [ZSH](https://www.zsh.org/) shell
- [Bun](https://bun.sh) runtime
- API key — [Anthropic](https://console.anthropic.com/settings/keys) or [OpenRouter](https://openrouter.ai/keys)
- [Oh My Zsh](https://ohmyz.sh/) (optional, for plugin-style install)

## Install

### With Oh My Zsh

```bash
git clone https://github.com/dante4rt/zsh-claude ~/.oh-my-zsh/custom/plugins/zsh-claude
cd ~/.oh-my-zsh/custom/plugins/zsh-claude && bun install
```

Add to `.zshrc`:

```zsh
plugins=(... zsh-claude)
bindkey '^X' create_completion
```

### Without Oh My Zsh

```bash
git clone https://github.com/dante4rt/zsh-claude ~/zsh-claude
cd ~/zsh-claude && bun install
```

Add to `.zshrc`:

```zsh
source ~/zsh-claude/zsh-claude.plugin.zsh
bindkey '^X' create_completion
```

## Usage

### Describe what you want

```bash
# show disk usage sorted by size                → du -sh * | sort -rh
# kill process on port 3000                     → lsof -ti:3000 | xargs kill
# find all .ts files modified today             → find . -name "*.ts" -mtime -1
# compress this folder into a tar.gz            → tar -czf archive.tar.gz .
# show my public IP                             → curl -s ifconfig.me
# list all running docker containers            → docker ps
# count lines of code in src/                   → find src -name "*.ts" | xargs wc -l
# show git log as a graph                       → git log --oneline --graph --all
```

### Complete a partial command

```bash
git rebase                                      → git rebase -i HEAD~3
docker compose up                               → docker compose up -d --build
ssh-keygen -t                                   → ssh-keygen -t ed25519 -C "your@email.com"
```

### Fix a broken command

```bash
find . -name "*.ts" -exec grep "TODO" {} ;      → find . -name "*.ts" -exec grep "TODO" {} \;
```

> [!NOTE]
> Commands are OS-aware. macOS gets `vm_stat` instead of `free -h`, `pbcopy` instead of `xclip`, etc.

## Configuration

Add to `.zshrc`:

```zsh
export ANTHROPIC_API_KEY="sk-ant-..."            # primary
export OPENROUTER_API_KEY="sk-or-..."            # fallback (when no Anthropic key)
export ZSH_CLAUDE_MODEL="claude-haiku-4-20250414"  # optional
```

Or use a config file:

```bash
mkdir -p ~/.config/zsh-claude
cat > ~/.config/zsh-claude/config.json << 'EOF'
{
  "openrouterApiKey": "sk-or-...",
  "maxTokens": 256
}
EOF
```

| Provider | Default Model | When Used |
|----------|--------------|-----------|
| Anthropic | `claude-haiku-4-20250414` | `ANTHROPIC_API_KEY` is set |
| OpenRouter | `anthropic/claude-haiku-4.5` | Only `OPENROUTER_API_KEY` is set |

Env vars override config file. Anthropic is preferred over OpenRouter when both are set.

## How It Works

1. You type a comment or partial command
2. Press `Ctrl+X`
3. ZSH pipes your buffer to a TypeScript CLI via Bun
4. Claude generates the completed command
5. Your buffer gets replaced

No Python. No SDK. Just raw API calls with Bun's built-in fetch.

## Development

```bash
bun install
bun test     # 27 tests
```

## License

[MIT](LICENSE)
