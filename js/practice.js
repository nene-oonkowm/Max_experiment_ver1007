// practice.js
// ====== practice フェーズ =====

const practice_intro = {
  type: jsPsychInstructions,
  pages: [
// Practice0（練習開始）
    `<div style="text-align:center; max-width:750px; margin:auto; line-height:1.0;">
      <h2>これから練習を開始します</h2>
      <p>練習では、実験と同じ流れを3ラウンド分のみ繰り返します。</p>
      <p>練習では、他の参加者はコンピュータが担当します。</p>
      <p>これは練習ですので、獲得するカードの価値は報酬に反映されません。</p>
      <p>練習中に分からないことがあれば、zoomのQ&A機能で実験者にお知らせください。</p>
      <p>準備ができたら、「次へ」ボタンをクリックしてください。</p>
    </div>`,
  ],
  show_clickable_nav: true,
  allow_backward: false,
  button_label_previous: '戻る',
  button_label_next: '次へ',
  
};

// 練習フェーズの作成
function createPractice(jsPsych) {
  if (!document.getElementById('practice-global-style')) {
    const style = document.createElement('style');
    style.id = 'practice-global-style';
    // 共通スタイルを定義（survey.jsにも影響）
    style.innerHTML = `
      body {
        padding: 0 0 40px 0 !important; margin: 0 auto !important; max-width: 10000px; background: #fff;
      }
      .jspsych-content { 
        padding: 40px 32px !important; margin: auto !important; max-width: 1000px; border-radius: 16px; background: #fff; position: relative;   /*ズレ防止*/
      }
      .card-grid {
        display: flex; flex-direction: row; justify-content: center; align-items: stretch; gap: 12px; margin: 24px 0; 
      }
      .choice-card {
        width: 75px;
        height: 100px;
        margin: 0 2px 10px 0;
        border: 2px solid #888;
        border-radius: 12px;
        background: #fff;
        font-size: 1.2em;
        font-weight: bold;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        position: relative;
      }
    `;
    document.head.appendChild(style);
  }

  // 練習用トライアルの作成
  var cards = [
  { label: "A", value: 550, revealed: false, available: true },
  { label: "B", value: 450, revealed: false, available: true },
  { label: "C", value: 350, revealed: false, available: true },
  { label: "D", value: 600, revealed: false, available: true },
  { label: "E", value: 500, revealed: false, available: true },
  { label: "F", value: 350, revealed: false, available: true },
  { label: "G", value: 650, revealed: false, available: true },
  { label: "H", value: 300, revealed: false, available: true },
  { label: "I", value: 700, revealed: false, available: true },
  { label: "J", value: 400, revealed: false, available: true }
];

  //--------ROUND 1(カード10枚、はい強制)----------------------------------------------------------------------------
  //Practice1 選択
  function getChoiceTrial1() {
    return {
      type: jsPsychHtmlButtonResponse,
      stimulus: `
        <h3>練習　ラウンド1</h3>
        <p>10枚のカードから選んでください。</p>
        <div class="card-grid"></div>
      `,
      choices: cards
        .map(c => c.available ? (c.revealed ? `${c.label}：${c.value}円` : `${c.label}`) : "")
        .filter(label => label !== null),
      on_finish: function(data){
        let remain = cards.map((c, i) => c.available ? i : null).filter(i => i !== null);
        console.log("remain:", remain);
        let chosenIndex = remain[data.response];
        if (typeof chosenIndex === "undefined" || !cards[chosenIndex]) {
          console.error("chosenIndexが不正です", remain, data.response, chosenIndex);
          return;
        }
        cards[chosenIndex].revealed = true;
        jsPsych.data.write({chosen: chosenIndex});

      },
      button_html: '<button class="choice-card">%choice%</button>',
      on_load: function() {
        console.log(jsPsych.data.get().values());
        const btns = document.querySelectorAll('.choice-card');
        btns.forEach((btn, i) => {
          if (!cards[i].available) {
            btn.disabled = true;
            btn.style.background = "#fff";
            btn.style.border = "2px solid #fff";
            btn.style.color = "#fff";
            btn.style.cursor = "default";
          }
        });
      }
    };
  }

//　Practice2 決定１
  var decisionTrial1 = {
    type: jsPsychHtmlButtonResponse,
    stimulus: function(){
      var last_choice = jsPsych.data.get().last(1).values()[0].chosen;
      var value = cards[last_choice];
      let html = `<p>${cards[last_choice].label} の価値は <b>${value.value}円</b> です。</p>`;
      html += `<div style="display:flex;flex-direction:row;justify-content:center;align-items:flex-end;gap:12px;margin:24px 0;">`;
      for(let i=0; i<cards.length; i++){
        html += `
          <button
            class="choice-card"
            style="
              width:75px;height:100px;
              border:${i === last_choice ? '4px' : '2px'} solid ${i === last_choice ? '#e91e63' : '#888'};
              border-radius:12px;
              color:#000;
              font-size:1.1em;font-weight:bold;
              display:flex;flex-direction:column;justify-content:center;align-items:center;
              box-sizing:border-box;
            "
            disabled
          >
            <span>${cards[i].label}</span>
            <span style="font-size:0.9em;">
              ${cards[i].revealed ? `${cards[i].value}円` : ""}
            </span>
          </button>
        `;
      }
      html += `</div>`;
      html += `
        <p>このカードに決定しますか？</p>
        <p style="font-size:0.8em;">練習として、ここでは「いいえ」を選択してください</p>
      `;
      return html;
    },
    choices: ["はい", "いいえ"],
    button_html: [
      '<button class="jspsych-btn" disabled>%choice%</button>', // はいボタン無効
      '<button class="jspsych-btn">%choice%</button>'
    ],
    on_finish: function(data){
      data.decision = 1; // 強制的に「いいえ」
    }
  };  

// Practice3 結果１
  var resultTrial1 = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<p>再選択のため、次のラウンドに移ります。</p>`,
    choices: ["次へ"]
  };


//--------ROUND 2(カード8枚、いいえ強制)-------------------------------------------------------------------------------
  function getChoiceTrial2() {

//　Practice4 選択２
    return {
      type: jsPsychHtmlButtonResponse,
      on_start: function() {
        let remain = cards.map((c, i) => c.available ? i : null).filter(i => i !== null);
        if(remain.length >= 2){
          // シャッフルして先頭2つを消失
          for(let i = remain.length - 1; i > 0; i--){
            const j = Math.floor(Math.random() * (i + 1));
            [remain[i], remain[j]] = [remain[j], remain[i]];
          }
          cards[remain[0]].available = false;
          cards[remain[1]].available = false;
          console.log("消失したカード:", cards[remain[0]].label, cards[remain[1]].label);

        }
        const trials = jsPsych.data.get().filter({chosen: true}).values();
        if (trials.length > 0) {
          const last_choice = trials[trials.length - 1].chosen;
          revealed[last_choice] = true;
        }
      },
      stimulus: function(){
        return `
          <h3>練習　ラウンド2</h3>
          <p>8枚のカードから選んでください。</p>
          <div class="card-grid"></div>
        `;
      },
      choices: function() {
        return cards.map((c, i) => {
          if (c.available) {
            return `<span>${c.label}</span><span style="font-size:0.8em;">${c.revealed ? `${c.value}円` : "&nbsp;"}</span>`;
          } else {
            return c.revealed ? `<span>${c.label}</span><span style="font-size:0.9em;">${c.value}円</span>` : "";
          }
        });
      },
      on_finish: function(data){
        let remain = cards.map((c, i) => c.available ? i : null).filter(i => i !== null);
        let chosenIndex = data.response;
        console.log("remain:", remain);
        cards[chosenIndex].available = false;
        cards[chosenIndex].revealed = true;
        jsPsych.data.write({chosen: chosenIndex});
      },
      button_html: '<button class="choice-card">%choice%</button>',
      on_load: function() {
        console.log(jsPsych.data.get().values());
        const btns = document.querySelectorAll('.choice-card');
        btns.forEach((btn, i) => {
          if (!cards[i].available) {
            btn.disabled = true;
            btn.style.background = "#fff";
            btn.style.border = "2px solid #fff";
            btn.style.color = "#fff";
            btn.style.cursor = "default";
          }
          if (cards[i].revealed) {
            btn.innerHTML = `${cards[i].label}<br><span style="font-size:0.9em;">${cards[i].value}円</span>`;
          }
        });
      }
    };
  }

// Practice5 決定2
  var decisionTrial2 = {
    type: jsPsychHtmlButtonResponse,
    stimulus: function(){
      var last_choice = jsPsych.data.get().last(1).values()[0].chosen;
      let html = `<p>${cards[last_choice].label} の価値は <b>${cards[last_choice].value}円</b> です。</p>`;
      html += `<div style="display:flex;flex-direction:row;justify-content:center;align-items:flex-end;gap:12px;margin:24px 0;">`;
      for(let i=0; i<cards.length; i++){
        if (!cards[i].available && i !== last_choice) { //空白ボタン
          html += `
            <button
              class="choice-card"
              style="
                width:75px;height:100px;
                border:2px solid #fff;
                border-radius:12px;
                background:#fff;
                color:#fff;
                font-size:1.1em;font-weight:bold;
                display:flex;flex-direction:column;justify-content:center;align-items:center;
                box-sizing:border-box;
              "
              disabled
            >
              <span>&nbsp;</span>
              <span style="font-size:0.9em;">&nbsp;</span>
            </button>
          `;
          continue;
        } // 通常ボタン
        html += `
          <button
            class="choice-card"
            style="
              width:75px;height:100px;
              border:${i === last_choice ? '4px' : '2px'} solid ${i === last_choice ? '#e91e63' : '#888'};
              border-radius:12px;
              background:${cards[i].revealed ? '#fff' : '#fff'};
              color:#000;
              font-size:1.1em;font-weight:bold;
              display:flex;flex-direction:column;justify-content:center;align-items:center;
              box-sizing:border-box;
            "
            disabled
          >
            <span>${cards[i].label}</span>
            <span style="font-size:0.9em;">
              ${cards[i].revealed ? `${cards[i].value}円` : ""}
            </span>
          </button>
        `;
      }
      html += `</div>`;
      html += `
        <p>このカードに決定しますか？</p>
        <p style="font-size:0.8em;">練習として、ここでは「はい」を選択してください</p>
      `;
      return html;
    },
    choices: ["はい", "いいえ"],
    button_html: [
      '<button class="jspsych-btn">%choice%</button>', // はいボタン有効
      '<button class="jspsych-btn" disabled>%choice%</button>' // いいえボタン無効
    ],
    on_finish: function(data){
      data.decision = 0; // 強制的に「はい」
    }
  };
// Practice6 結果2
  var resultTrial2 = {
    type: jsPsychHtmlButtonResponse,
    stimulus: function(){
      var last_choice = jsPsych.data.get().last(2).values()[0].chosen;
      return `<p>あなたが選んだカードは他の参加者に獲得されました。次のラウンドに移ります。</p>`;
    },
    choices: ["次へ"]
  };

//--------ROUND 3(カード7枚、はい強制)---------------------------------------------------------------
// Practice7 選択3
  function getChoiceTrial3() {
    return {
      type: jsPsychHtmlButtonResponse,
      stimulus: `
        <h3>練習　ラウンド3</h3>
        <p>7枚のカードから選んでください。</p>
        <div class="card-grid"></div>
      `,
      on_start: function() {
        const trials = jsPsych.data.get().filter({chosen: true}).values();
          if (trials.length > 0) {
            const last_choice = trials[trials.length - 1].chosen;
            cards[last_choice].available = false;
          }
      },
      choices: function() {
        return cards.map((c, i) => {
          if (c.available) {
            return c.revealed ? `${c.label}：${c.value}円` : `${c.label}`;
          } else {
            return c.revealed ? `${c.label}：${c.value}円` : "";
          }
        });
      },
      
      on_finish: function(data){
        let chosenIndex = data.response;
        cards[chosenIndex].revealed = true;
        jsPsych.data.write({chosen: chosenIndex});
      },
      on_load: function() {
        const btns = document.querySelectorAll('.choice-card');
        btns.forEach((btn, i) => {
          if (!cards[i].available) {
            btn.disabled = true;
            btn.style.background = "#fff";
            btn.style.border = "2px solid #fff";
            btn.style.color = "#fff";
            btn.style.cursor = "default";
          }
          if (cards[i].revealed) {
            btn.innerHTML = `${cards[i].label}<br><span style="font-size:0.9em;">${cards[i].value}円</span>`;
          }
        });
      },
      button_html: '<button class="choice-card">%choice%</button>',
    };
  }
// Practice8 決定3
  var decisionTrial3 = {
    type: jsPsychHtmlButtonResponse,
    stimulus: function(){
      var last_choice = jsPsych.data.get().last(1).values()[0].chosen;
      var value = cards[last_choice].value;
      let html = `<p>${cards[last_choice].label} の価値は <b>${value}円</b> です。</p>`;
      html += `<div style="display:flex;flex-direction:row;justify-content:center;align-items:flex-end;gap:12px;margin:24px 0;">`;
      for(let i=0; i<cards.length; i++){
        if (!cards[i].available && i !== last_choice) {
          // 空白ボタン
          html += `
            <button
              class="choice-card"
              style="
                width:75px;height:100px;
                border:2px solid #fff;
                border-radius:12px;
                background:#fff;
                color:#fff;
                font-size:1.1em;font-weight:bold;
                display:flex;flex-direction:column;justify-content:center;align-items:center;
                box-sizing:border-box;
              "
              disabled
            >
              <span>&nbsp;</span>
              <span style="font-size:0.9em;">&nbsp;</span>
            </button>
          `;
          continue;
        }
        html += `
          <button
            class="choice-card"
            style="
              width:75px;height:100px;
              border:${i === last_choice ? '4px' : '2px'} solid ${i === last_choice ? '#e91e63' : '#888'};
              border-radius:12px;
              background:${cards[i].revealed ? '#fff' : '#fff'};
              color:#000;
              font-size:1.1em;font-weight:bold;
              display:flex;flex-direction:column;justify-content:center;align-items:center;
              box-sizing:border-box;
            "
            disabled
          >
            <span>${cards[i].label}</span>
            <span style="font-size:0.9em;">
              ${cards[i].revealed ? `${cards[i].value}円` : ""}
            </span>
          </button>
        `;
      }
      html += `</div>`;
      html += `<p>このカードに決定しますか？</p>
              <p style="font-size:0.8em;">練習として、ここでは「はい」を選択してください</p>`;
      return html;
    },
    choices: ["はい", "いいえ"],
    button_html: [
      '<button class="jspsych-btn">%choice%</button>', 
      '<button class="jspsych-btn" disabled>%choice%</button>'
    ],
    on_finish: function(data){
      data.decision = 0; // 「はい」
    }
  };
// Practice9 結果3
  var resultTrial3 = {
    type: jsPsychHtmlButtonResponse,
    stimulus: function(){
      var last_choice = jsPsych.data.get().last(2).values()[0].chosen
      return `<p>おめでとうございます！${cards[last_choice].label}のカード（${cards[last_choice].value}円）を獲得しました！</p>`;
    },
    choices: ["次へ"]
  };

  const waitTrial = {
    type: jsPsychHtmlButtonResponse,
    stimulus: "<p>実験者の合図があるまで、何も触らずにお待ちください。<br>他の参加者を待っています。</p>",
    choices: ["このボタンは押さないでください"],
    button_html: '<button class="jspsych-btn" style="background:#e53935; color:#fff;">%choice%</button>',
  };


// 練習フェーズ全体
  return {
    timeline: [
      getChoiceTrial1(),
      decisionTrial1,
      resultTrial1,
      getChoiceTrial2(),
      decisionTrial2,
      resultTrial2,
      getChoiceTrial3(),
      decisionTrial3,
      //practice11 チュートリアル終了
      resultTrial3,
      {
        type: jsPsychHtmlButtonResponse,
        stimulus: "<h3>練習は以上です。</h3><p>本番と同じ流れを体験できましたか？</p><p>分からないことがあれば、zoomのQ&A機能で実験者にお知らせください。</p><p>準備ができたら、「次へ」ボタンをクリックしてください。</p>",
        choices: ["次へ"]
      },
      waitTrial
    ],
      
  };


}