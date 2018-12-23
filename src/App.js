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
    return Array.from(props.cards).map(entry =>
        (
            <li className="card" key={entry[0]} onClick={props.show}>
            <div className="title">{ entry[0] }</div>
            <div className="question">{ entry[1]['question'] ? entry[1]['question'] : '(blank)' }</div>
            <div className="answer">{ entry[1]['answer'] }</div>
            </li>
        )
    );
}


class Entry extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: props.title ? props.title : '',
            question: props.question ? props.question : '',
            answer: props.answer ? props.answer : '',
            addCard: props.addCard,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            [name]: value,
        });
    }

    handleSave(event) {
        const title = this.state.title;
        const q = this.state.question;
        const a = this.state.answer;
        this.state.addCard(title, { "question": q, "answer": a } );
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSave}>
            <label name="title">Title:</label> <textarea name="title" className="title" onChange={this.handleChange} value={this.state.title}/>
            <label name="question">Question:</label> <textarea name="question" className="question" onChange={this.handleChange} value={this.state.question}/>
            <label name="answer">Answer:</label> <textarea name="answer" className="answer" onChange={this.handleChange} value={this.state.answer}/>
            <input type="submit"/>
            </form>
        );
    }
}

function getStorageCards() {
    return new Map(Object.keys(localStorage).filter(k => k.startsWith("card_")).map(k => [k.slice("card_".length), JSON.parse(localStorage[k])] ));
}

class App extends Component {
    constructor(props) {
        super(props);
        let cards =  getStorageCards();
        this.state = {
            mode: 'review',
            cards: cards,
        };
        this.addCard = this.addCard.bind(this);
    }

    componentDidMount() {
        this.switchMode();
    }

    handleSubmit(event) {
        console.log(event);
        event.preventDefault();
    }

    addCard(title, card) {
        console.log("adding card: ", title);
        // I sort of assume thata this will serialize out correctly but I'm not
        // 100% sure, I worry about setState being async and interacting with
        // reading this.state directly
        localStorage.setItem("card_" + title, JSON.stringify(card));

        let cards = new Map(this.state.cards);
        cards.set(title, card);

        this.setState({
            cards: cards
        })
    }

    show(event) {
        event.currentTarget.querySelector(".answer").style.display = 'block';
    }

    switchMode() {
        if (this.state.mode === "enter") {
            this.setState({
                mode: "review",
                cards: this.state.cards,
                contents: <ol>
                    <Cards cards={this.state.cards} show={this.show}/>
                </ol>,
            })
        } else {
            this.setState({
                mode: "enter",
                cards: this.state.cards,
                contents: <Entry OnClick={this.handleSubmit} addCard={this.addCard}/>,
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
