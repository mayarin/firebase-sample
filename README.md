# firebaseチャット試作品 - maya.pg.

## 何をするもの？

firebase hosting 上で javascriptを動作させ、以下の実装を行います。<br>
・firebase auth のアカウントを登録、管理、削除します。<br>
・firebase storage上に自身のアカウントのプロフィール画像を登録。<br>
・cloud firestore へデータの読み書きを行います。<br>

## 実装できている仕様は？

・サインアップ<br>
・サインイン<br>
・サインアウト<br>
・パスワード再設定リンク請求<br>
・サインイン後プロフィール更新<br>
・ログインメールアドレス変更<br>
・ログインパスワード変更<br>
・アカウント削除<br>
・アカウント全体でのチャット<br>
・個人間チャットを積む<br>
・チャットメッセージが消された際のリフレッシュを行う<br>
・アカウントが削除された際にチャットデータも削除<br>

## 必要なもの

・firebaseプロジェクト<br>
・firebase authにてメールアドレス・パスワードでのログインを利用する旨登録<br>
・firebase storage<br>
・cloud firestore<br>

## 作ったひと

https://maya-pg.net/
