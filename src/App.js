
import './App.scss';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createStore } from "redux";
import { Provider, connect } from "react-redux";
import { faBackspace } from '@fortawesome/free-solid-svg-icons';

const Keys = [
      {
        keyTrigger: 'Delete',
        id: 'clear',
        operator: false,
        btn: 'AC'
      },
      {
        keyTrigger: 'Backspace',
        id: 'bkspace',
        operator: false,
        btn: 'C'
      },
      {
        keyTrigger: 'NumpadDivide',
        id: 'divide',
        operator: true,
        btn: '÷'
      },
      {
        keyTrigger: 'NumpadMultiply',
        id: 'multiply',
        operator: true,
        btn:'×'
      },
      {
        keyTrigger: 'Numpad7',
        id: 'seven',
        operator: false,
        btn: '7'
      },
      {
        keyTrigger: 'Numpad8',
        id: 'eight',
        operator: false,
        btn: '8'
      },
      {
        keyTrigger: 'Numpad9',
        id: 'nine',
        operator: false,
        btn: '9'
      },
      {
        keyTrigger: 'NumpadSubtract',
        id: 'subtract',
        operator: true,
        btn:'-'
      },
      {
        keyTrigger: 'Numpad4',
        id: 'four',
        operator: false,
        btn: '4'
      },
      {
        keyTrigger: 'Numpad5',
        id: 'five',
        operator: false,
        btn: '5'
      },
      {
        keyTrigger: 'Numpad6',
        id: 'six',
        operator: false,
        btn: '6'
      },
      {
        keyTrigger: 'NumpadAdd',
        id: 'add',
        operator: true,
        btn:'+'
      },
      {
        keyTrigger: 'Numpad1',
        id: 'one',
        operator: false,
        btn: '1'
      },
      {
        keyTrigger: 'Numpad2',
        id: 'two',
        operator: false,
        btn: '2'
      },
      {
        keyTrigger: 'Numpad3',
        id: 'three',
        operator: false,
        btn: '3'
      },
      {
        keyTrigger: 'NumpadEnter',
        id: 'equals',
        operator: false,
        btn:'='
      },
      {
        keyTrigger: 'Numpad0',
        id: 'zero',
        operator: false,
        btn: '0'
      },
      {
        keyTrigger: 'NumpadDecimal',
        id: 'decimal',
        operator: false,
        btn: '.'
      }
    ]
  

//redux
//action
const SET_INPUT = "SET_INPUT";
const SET_OUTPUT = "SET_OUTPUT";
const CLEAR_DIS = "CLEAR_DIS";
const BK_SPACE = "BK_SPACE";
const SHOW_MSG = "SHOW_MSG";
const SHOW_DIG = "SHOW_DIG";

const space = String.fromCharCode(160);

const setInput = val => {
    return {
        type: SET_INPUT,
        input: val
    };
};

const setOutput = val => {
    return {
        type: SET_OUTPUT,
        output: val
    };
};

const bkSpace = () => {
    return {
        type: BK_SPACE
    };
};

const clearDis = () => {
    return {
        type: CLEAR_DIS
    };
};

const showMsg = msg => {
    return {
        type: SHOW_MSG,
        output: msg
    };
};

const showDig = dig => {
    return {
        type: SHOW_DIG,
        output: dig
    };
};

