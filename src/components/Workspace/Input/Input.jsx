import { TextField, Grid, Button } from '@mui/material';
import React, {useState} from 'react';

const logicOperators = ['∧', '∨', '¬', '→', '↔', '⊻', '⊼', '⊽']

const Input = () => {

    const [correct, setCorrect] = useState(false);
    const [input, setInput] = useState("");
    const [disStyle, setDisStyle] = useState({});
    const [variables, setVariables] = useState({});

    const makeTableForVar = (k, n) => {
        let ac = [];
        let v = false;
        for(let i = 0; i < n; i++){
            if(i % k === 0)
                v = !v;
            
            ac.push(v);
        }
        return ac;
    }

    const makeTableForVars = (vars) => {
        let ac = {};
        for(let i = vars.length - 1; i >= 0; i--){
            ac[vars[i]] = makeTableForVar(2**i, 2**vars.length);
        }
        return ac;
    };

    const checkCorrectness = (formula) => {
        // Spaces must be eliminated first.
        formula = formula.replaceAll(/\s/g, "");

        // Then a array containing all characters will be made.
        formula = formula.split("");

        // Different variables will be identified and then their table will be made.
        const vars = makeTableForVars([...new Set(formula.filter(x => x.match(/[a-zA-Z]/)).sort())]);
        setVariables({...vars});
        console.log(vars);

        const checkParenthesesCorrectness = (formula) => {
            let stack = [];

            formula.map((c) => {
                if(c === '(')
                    stack.push(c);
                else if(c === ')')
                    stack.pop();
            });

            return stack.length === 0;
        };

        const checkSymbolCorrectness = (formula) => {
            let invalidChars = [];

            const checkIfVar = (c) => Object.keys(vars).indexOf(c) !== -1 || c === ')';
            const checkIfClosed = (c) => c === ')';
            const checkIfOpen = (c) => c === '(';

            for(let i = 0; i < formula.length; i++){
                if(logicOperators.indexOf(formula[i]) !== -1){
                    if(formula[i] === '¬'){
                        if(checkIfVar(formula[i+1]) || checkIfOpen(formula[i+1]))
                            continue;
                    }
                    else{
                        const succ = formula[i + 1];
                        const pred = formula[i - 1];

                        if((checkIfVar(succ) || checkIfOpen(succ)) && (checkIfVar(pred) || checkIfClosed(pred)))
                            continue;

                            console.log("SIMBOlO INVALIDO");
                    }
                }
                else if(checkIfVar(formula[i]) || checkIfOpen(formula[i]) || checkIfClosed(formula[i]))
                    continue;

                invalidChars.push(formula[i]);
            }

            return invalidChars.length === 0;
        };

        setCorrect(checkParenthesesCorrectness(formula) && checkSymbolCorrectness(formula) && Object.keys(vars).length > 0);
        setInput(formula);
        if(!correct)
            setDisStyle({background: "#BBB"});
        else
            setDisStyle({background: "blue"})
    }

    const evaluate = (exp, acc) => {
        const results = [];
        const arr = exp;
        const openParentheses = [];
        const closeParentheses = [];

        for(let i = 0; i < arr.length; i++){ // Check subexpressions in openParentheses.
            if(arr[i] === '¬' && arr[i+1] === '('){
                openParentheses.push(i);
                i += 2;
                continue;
            }
            else if(arr[i] === '('){
                openParentheses.push(i);
                continue;
            }
            else if(arr[i] === ')'){
                const subexp = arr.join("").substring(openParentheses[openParentheses.length - 1] + 1, i).split("");
                console.log(subexp)
                if(Object.keys(acc).indexOf(subexp) !== -1)
                    continue;
                else
                    acc = {...acc, ...evaluate(subexp, acc)}; 

                closeParentheses.push(i);
            }
        }
        console.log(openParentheses + " " + closeParentheses)

        for(let i = 0; i < arr.length; i++){ // Evaluation
            let open = 0, close = 0;
            if(logicOperators.indexOf(arr[i]) !== -1){
                open = openParentheses[0];
                close = closeParentheses[0];
                console.log(open + " " + close)

                if(i >= open && i <= close)
                    continue;
                else{
                    
                    const left = arr[i-1] === ')' ? acc[arr.join("").substring(openParentheses.shift() + 1, closeParentheses.shift())]
                    : variables[arr[i-1]];

                    const right = arr[i+1] === '(' ? acc[arr.join("").substring(openParentheses.shift() + 1, closeParentheses.shift())]
                    : variables[arr[i+1]];

                    console.log(left);
                    console.log(right);

                    switch (arr[i]) {
                        case '∧': // Conjunction
                            for(let i = 0; i < left.length; i++)
                                results.push(left[i] && right[i]);                                                    
                        break;
                        
                        case '∨': // Disjunction
                            for(let i = 0; i < left.length; i++)
                                results.push(left[i] || right[i]);       
                        break;

                        case '¬': // Negation
                            for(let i = 0; i < right.length; i++)
                                results.push(!right[i]);
                        break;

                        case '→': // Implication
                            for(let i = 0; i < left.length; i++)
                                results.push(!left[i] || (left[i] && right[i]))
                        break;

                        case '↔': // Equivalence
                            for(let i = 0; i < left.length; i++)
                                results.push(left[i] === right[i]);
                        break;

                        case '⊻': // Exclusice disjunction
                            for(let i = 0; i < left.length; i++)
                                results.push((left[i] && !right[i]) || (right[i] && !left[i]));
                        break;

                        case '⊼': // NAND
                            for(let i = 0; i < left.length; i++)
                                results.push(!(left[i] && right[i]));
                        break;

                        case '⊽': // NOR
                            for(let i = 0; i < left.length; i++)
                                results.push(!(left[i] || right[i]));                            
                        break;
                    
                        default:
                            alert("An error occurred.");
                        break;
                    }
                
                    break;
                }
            }
        }

        console.log(results);

        return {[exp.join("")]: results, ...acc};
    };

    const generateTables = () => {
        const result = evaluate(input, {});
        console.log(result);
    };

    return (
        <Grid container style={{background: '#66CDAA', paddingTop: '15px', paddingBottom: '15px'}}>
            <Grid item xs={1} />
            <Grid item xs={9}>
                <TextField placeholder='Introduce your formalized formula.' fullWidth 
                    variant='filled' style={{background: "white"}} label="Input"
                    onChange={(e) => {checkCorrectness(e.target.value)}} />
            </Grid>
            <Grid item md={1} style={{display: "flex", flexDirection:"row-reverse"}}>
                <Button fullWidth variant='contained' disabled={!correct} onClick={generateTables}>Submit</Button>
            </Grid>
        </Grid>
    );
};

export default Input;