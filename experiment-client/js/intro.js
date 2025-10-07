// intro.js

//TODO
//IDのデータ取得（エラー判定いるかも？）

// Intro1 ウェルカム~実験開始画面
const intro1 = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `<div style="text-align:center;">
    <h2>ご参加ありがとうございます</h2>
    <p>全員そろい次第実験を開始します。</p>
    <p>携帯電話の電源をお切りください。</p>
  </div>`,
  choices: "NO_KEYS",
  trial_duration: 10000 // 10秒（10000ミリ秒） デモのため短縮
};


const intro2 = {
  type: jsPsychInstructions,
  pages: [
    // Intro2 実験開始画面
    `<div style="text-align:left">
      <h2>これから実験を開始します</h2>
    </div>`
    
  ],
  
  show_clickable_nav: true,      // 次へ/戻るボタンを表示
  allow_backward: false,         // 戻るを禁止
  button_label_next: '次へ',     // ボタン文言
  button_label_previous: '戻る', // 使わないが一応
};

// Intro3 参加者ID入力
const intro3_id = {
  type: jsPsychSurveyText,
  questions: [
    {prompt: "参加者IDを入力してください", name: "ID"}
  ],
  button_label: "次へ",
  on_finish: function(data){
    // 入力されたIDをグローバル変数やwindowオブジェクトに保存
    window.participantID = data.response.ID;
  }
};

