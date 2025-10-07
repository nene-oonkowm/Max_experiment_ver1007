// main.js (timeline結合用)
const jsPsych = initJsPsych();

const timeline = [
  {
    type: jsPsychHtmlButtonResponse,
    stimulus: '実験を開始します',
    choices: ['OK']
  },
  {
    //全画面表示指定（ただし）zoomの機能に触れなくなるので注意  
    type: jsPsychFullscreen,
    fullscreen_mode: true,
    message: "<p>これから実験を始めます。<br>全画面表示に切り替えますので、ボタンを押してください。</p>",
    button_label: "全画面にする",
    allow_exit: false // ← これで「ESCキーなどで解除できない」ようにする
  }
];

// 各フェーズを追加
timeline.push(intro1);
timeline.push(intro2);
timeline.push(intro3_id);
timeline.push(intro4);
timeline.push(practice_intro);
timeline.push(createPractice(jsPsych));
timeline.push(survey_intro)
timeline.push(createSurvey(jsPsych));
timeline.push(outro);
timeline.push(outro2);

// 実行
jsPsych.run(timeline);

// 実験終了時などにIDとデータをまとめて送信(とりあえず入れといてみる)
function sendDataToServer() {
  const allData = jsPsych.data.get().json();
  const payload = {
    id: window.participantID, // intro.jsで保存したIDを参照
    data: allData
  };
  fetch('/save', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload)
  }).then(res => {
    alert("データ送信が完了しました");
  });
}