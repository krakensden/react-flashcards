import React, { Component } from 'react';
import './App.css';

/*
 * So there are two modes (tabs for v0), "enter flashcard", "practice flashcards".
 * A flashcard has a question and an answer field
 * Flashcards are a list of objects in localstorage
 * Practice goes through the list in order, asking questions. Answering is on the honor system.
 * Tap once, get a Q. Tap again, get the answer. Tap again, next Q.
 */

function Cards(props) {
    return props.cards.map((step, card) => {
        return (
            <li key={step}>
            { card['question'] ? card['question'] : '(blank)' }
            </li>
        );
    }
    );
}

function Entry(props) {
    return (
        <form>
        <label name="title">Title:</label> <textarea class="title"></textarea>
        <label name="question">Question:</label> <textarea class="question"></textarea>
        <label name="answer">Answer:</label> <textarea class="answer"></textarea>
        <input type="submit" onClick={props.OnClick}/>
        </form>
    );
}

class App extends Component {
    constructor(props) {
        super(props);
        let cards = [];
        if (localStorage.hasOwnProperty("flashcards")) {
            cards = localStorage["flashcards"].slice();
        }
        this.state = {
            mode: 'review',
            cards: cards,
        };
        this.switchMode();
    }

    switchMode() {
        if (this.state.mode === "enter") {
            this.setState({
                mode: "review",
                cards: this.state.cards,
                contents: <ol>
                    <Cards cards={this.state.cards}/>
                </ol>,
            })
        } else {
            this.setState({
                mode: "enter",
                cards: this.state.cards,
                contents: <Entry cards={this.state.cards}/>,
            })
        }
    }

    render() {
        return (
            <div className="App">
            <nav>
             <h1>{this.state.mode} <button onClick={()=>{this.switchMode()}}>switch</button></h1>
            </nav>
            {this.state.contents}
            </div>
        );
    }
}

export default App;
