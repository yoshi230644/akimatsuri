document.addEventListener('DOMContentLoaded', () => {
    const questionContainer = document.getElementById('question-container');
    const answersContainer = document.getElementById('answers-container');
    const nextButton = document.getElementById('next-button');
    const noteContainer = document.getElementById('note-container');
    const cursor = document.querySelector('.cursor');

    let currentQuestionIndex = 0;
    let quizData = [];
    let hasAnswerBeenSelected = false;
    let score = 60; //初期の点数

    fetchQuizData();

    //シャッフル用の関数
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    //データの取得
    function fetchQuizData() {
        fetch('data/quiz.json')
            .then(response => response.json())
            .then(data => {
                quizData = shuffle(data.quiz);
                showQuestion();
            })
            .catch(error => console.error('Error fetching quiz data:', error));
    }

    //クイズの進行度に応じて問題表示するか終了表示するかを切り替える
    function showQuestion() {
        if (currentQuestionIndex < quizData.length) {
            const currentQuestion = quizData[currentQuestionIndex];
            displayQuestion(currentQuestion);
            displayAnswers(currentQuestion);
        } else {
            displayQuizCompletion();
        }
    }

    //問題の表示
    function displayQuestion(question) {
        questionContainer.innerText = question.question;
        answersContainer.innerHTML = '';
        noteContainer.innerText = '';
        noteContainer.style.display = 'none';
    }

    //選択肢をセット
    function displayAnswers(question) {
        const shuffledAnswers = shuffle([...question.answers]); //スプレッド構文で配列をコピー
        // const shuffledAnswers = shuffle(question.answers);
        shuffledAnswers.forEach((answer, index) => {
            const button = createAnswerButton(answer, index, question.note);
            answersContainer.appendChild(button);
        });
    }

    //左右のボタンによってスタイルを変更
    function createAnswerButton(answer, index, note) {
        const button = document.createElement('button');
        button.classList.add(index === 0 ? 'leftBtn' : 'rightBtn');
        button.innerHTML = `<span class="answerOp">${answer.option}</span>`;
        button.addEventListener('click', () => selectAnswer(answer, note, button));
        return button;
    }

    //回答の選択
    function selectAnswer(answer, note, button) {
        //一問に対して一度しか回答できないようにする
        if (hasAnswerBeenSelected) return;

        //間違ったら点数を減らす
        if (!answer.correct) {
            score -= 10;
        }
        console.log(score);

        displayAnswerFeedback(answer, button);
        displayNoteAndNextButton(note);
        hasAnswerBeenSelected = true;
    }

    //回答の正誤表示
    function displayAnswerFeedback(answer, button) {
        //的の背景を消す
        const buttons = document.querySelectorAll('button.rightBtn, button.leftBtn');
        buttons.forEach(btn => {
            btn.style.border = 'solid 2px #867ba9';
            btn.style.animation = 'none';
            setTimeout(() => btn.style.background = 'none', 150);
        });
        //マルバツ表示
        const correctIndicator = document.createElement('span');
        if (answer.correct) {
            correctIndicator.classList.toggle('maru', true);
        } else {
            correctIndicator.classList.toggle('batsu', true);
        }
        setTimeout(() => correctIndicator.innerText = answer.correct ? '○' : '×', 150);
        button.appendChild(correctIndicator);
    }

    //注意書きと次のボタンの表示
    function displayNoteAndNextButton(note) {
        if (note) {
            noteContainer.style.display = 'flex';
            noteContainer.innerText = note;
        } else {
            noteContainer.style.display = 'none';
        }
        nextButton.style.display = 'block';
    }

    //クイズ完了の表示
    function displayQuizCompletion() {
        questionContainer.innerText = `クイズ完了！\nあなたのスコア: ${score}点`;
        questionContainer.style.marginTop = '25%';
        answersContainer.innerHTML = '';
        nextButton.style.display = 'none';
        noteContainer.style.display = 'none';
    }

    //次の問題へ
    nextButton.addEventListener('click', () => {
        currentQuestionIndex++;
        showQuestion();
        nextButton.style.display = 'none';
        hasAnswerBeenSelected = false;
    });

    //カーソルの表示変更
    document.addEventListener('mousemove', e => {
        cursor.setAttribute('style', `top: ${e.pageY - 60}px; left: ${e.pageX - 60}px;`);
    });
});
