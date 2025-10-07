// survey.js

const survey_intro = {
  type: jsPsychInstructions,
  pages: [
// Practice0（練習開始）
    `<div style="text-align:center; max-width:750px; margin:auto; line-height:1.0;">
      <h2>実験を開始します</h2>
      <p>これから、実験を開始します。</p>
      <p>実験では、実際の他の参加者とカードの取り合いが行われます。</p>
      <p>この実験で得た報酬は、実際の報酬に反映されます。</p>
      <p>実験中に分からないことがあれば、zoomのQ&A機能で実験者にお知らせください。</p>
      <p>準備ができたら、「次へ」ボタンをクリックしてください。</p>
    </div>`,
  ],
  show_clickable_nav: true,
  allow_backward: false,
  button_label_previous: '戻る',
  button_label_next: '次へ',
  
};




function createSurvey(jsPsych) {


  // 報酬生成
  function randn_bm() {
    let u = 0, v = 0;
    while(u === 0) u = Math.random();
    while(v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }
  function generateNormalRewards(n = 10, mean = 500, sd = 200, min = 0, max = 1000) {
    let rewards = [];
    while(rewards.length < n) {
      let value = Math.round((randn_bm() * sd + mean) / 50) * 50;
      value = Math.max(min, Math.min(max, value));
      rewards.push(value);
    }
    return rewards;
  }
  var values = generateNormalRewards();
  var labels = ["A","B","C","D","E","F","G","H","I","J"]; 
  var cards = labels.map((label, i) => ({
  label: label,
  value: values[i],
  revealed: false,
  available: true
  }));
  console.log("Generated cards:", cards); // デバッグ用

  // 選択肢の価値（value）配列
  var choiceValues = cards.map(c => c.value);
  var available = cards.map(c => c.available); // 利用可能な選択肢  
  let roundNumber = 1; // ラウンド数管理用

  
  
  // survey1 選択肢表示
  function getChoiceTrial() {
    return {
      type: jsPsychHtmlButtonResponse,
      stimulus: function(){
        return`
        <h3>ラウンド${roundNumber}</h3>
        <p>${cards.filter(c => c.available).length}枚のカードから選んでください。</p>
      `},
      /*choices:cards
        .map(c => c.available ? (c.revealed ? `${c.label}：${c.value}円` : `${c.label}`) : "")
        .filter(label => label !== null),*/
      choices: function() {
        return cards.map((c, i) => {
          if (c.available) {
            return `<span>${c.label}</span><span style="font-size:0.8em;">${c.revealed ? `${c.value}円` : "&nbsp;"}</span>`;
          } else {
            return `<span style="color:#fff;">&nbsp;</span><span style="color:#fff;">&nbsp;</span>`;
          }
        });
      },
      on_finish: function(data){
        let remain = cards.map((c, i) => c.available ? i : null).filter(i => i !== null);
        console.log("remain:", remain);
        let chosenIndex = remain[data.response];
        
        cards[chosenIndex].revealed = true;
        jsPsych.data.write({chosen: chosenIndex});

      },
      /*button_html: '<button class="choice-card">%choice%</button>',*/
      button_html: function(trial, choice) {
        // 利用不可（真っ白）なら白枠、それ以外は灰色枠
        return cards.map((c, i) => {
          if (c.available) {
            return `<button class="choice-card" style="border:2px solid #888;">%choice%</button>`;
          } else {
            return `<button class="choice-card" style="border:2px solid #fff;">%choice%</button>`;
          }
        });
      },
      on_finish: function(data){
        let chosenIndex = data.response;
        cards[chosenIndex].revealed = true;
        jsPsych.data.write({chosen: chosenIndex});
        console.log("Chosen index:", chosenIndex, "Card:", cards[chosenIndex]); // デバッグ用
        roundNumber += 1; // ラウンド数をインクリメント
        const availableLabels = cards.filter(c => c.available).map(c => c.label);
        console.log("利用可能な選択肢:", availableLabels);
      }
    };
  }
      

  // survey2 意思決定＆エージェント競合判定
  var decisionTrial = {
    type: jsPsychHtmlButtonResponse,
    stimulus: function(){
      var last_choice = jsPsych.data.get().last(1).values()[0].chosen;
      let html = `<p>${cards[last_choice].label} の価値は <b>${cards[last_choice].value}円</b> です。</p>`;
      html += `<div style="display:flex;flex-direction:row;justify-content:center;align-items:flex-end;gap:12px;margin:24px 0;">`;
      for(let i=0; i<cards.length; i++){
        if (!cards[i].available /*&& i !== last_choice*/) {
          html += `
            <button class="choice-card" style="
              width:75px;height:100px;
              border:2px solid #fff;
              border-radius:12px;
              background:#fff;
              color:#fff;
              font-size:1.1em;font-weight:bold;
              display:flex;flex-direction:column;justify-content:center;align-items:center;
              box-sizing:border-box;
            " disabled>
              <span>&nbsp;</span>
              <span style="font-size:0.9em;">&nbsp;</span>
            </button>
          `;
          continue;
        }
        html += `
          <button class="choice-card" style="
            width:75px;height:100px;
            border:${i === last_choice ? '4px' : '2px'} solid ${i === last_choice ? '#e91e63' : '#888'};
            border-radius:12px;
            background:#fff;
            color:#000;
            font-size:1.1em;font-weight:bold;
            display:flex;flex-direction:column;justify-content:center;align-items:center;
            box-sizing:border-box;
            font-weight:${i === last_choice ? 'bold' : 'normal'};
          " disabled>
            <span>${cards[i].label}</span>
            <span style="font-size:0.9em;">
              ${cards[i].revealed ? `${cards[i].value}円` : ""}
            </span>
          </button>
        `;
      }
     
      html += `</div>`;
      html += `<p>このカードで決定しますか？</p>`;
      return html;
    },
    choices: ["はい", "いいえ"],
    on_finish: function(data){
      data.decision = parseInt(data.response); // 0=意思決定, 1=しない
      data.round = roundNumber;
      const last_choice_data = jsPsych.data.get().filter({trial_type: "html-button-response"}).last(2).values()[0];
      data.chosen = last_choice_data.chosen;
      // 追加でカード情報も保存したい場合
      if (typeof data.chosen !== "undefined" && cards[data.chosen]) {
        data.chosen_label = cards[data.chosen].label;
        data.chosen_value = cards[data.chosen].value;
      }
      data.phase = "decision";
      console.log("Decision:", data.decision, "Raw response:", data.response);
      console.log(jsPsych.data.get().last(1).values()[0]);  
    } 
  };

  // survey3 待機画面
  const waitTrial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function(){
      return `
        <p>他の参加者が考えています、そのままお待ちください。</p>
        <div style="display:flex;justify-content:center;align-items:center;margin-top:24px;">
          <div class="loader"></div>
        </div>
        <style>
          .loader {
            border: 8px solid #f3f3f3;
            border-top: 8px solid #72777aff;
            border-radius: 50%;
            width: 48px;
            height: 48px;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
        </style>
      `;
    },
    choices: "NO_KEYS",
    trial_duration: function() {
      // 5～20秒（5000～20000ミリ秒）のランダムな値を返す
      return Math.floor(Math.random() * (20000 - 5000 + 1)) + 5000;
    }
  };

  // 競合判定・獲得判定
  // エージェント管理用（グローバルで保持）
let agentAlive = Array(9).fill(true); // 9体のエージェントが生存

function agentDecisions() {
  let agentChoices = [];
  let agentDecisionsArr = [];
  for(let agent=0; agent<9; agent++) {
    if(!agentAlive[agent]) continue; // 獲得済みエージェントはスキップ
    let indices = cards.map((C, i) => cards[i].available ? i : null).filter(i => i !== null);
    let choice = indices[Math.floor(Math.random() * indices.length)];
    agentChoices.push(choice);
    let prob = cards[choice].value /1000;
    let decision = Math.random() < prob ? 1 : 0;
    agentDecisionsArr.push({agent, choice, decision});
  }
  return agentDecisionsArr;
}

//survey4 結果表示
var resultTrial = {
  type: jsPsychHtmlButtonResponse,
  stimulus: function(){
    var last_decision_data = jsPsych.data.get().filter({phase: "decision"}).last(1).values();
    if (last_decision_data.length < 1 || typeof last_decision_data[0].chosen === "undefined") {
      console.error("last_decision_dataが不正です", last_decision_data);
      return "<p>選択データが不足しています。やり直してください。</p>";
    }
    var last_choice = last_decision_data[0].chosen;
    var last_decision = last_decision_data[0].decision;
    if (typeof cards[last_choice] === "undefined") {
      console.error("cards配列のインデックスが不正です", last_choice, cards);
      return "<p>カードデータが不正です。やり直してください。</p>";
    }


    // 毎回エージェント意思決定
    let agents = agentDecisions();
    // 意思決定したエージェント一覧
    let agentWinners = agents.filter(c => c.decision === 1);
    console.log("Agent decisions:", agents);
    console.log("Agent winners:", agentWinners);
    // 参加者と同じカードを選び意思決定したエージェントのみをagentCompetitorとして抽出
    let agentCompetitor = agents.filter(c => c.choice === last_choice && c.decision === 1);
    console.log("Agent competitors:", agentCompetitor);

    // エージェントが獲得した場合、そのエージェントは減る
    agentWinners.forEach(c => { 
      agentAlive[c.agent] = false;
      cards[c.choice].available = false;
      console.log(`エージェント${c.agent + 1} が ${cards[c.choice].label}（${cards[c.choice].value}円）を獲得しました`); 
    });
    let agentWin = agentWinners.length > 0;// エージェントが意思決定した選択肢は消失
    if(agentWinners.length > 0){
      cards[last_choice].available = false;
    console.log(`カード${cards[last_choice].label}（${cards[last_choice].value}円）は利用不可になりました`);
    }

    // 参加者が「いいえ」の場合
    if(last_decision === 1) {
      return `<p>次のラウンドへ進みます。</p>`;
    }

    // 参加者が「はい」の場合
    let winner = "player";
    if(agentWinners.length > 0){
      // 参加者＋エージェントで抽選
      let total = agentCompetitor.length + 1;
      let rand = Math.floor(Math.random() * total); 
      winner = rand === 0 ? "player" : "agent";
    }

    if(winner === "agent"){
      return `<p>残念！このカードは他の参加者に獲得されました。<br>再選択してください。</p>`;
    }else{
      if (typeof cards[last_choice] === "undefined") {
        console.error("cards配列のインデックスが不正です", last_choice, cards);
        return "<p>カードデータが不正です。やり直してください。</p>";
      }else {

        return `<p>おめでとうございます！${cards[last_choice].label}のカード（${cards[last_choice].value}円）を獲得しました！</p>
        <p>あなたの実験報酬は <b style="color: red;">${cards[last_choice].value} 円</b>です。</p>
        <p>この後、アンケートに進みます。報酬のお支払いのためには、最後までの参加が必要です。</p>
        `;
      
}
    }
  },
  choices: ["次へ"],
  on_finish: function(data){}
};
  

  // ループ（参加者が獲得できるまで繰り返し）
  var choiceLoop = {
    timeline: [ 
      getChoiceTrial(), 
      decisionTrial,
      waitTrial,   
      resultTrial
    ],
    loop_function: function(data){
      var last_result = data.values().slice(-1)[0].stimulus;
      // 「おめでとうございます！」が含まれていれば終了
      return !last_result.includes("おめでとうございます！");
    }
  };

 
  return {
    timeline: [
      choiceLoop,
      {
        type: jsPsychHtmlButtonResponse,
        stimulus: "<p>あなたの報酬が確定しました！<br>次の画面へ進みます。</p>",
        choices: ["次へ"],
        button_html: '<button class="jspsych-btn">%choice%</button>',
        on_finish: function(data){}
      },
    ]
  };

}