const intro4 = {
  type: jsPsychInstructions,
  pages: [
    //Intro4 実験上の注意
    `<div style="text-align:left; max-width:750px; margin:auto;">
      <h2>実験時の注意</h2>
      <ul>
        <li>ご自身の<b>ＰＣ</b>でご参加ください。<br>
        （スマートフォン・タブレット端末はエラーが生じる可能性があります）</li>
        <li>zoomはつないだままで、質問時以外は<b>画面を最大化</b>してください。</li>
        <li>実験中は、<b>画面を閉じたり、更新したりしないでください。</b></li>
        <li><span style="color:red;">実験者の指示があるまでは、zoomから退出しないでください。</span></li>
        <li>実験中は、実験スタッフおよび画面の指示に従ってください。</li>
        <li>周りの人と相談したり、実験以外の作業をしたりしないでください。</li>
        <li>携帯電話の電源はお切りください。</li>
        <li>質問のある方はzoom画面のQ&Aボタンで、実験スタッフにお知らせください。</li>
        <li>読み終わったら「次へ」ボタンをクリックしてください。説明が続きます。</li>
        <li>前のページに戻るときは、「戻る」ボタンをクリックしてください。</li>
      </ul>
    </div>`,

    // Intro5 実験の概要
    `<div style="text-align:left; max-width:950px; margin:auto;">
      <h2>実験の概要</h2>
      <ul>
        <li>この実験には、<b>10人の参加者</b>が同時に参加しています。</li>
        <li>実験では、10人で同時にカード選択を行っていただきます。
        <br>実験中に、参加者同士がやりとりを行うことはありません。</li>
        <li>参加者同士が行動をお互いに見ることはなく、またIDなどが他の参加者に知られることはありません。</li>
        <li>実験後にあなたにお支払いする報酬は、これから行う実験の結果によって決定されます。<br>あなたが実験中に獲得した金額が、参加報酬に加算され、あなたの実験報酬として後日支払われます。
        <br>また、実験結果に関わらず実験への参加報酬として一人あたり200円が実験後に別途支払われます。</li>
        <li>実験報酬は実験とその後すべての質問に答えていただいた場合にのみ支払われます。<br>（中断した場合はお支払いすることができません）</li>
        <li>実験時間は<b>30分程度</b>を予定しています。</li>
      </ul>
    </div>`,

    // Intro6 実験説明１(全体像) 
    `<div style="text-align:left; max-width:750px; margin:auto;">
      <h2>実験説明１</h2>
      <ul>
        <li>これから、画面に10枚のカードが並びます。</li>
        <li>カードには<b>0円から1000円</b>の間の価値が割り当てられていますが、選ぶまでその価値は分かりません。</li>
        <li><b>10枚のカードを、あなたを含めた10人の参加者が同時に選んでいます。</b></li>
        <li>獲得したカードの価値が実験の報酬として支払われます。
        <br>（参加報酬として別途200円が支払われます）</li>
      </ul>
      <img src="img/intro1.png" alt="" style="width:500px; display:block; margin:16px auto; width:750px;">
    </div>`,

    // Intro7 実験説明２（選択フェーズと意思決定フェーズ）
    `<div style="text-align:left; max-width:900px; margin:auto; display: flex; align-items: center;">
      <span>
        <h2>実験説明２</h2>
        <p>1ラウンドは次の2つの段階に分かれています。</p>
        <h4>選択フェーズ</h4>
        <ul>
          <li style="padding-left: 1em;">あなたはカードを1枚選んでめくり、そのカードの価値を確認します。</li>
            <li style="padding-left: 3em;">めくったカードに書かれた価値はあなたしか見ることが出来ません。</li>
            <li style="padding-left: 3em;">他の人がめくったカードをあなたが見ることも出来ません。</li>
        </ul>
        <h4>決定フェーズ</h4>
        <ul>
          <li style="padding-left: 1em;">選んだカードを「このカードに決定する」か「他のカードもめくってみる」を選びます。</li>
          <li style="padding-left: 1em;"><b>あなたと同じカードで決定した参加者が他にいなければ</b>あなたがそのカードを獲得できます。</li>
          <li style="padding-left: 1em;">もし複数人が同じカードで決定した場合、獲得者はランダムで選ばれます。</li>
        </ul>
      </span>
      <img src="img/intro2.png" style="width:350px; height:auto; margin-left:5px;">
    </div>`,

    // Intro8 実験説明３（再選択と繰り返し）
    `<div style="text-align:left; max-width:950px; margin:auto; display: flex; align-items: center;">
      <span>
        <h2>実験説明３</h2>
        <li>カードを獲得できなかった場合<br>（＝決定しなかった／他の参加者に獲得された場合）は、<br>
        再び選択フェーズに戻り、新しいカードを選びます。</li>
        <li>カードを獲得するまで、この流れを繰り返します。</li>
        <li>カードを1枚獲得した時点で、実験終了となります。</li>
      </span>
      <img src="img/intro3.png" style="width:450px; height:auto; margin-left:5px;">
    </div>`,

    // Intro9 実験説明４（カードの減少）
    `<div style="text-align:left; max-width:750px; margin:auto;">
      <h2>実験説明４</h2>
      <ul>
        <li><b>他の参加者が獲得したカードを選ぶことはできません。</b></li>
        <li>すでに、他の参加者が獲得したカードは画面から消えていきます。</li>
      </ul>
      <img src="img/intro4.png" alt="" style="width:500px; display:block; margin:16px auto; width:750px;">
    </div>`,

    // Intro10 実験説明５（ランダム終了など）　終了ラウンド数未定
    `<div style="text-align:left; max-width:750px; margin:auto;">
      <h2>実験説明５</h2>
      <ul>
        <li>カードが残り1枚になった場合、または実験が12ラウンド目に入った場合は、</li> 
        <li><b>残っているカードが、まだカードを獲得していない参加者にランダムに割り当てられます。</b></li>
        <li>あなたが割り当てられたカードの価値が、あなたの実験報酬となります。</li>
      </ul>
      <img src="img/intro5.png" alt="" style="width:600px; display:block; margin:16px auto;">
    </div>`,

    // Intro11 実験説明６（確認）
    `<div style="text-align:left; max-width:750px; margin:auto;">
      <h2>実験説明６</h2>
      <ul>
        <li>以上で実験についての説明は終わりです。分からないないところがありましたら、戻ってもう一度説明を読み直してください。</li>
        <li>また、説明を読んでも分からないところがありましたら、zoomのQ&A機能で実験者にお知らせください。</li>
        <li>「次へ」ボタンをクリックすると、練習問題に進みます。</li>
        <li><span style="color:red;">このページの「次へ」ボタンをクリックすると、説明には戻れなくなります。</span></li>
        <li>実験の内容を十分理解できたと思ったら、「次へ」ボタンをクリックしてください。</li>
      </ul>
    </div>`

  ],
  
  show_clickable_nav: true,      // 次へ/戻るボタンを表示
  allow_backward: true,         // 戻るを禁止
  button_label_next: '次へ',     // ボタン文言
  button_label_previous: '戻る', // 使わないが一応
  // ※キーボードの左右矢印でも進めます

}