// outro.js

var outro = {
  timeline: [
    {
      type: jsPsychSurveyHtmlForm,
      preamble: `
      <h3>実験後調査</h3>
      <p>以下の質問にお答えください。</p>
      <p>回答は約5分程度で終わります。</p>
      `,
      html: `
        <div style="margin-bottom: 24px;">
          <p><b>1. 実験開始時の目標金額はどの程度でしたか？（参加報酬の200円を含まない）</b></p>
          <label for="q1">金額 (0～1000円):</label>
          <input type="range" id="q1" name="q1" min="0" max="1000" step="50" value="500"
                 oninput="document.getElementById('q1_value').innerText=this.value">
          <span id="q1_value">500</span> 円
        </div>
      `,
      button_label: "次へ"
    },
    {
      type: jsPsychSurveyHtmlForm,
      html: `
        <div style="margin-bottom: 24px;">
          <p><b>2. 意思決定は何を基準に行いましたか？（複数選択可）</b></p>
          <label><input type="checkbox" name="q2" value="目標金額"> 目標金額</label><br>
          <label><input type="checkbox" name="q2" value="これまでの選択肢との比較"> これまでの選択肢との比較</label><br>
          <label><input type="checkbox" name="q2" value="残っている選択肢の数"> 残っている選択肢の数</label><br>
          <label><input type="checkbox" name="q2" value="残りのラウンド"> 残りのラウンド</label><br>
          <label><input type="checkbox" name="q2" value="その他"> その他</label>
        </div>
      `,
      button_label: "次へ"
    },
    {
      type: jsPsychSurveyHtmlForm,
      html: `
        <div style="margin-bottom: 24px;">
          <p><b>3. その他に意思決定の基準となったものがあれば教えてください</b></p>
          <textarea name="q3" rows="3" cols="60"></textarea>
        </div>
      `,
      button_label: "次へ"
    },
    {
      type: jsPsychSurveyHtmlForm,
      html: `
        <div style="margin-bottom: 24px;">
          <p><b>4. ラウンドが進むにつれ、意識や判断基準は変化しましたか？</b></p>
          <label><input type="radio" name="q4" value="変化した" required> 変化した</label><br>
          <label><input type="radio" name="q4" value="変化しなかった"> 変化しなかった</label>
        </div>
      `,
      button_label: "次へ"
    },
    {
      type: jsPsychSurveyHtmlForm,
      html: `
        <div style="margin-bottom: 24px;">
          <p><b>5. 獲得したいと思っていたカードを他の参加者にとられることがありましたか？</b></p>
          <label><input type="radio" name="q5" value="はい" required> はい</label><br>
          <label><input type="radio" name="q5" value="いいえ"> いいえ</label>
        </div>
      `,
      button_label: "次へ"
    },
    {
      type: jsPsychSurveyHtmlForm,
      html: `
        <div style="margin-bottom: 24px;">
          <p><b>6. その他実験中に考えたことを自由に記述してください</b></p>
          <textarea name="q6" rows="4" cols="60"></textarea>
        </div>
      `,
      button_label: "次へ"
    }
  ],
  on_finish: function(data){
  // 回答内容をデータとして記録（jsPsychが自動でdata.responseに保存します）
  // 必要ならconsoleにも表示
  console.log("outro1:", data.response);
  // 追加でjsPsych.data.writeも可能
  jsPsych.data.write(data.response);
  }
}