//reducer
const CalReducer = ( state = defaultState, action) => {
    switch (action.type) {
        case SET_INPUT:
            return {
                ...state,
                input: action.input,
                expression: [...state.expression.slice(0), 
                    action.input].join("")
                    .replace(space, "")
                    .replace("×", "*").replace("÷", "/")
                    .replace(/([-+*/])0(\d)/g, "$1$2") //preventing multiple zeros after operators
                    .replace(/^0{2}|[-+*/][-]*0{2}/g, "0") //preventing multiple zeros at front
                    .replace(/\.{2}/g, ".") //preventing double decimals
                    .replace(/(([.]\d+)[.])(?!.*\1)/g, "$2") 
                                //preventing multiple decimals with numbers between
                    .replace(/[-]{2}/g,"+") //convert 2  negative to positive
                    .replace(/[-+*/]*([+*/][-]*)/g, "$1") //use only the last operator input
                };
        case SET_OUTPUT:
            return {
                ...state,
                output: action.output,
                expression: state.expression + "="
            };
        case BK_SPACE:
            return {
                ...state,
                expression: [...state.expression
                    .slice(0, state.expression.length-1)]
                    .join(""),
                output: [...state.expression
                    .slice(0, state.expression.length-1)]
                    .join("").replace(space, "")
                    .match(/([-]*\d*\.*\d*[-+*/]*$)(?!.*\1)/g) 
            };
        case CLEAR_DIS:
            return {
                ...state,
                output: "0",
                expression: [space] 
            };
        case SHOW_MSG:
            return {
                ...state,
                output: action.output
            };
        case SHOW_DIG:
            return {
                ...state,
                output: [...state.expression
                    .slice(0, state.expression.length-1), action.output]
                    .join("").replace(space, "").replace(/\.\./g,".")
                    .replace("×", "*").replace("÷", "/")
                    .match(/([-]*\d*\.*\d*[-+*/]*$)(?!.*\1)/g) 
                    //-ive lookahead to capture only the latest group 
            }; 
        default:
            return state;
    };
};

//store
const defaultState = {
    input: "", 
    output: "0", 
    expression: [space] 
};

const store = createStore(CalReducer); 

//react
//app
const App = () => {
    return (
        <Provider store={store}>
            <CalAppApp />
        </Provider>
    );
}

const Display = props => {
    return (
        <div className="display">
            <div id ="expression">
                {props.exp}
            </div>
            <div id="display">
                {props.val}
            </div>
        </div>
    );
};

const Button = props => {
    return (
        <div className={props.btnClass} id={props.btnId}
            onClick={props.onClick}
        >
            {props.btnTxt}
        </div>
    );
};

const Buttons = props => {
    return (
        <div className="buttons">
            {props.button.map((btnObj, i, btnArr) => (
                <Button key={btnArr[i].id}
                    btnClass={btnArr[i].operator ? 
                                "button operator" : "button"
                                }
                    btnId={btnArr[i].id}
                    btnTxt={btnArr[i].btn}
                    onClick={props.onClick}
                />
            ))}
        </div>
    );
};

