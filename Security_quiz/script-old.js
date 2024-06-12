document.addEventListener('DOMContentLoaded', () => {
    const questionContainer = document.getElementById('question-container');
    const answersContainer = document.getElementById('answers-container');
    const nextButton = document.getElementById('next-button');
    const noteContainer = document.getElementById('note-container');

    //クイズデータの初期化
    let currentQuestionIndex = 0;
    let quizData = [];

    //jsonファイルからクイズデータの取得
    fetch('data/quiz.json')
        .then(response => response.json())
        .then(data => {
            quizData = data.quiz;
            showQuestion();
        })
        .catch(error => console.error('Error fetching quiz data:', error));

    //クイズの表示
    function showQuestion() {
        if (currentQuestionIndex < quizData.length) {
            const currentQuestion = quizData[currentQuestionIndex];
            questionContainer.innerText = currentQuestion.question;
            //答えの選択肢と注意書きを初期化
            answersContainer.innerHTML = '';
            noteContainer.innerText = '';
            noteContainer.style.display = 'none';

            //選択肢の表示
            currentQuestion.answers.forEach((answer, index) => {
                const button = document.createElement('button');
                button.classList.add(index === 0 ? 'leftBtn' : 'rightBtn');
                const span = document.createElement('span');
                span.classList.add('answerOp');
                span.innerText = answer.option;
                button.appendChild(span);
                button.addEventListener('click', () => selectAnswer(answer, currentQuestion.note, button));
                answersContainer.appendChild(button);
            });

        } else {
            //クイズが終了した場合
            questionContainer.innerText = 'クイズ完了！';
            questionContainer.style.marginTop = '25%';
            answersContainer.innerHTML = '';
            nextButton.style.display = 'none';
            noteContainer.style.display = 'none';
        }
    }

    //点数のカウント
    //未実装
    let wrongCount = 0;

    //一つの問題に対して一度しか回答できないようにするためのフラグ
    let hasAnswerBeenSelected = false;　//フラグの初期化

    function selectAnswer(answer, note, button) {

        if (hasAnswerBeenSelected) return; //フラグが立っている場合は処理を終了

        //まるばつを表示する処理
        const buttons = document.querySelectorAll('button.rightBtn, button.leftBtn');
        const correctIndicator = document.createElement('span');

        // ボタンをクリックしたら0.5秒後に背景画像を削除
        buttons.forEach(button => {
            button.style.border = 'solid 2px #867ba9';
            setTimeout(() => {
                button.style.background = 'none';
            }, 200);
        });

        //代わりに○×を表示
        correctIndicator.classList.toggle('maruBatsu');
        setTimeout(() => {
            correctIndicator.innerText = answer.correct ? '○' : '×';
        }, 300);
        button.appendChild(correctIndicator);

        //注意書きと次ボタンを表示
        noteContainer.style.display = '';
        noteContainer.innerText = note;
        nextButton.style.display = 'block';

        hasAnswerBeenSelected = true; //フラグを更新
    }

    //次の問題へ
    nextButton.addEventListener('click', () => {
        console.log('Next button clicked');
        currentQuestionIndex++;
        showQuestion();
        nextButton.style.display = 'none';
        hasAnswerBeenSelected = false; //フラグをリセット
    });

    //カーソルを指定画像に変更
    const cursor = document.querySelector('.cursor');
    document.addEventListener('mousemove', e => {
        cursor.setAttribute('style', 'top: ' + (e.pageY - 60) + 'px; left: ' + (e.pageX - 60) + 'px;'); //カーソルの位置をマウスの位置に合わせる
    });
});
