[image storage=black layer=background]
[if exp="sf.markPrologue"]
[jump target=*question]
[else]
[jump target=*rule]
[endif]
*question
[cm]
ルール説明をスキップしますか？
[l]
[link target=*next]はい[endlink]
[link target=*rule]いいえ[endlink]
[s]
*rule
[cm]
突然ですが、あなたにはガチャをまわしてもらいます。
[l]
[cm]
【ルール1】[r]
初期ポイントは [emb exp="f.score"] です。
[l]
[cm]
【ルール2】[r]
ガチャを一回実行するごとに、[r]
ガチャごとに設定されたポイントを消費します。
[l]
[cm]
【ルール3】[r]
ガチャで入手したアイテムに応じて所持ポイントが加算されます。
[l]
[cm]
【ルール4】[r]
ガチャは最大[emb exp="sf.maxTrials"]回まで実行できます。
[l]
[cm]
【ルール5】[r]
最終的な所持ポイントをスコアとして登録します。
[l]
[iscript]
sf.markPrologue = true;
[endscript]
[cm]
たくさんまわすも、一度もまわさないもあなた次第！
[l]
[cm]
確率の沼で試行錯誤し、高スコアを目指しましょう！
[l]
*next
[image storage=black layer=black opacity=0]
[nextScene label="gacha"]
