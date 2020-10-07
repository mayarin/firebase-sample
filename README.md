# firebaseチャット試作品 - maya.pg.

## 何をするもの？

firebase hosting 上で javascriptを動作させ、以下の実装を行います。
・firebase auth のアカウントを登録、管理、削除します。
・firebase storage上に自身のアカウントのプロフィール画像を登録。
・cloud firestore へデータの読み書きを行います。

## 実装できている仕様は？

・サインアップ
・サインイン
・サインアウト
・パスワード再設定リンク請求
・サインイン後プロフィール更新
・ログインメールアドレス変更
・ログインパスワード変更
・アカウント削除
・アカウント全体でのチャット

## これから実装するもの

・個人間チャットを積む
・チャットメッセージが消された際のリフレッシュを行う
・アカウントが削除された際にチャットデータも削除

## 必要なもの

・firebaseプロジェクト
・firebase authにてメールアドレス・パスワードでのログインを利用する旨登録
・firebase storage
・cloud firestore
