# AI Secretary

ローカル優先のAI秘書アプリです。アニメ調アバター、会話履歴、作業履歴、そしてユーザーが明示承認したCodexタスクを扱います。

## 安全な公開設計

- 公開版はWindowsデスクトップアプリ（Electron）として配布します。
- Codex認証情報をアプリ画面・外部サーバー・公開リポジトリへ保存しません。
- 公開版ではローカルHTTPブリッジを使わず、制限されたElectron IPCだけでCodexを起動します。
- 署名済みインストーラー、SBOM、SHA-256、脆弱性検査が揃うまで公開リリースはできません。

公開の準備状況と必要なオーナー作業は [PUBLIC_RELEASE_READINESS.md](docs/03-delivery/PUBLIC_RELEASE_READINESS.md) を参照してください。

## 開発

```powershell
cd apps/ui
npm install
npm run dev
```

デスクトップシェルの開発起動:

```powershell
cd apps/desktop-shell
npm install
$env:AI_SECRETARY_DEV_URL = "http://localhost:3000"
npm run dev
```

リリースでは `apps/ui` を静的ビルドしてから、保護されたCIで署名済みインストーラーを作成します。詳細は [Runbook](docs/05-operations/RUNBOOK.md) を参照してください。