class CalApp extends React.Component {
    componentDidMount() {
        document.addEventListener("keydown", this.handleKeyPress);
  /*      window.setInterval(()=> {
        let display = document.getElementById("display");
        let expression = document.getElementById("expression");
        display.scrollTop = display.scrollHeight;
        expression.scrollTop = expression.scrollHeight;
        }, 100); */
    };
    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyPress);
    };
    
    filter = key => {
        const {clearDis, setInput, bkSpace, expression, setOutput, showMsg, showDig, output} = this.props;
  
        let expLength = expression.length;  
        let oprRegex = /[-+*/]/g;
        let endOpr = /[-+*/=.]$|[-+*/][-]$/g;
        let keyreplacex = key.replace("×", "*").replace("÷", "/");

        const testRegex = (arr,regex,i) => regex.test(arr[expLength-i]);

        const chkChar = (arr,i,char) => arr[expLength-i] === char;
        
        let getAns = () => Math.round(1000000000000 * eval(expression.replace(endOpr,"")))/1000000000000;
        
        const chkOutput = () => {
            if (chkChar(expression,1,"=")) {
                clearDis();
            };
        };
        const chkOutputOpr = () =>  {
            if (chkChar(expression,1,"=")) {
                clearDis();
                showDig(output+key);
                setInput(getAns());
            };
        };

        switch (keyreplacex) {
            case "AC":
                clearDis();
                break;
            case "C":
                if (expLength > 1) {
                    bkSpace();
                    break;
                    } else 
                clearDis();
                break;
            case ".":
                if (!chkChar(output,1,".")) {
                    showDig(output+key);
                    showMsg((output+key)
                        .replace(/(([.]\d+)[.])(?!.*\1)/g, "$2")
                        .replace(/\.{2}/g,".")
                        .replace(/^[-+*/]*[-]*00/g),"0");
                };
                if (testRegex(expression,oprRegex,1)) {
                    showMsg(output+"0"+key);
                };
                if (chkChar(expression,1,"=")) {
                    clearDis();
                    setInput("0"+key);
                    showMsg("0"+key);
                };
                if ((expLength-1 === 0 && !testRegex(expression,/\d/g,1))
                    || testRegex(expression,/[-+*/]/g,1)){
                    setInput("0"+key);
                    break;
                    } else
                    setInput(key);
                break;
            case "-":
                showDig(output+key);
                showMsg(key);
                if(output[0] === "0") {
                    showMsg(key);
                };
                chkOutputOpr();
                if (expLength < 2){
                    setInput(key);
                    if (expression[0] === "-") {
                        clearDis();
                   };
                } else 
                if (chkChar(expression,1,".")) {
                    bkSpace();
                    setInput(key);
                    showMsg((output+key)
                        .replace(/\.([-+*/])/g,"$1"));
                }
                else  
                setInput (key);
                break;
            case "+":
            case "*":
            case "/":
                showDig(output+key);
                showMsg(keyreplacex);
                chkOutputOpr();
                if (!/\d/g.test(expression[0])) {
                    clearDis();
                    break;
                }; 
                setInput(key);
                break;
            case "=":
                if (expression[0] !== space) {
                    if (endOpr.test(expression)) {
                        bkSpace();
                        if (/\.\.$|\.\d$|[-+*/][-]$/g.test(expression)) {
                            bkSpace();
                        };
                    };
                    setOutput(getAns());
                };
                break;
            default:
                showMsg(output+key);
                chkOutput();
                if  (/^0/g.test(expression) && expLength < 2) {
                    bkSpace();
                }; 
                if (/(?:d*[-+*/]0)/g.test(expression) 
                    && chkChar(expression,1,"0")
                    && !/(?:0\.)/g.test(expression) ) {
                    bkSpace();
                };
                setInput(key);
                showDig(key);
                break;
        };
    };
    
    handleKeyPress = event => {
        for (let i in Keys) {
            if (event.code === Keys[i].keyTrigger) {
                let elem = document.getElementById(Keys[i].id);
                elem.classList.toggle("pressed-btn");
                setTimeout(() => elem.classList.toggle("pressed-btn"), 100);
                this.filter(Keys[i].btn);
                };
            };
    };

    handleClick = event => {
        for (let i in Keys) {
            if (event.target.id === Keys[i].id) {
                this.filter(Keys[i].btn);  
                };
            };
    };

    render () {
        const {output, expression} = this.props;
        return (
            <div className="calBody">
            <p>Autocorrect Calculator</p>
            <p>By Jackie Lam | 20 Jul 2021</p>
            <Display 
                exp={expression}
                val={output}
                />
            <Buttons button={Keys} onClick={this.handleClick}/>
            </div>
        );
    };
};

//react-redux
const mapStateToProps = state => {
    return {
        input: state.input,
        output: state.output,
        expression: state.expression
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setInput: val => dispatch(setInput(val)),
        setOutput: val => dispatch(setOutput(val)),
        clearDis: () => dispatch(clearDis()),
        bkSpace: () => dispatch(bkSpace()),
        showMsg: msg => dispatch(showMsg(msg)),
        showDig: dig => dispatch(showDig(dig))
    };
};
  
const CalAppApp = connect(mapStateToProps, mapDispatchToProps)(CalApp);

ReactDOM.render(<App />, document.getElementById("root"))
export default App;

 //     let validEqRegex = /^(?:(?:[-]*\d+(?:\.\d*)?|[-]*\d*\.\d+)(?:[-+*/]+(?:[-]*\d+(?:\.\d*)?|[-]*\d*\.\d+))*)?[-+*/]*$/g;
    /*  Defining the valid expression to make sure the equation contains only one decimal within any number groups
        ^                                       
        (?:
           (?:
               [-]*\d+					//possibly negative integer 
                    (?:\.\d*)?			//and optionally followed by decimal value
               |[-]*\d*\.\d+			//or possibly negative decimal value
           )
           (?: [-+/*]+					//number group after an operator
                   (?:
                       [-]*\d+(?:\.\d*)?		
                       |[-]*\d*\.\d+
                   )							
           )*							//0 or more occurence of a following number group
        )? 								//an optional sequence of the number groups
        [-+/*]*							//possibly ends with operators (for more number groups)
        $
    */  
