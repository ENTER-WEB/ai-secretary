# Security Policy

## Reporting a vulnerability

公開前は、脆弱性をGitHub Issueへ投稿しないでください。リリース責任者へ非公開で報告し、再現手順・影響・機密情報を含まない証跡を共有してください。公開リリース時に、専用のsecurity contactをこの文書へ追加します。

## Security boundaries

- ダウンロード版はElectron main processのみがCodexを起動できます。
- すべてのCodexタスクは作業内容と作業フォルダをユーザーが確認してから実行されます。
- レンダラープロセスはNode API・任意のシェル実行・認証情報へのアクセスを持ちません。
- 署名鍵、GitHub公開トークン、Codex認証情報はソースコード・ログ・配布物に保存してはいけません。

## Supported release policy

正式公開は、署名済みの安定版だけをサポート対象とします。未署名ビルドやローカル開発ブリッジは開発用途のみです。