var outro2 = {
  timeline: [
    {
      type: jsPsychSurveyLikert,
      preamble: `<p>日常生活における、あなたの行動や経験についてお伺いします。<br>以下の文について、あなた自身にどれくらい当てはまるかを選んでください。</p>`,
      questions: [
        {
          prompt: "ネットショッピングをする際は、たいてい、今見ている商品にそこそこ満足していても、他にもっと良い商品がないかチェックする。",
          name: "MS1",
          labels: ["1 全くあてはまらない","2 あてはまらない","3 あまりあてはまらない","4 どちらともいえない","5 ややあてはまる","6 あてはまる","7 とてもあてはまる"],
          required: true
        }
      ],
      button_label: "次へ"
    },
    {
      type: jsPsychSurveyLikert,
      questions: [
        {
          prompt: "私は人間関係を服のように扱っています。ぴったり合うものを見つけるまで、たくさん試すのが当然だと思う。",
          name: "MS2",
          labels: ["1 全くあてはまらない","2 あてはまらない","3 あまりあてはまらない","4 どちらともいえない","5 ややあてはまる","6 あてはまる","7 とてもあてはまる"],
          required: true
        }
      ],
      button_label: "次へ"
    },
    {
      type: jsPsychSurveyLikert,
      questions: [
        {
          prompt: "今の仕事にどれだけ満足していても、もっと良い機会を探すのは当然のことだ。",
          name: "MS3",
          labels: ["1 全くあてはまらない","2 あてはまらない","3 あまりあてはまらない","4 どちらともいえない","5 ややあてはまる","6 あてはまる","7 とてもあてはまる"],
          required: true
        }
      ],
      button_label: "次へ"
    },
    {
      type: jsPsychSurveyLikert,
      questions: [
        {
          prompt: "友人へのプレゼント選びは、たいていの場合難しいと感じる。",
          name: "MS4",
          labels: ["1 全くあてはまらない","2 あてはまらない","3 あまりあてはまらない","4 どちらともいえない","5 ややあてはまる","6 あてはまる","7 とてもあてはまる"],
          required: true
        }
      ],
      button_label: "次へ"
    },
    {
      type: jsPsychSurveyLikert,
      questions: [
        {
          prompt: "買い物をするとき、本当に気に入る服を見つけるのが難しい。",
          name: "MS5",
          labels: ["1 全くあてはまらない","2 あてはまらない","3 あまりあてはまらない","4 どちらともいえない","5 ややあてはまる","6 あてはまる","7 とてもあてはまる"],
          required: true
        }
      ],
      button_label: "次へ"
    },
    {
      type: jsPsychSurveyLikert,
      questions: [
        {
          prompt: "レストランでメニューを選ぶのは本当に難しい。いつも一番良いものを選ぼうと苦戦する。",
          name: "MS6",
          labels: ["1 全くあてはまらない","2 あてはまらない","3 あまりあてはまらない","4 どちらともいえない","5 ややあてはまる","6 あてはまる","7 とてもあてはまる"],
          required: true
        }
      ],
      button_label: "次へ"
    },
    {
      type: jsPsychSurveyLikert,
      questions: [
        {
          prompt: "どんなことをするにも、自分に対して非常に高い基準を持っている。",
          name: "MS7",
          labels: ["1 全くあてはまらない","2 あてはまらない","3 あまりあてはまらない","4 どちらともいえない","5 ややあてはまる","6 あてはまる","7 とてもあてはまる"],
          required: true
        }
      ],
      button_label: "次へ"
    },
    {
      type: jsPsychSurveyLikert,
      questions: [
        {
          prompt: "私は決して二番目で満足することはない。",
          name: "MS8",
          labels: ["1 全くあてはまらない","2 あてはまらない","3 あまりあてはまらない","4 どちらともいえない","5 ややあてはまる","6 あてはまる","7 とてもあてはまる"],
          required: true
        }
      ],
      button_label: "次へ"
    },
    {
      type: jsPsychHtmlButtonResponse,
      stimulus: "<h3>これで実験は終了です。<br>ご協力ありがとうございました。</h3>",
      choices: ['終了'],
      //データ送信関数呼び出し
      on_finish: function(){
      sendDataToServer();
  }
    }
  ],
  on_finish: function(data){
  // 回答内容をデータとして記録（jsPsychが自動でdata.responseに保存します）
  // 必要ならconsoleにも表示
  console.log("outro2:", data.response);
  // 追加でjsPsych.data.writeも可能
  jsPsych.data.write(data.response)
  }
}