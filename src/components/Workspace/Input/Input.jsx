import { TextField, Grid, Button } from '@mui/material';
import React, {useState} from 'react';
import Results from './Results';

const logicOperators = ['∧', '∨', '¬', '→', '↔', '⊻', '⊼', '⊽'];

const Input = () => {

    const [correct, setCorrect] = useState(false);
    const [input, setInput] = useState("");
    const [variables, setVariables] = useState({});
    const [results, setResults] =  useState({});

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
                        if((checkIfVar(succ) || checkIfOpen(succ) || succ === '¬') && (checkIfVar(pred) || checkIfClosed(pred)))
                            continue;

                        console.log("SIMBOLO INVÁLIDO");
                    }
                }
                else if(checkIfVar(formula[i]) || checkIfOpen(formula[i]) || checkIfClosed(formula[i]))
                    continue;

                invalidChars.push(formula[i]);
                console.log(invalidChars);
            }

            return invalidChars.length === 0;
        };

        const changeSymbols = (formula) => {
            formula = formula.join("");
            formula = formula.replace(/->|⇒|⊃/g, '→');
            formula = formula.replace(/\|\|/g, '∨');
            formula = formula.replace(/&&|\^/g, '∧');
            formula = formula.replace(/!/g, '¬');
            formula = formula.replace(/<->/g, '↔');
            return formula.split("");
        };
        
        formula = changeSymbols(formula);
        setCorrect(checkParenthesesCorrectness(formula) && checkSymbolCorrectness(formula) && Object.keys(vars).length > 0);
        setInput(formula);
        setResults({});
    }

    const evaluate = (exp, acc) => {
        const results = [];
        const arr = exp;
        const openParentheses = [];
        const closeParentheses = [];

        console.log(exp.join(""));
        for(let i = 0; i < arr.length; i++){ // Check subexpressions.
            console.log(arr[i]);
            if(arr[i] === '¬' && arr[i+1] === '('){ // If it has negation+parentheses body.
                openParentheses.push(i+1);
                i += 1;
            } // If it has negation + variable body.
            else if(arr[i] === '¬' && Object.keys(variables).indexOf(arr[i+1]) !== -1 && exp.join("") !== arr[i] + arr[i+1]){
                acc = evaluate(arr.join("").substring(i, i+2).split(""), acc);
            } // If it's a start of a parentheses.
            else if(arr[i] === '('){
                openParentheses.push(i);
            } // If it's the end of a parentheses.
            else if(arr[i] === ')'){
                const subexp = arr.join("").substring(openParentheses[openParentheses.length - 1] + 1, i).split("");
                if(Object.keys(acc).indexOf(subexp.join("")) !== -1) // If the subexpression exists, do nothing.
                    continue;
                else 
                {
                    acc = {...acc, ...evaluate(subexp, acc)};
                    console.log("HEY");

                    if(arr[openParentheses[openParentheses.length - 1] - 1] === '¬')
                        acc = {...acc, ...evaluate(('¬(' + subexp.join("") + ')').split(""), acc)}
                }
                    
                closeParentheses.push(i);
            }
        }

        for(let i = 0; i < arr.length; i++){ // Evaluation
            let open = 0, close = 0;
            if(logicOperators.indexOf(arr[i]) !== -1){ // If it's a logical operator
                open = openParentheses[0] !== undefined ? openParentheses[0] : arr.length;
                close = closeParentheses[0] !== undefined ? closeParentheses[0] : 0;

                if(i >= open && i <= close) // If it's inside a subexpression, skip.
                    continue;
                else{ // Else, evaluate.
                    
                    // standard cases: (negation with variable and simple operations)
                    if(arr[i] === '¬' && Object.keys(variables).indexOf(arr[i+1]) !== -1 && Object.keys(acc).indexOf('¬'+arr[i+1]) !== -1)
                        continue;

                    const left = arr[i-1] === ')' ? acc[arr.join("").substring(openParentheses.shift() + 1, closeParentheses.shift())]
                    : arr[i-2] === '¬' ? acc['¬' + arr[i-1]] : variables[arr[i-1]];

                    const right = arr[i+1] === '(' ? acc[arr.join("").substring(openParentheses.shift() + 1, closeParentheses.shift())]
                    : (arr[i+1] === '¬' ? (Object.keys(variables).indexOf(arr[i+2]) !== -1 ? acc[arr.join("").substring(i+1, i+3)] 
                    : []) : variables[arr[i+1]]);
                    console.log(arr[i]);
                    console.log(right);
                    console.log(left);

                    switch (arr[i]) {
                        case '∧': // Conjunction
                            console.log("Conjunction " + arr[i]);
                            for(let i = 0; i < left.length; i++)
                                results.push(left[i] && right[i]);                                                    
                        break;
                        
                        case '∨': // Disjunction
                            console.log("Disjunction");
                            for(let i = 0; i < left.length; i++)
                                results.push(left[i] || right[i]);
                        break;

                        case '¬': // Negation
                            console.log("Negation");
                            for(let i = 0; i < right.length; i++)
                                results.push(!right[i]);
                        break;

                        case '→': // Implication
                            console.log("Implication");
                            for(let i = 0; i < left.length; i++)
                                results.push(!left[i] || (left[i] && right[i]))
                        break;

                        case '↔': // Equivalence
                            console.log("Equivalence"); 
                            for(let i = 0; i < left.length; i++)
                                results.push(left[i] === right[i]);
                        break;

                        case '⊻': // Exclusive disjunction
                            console.log("Exclusive disjunction");
                            for(let i = 0; i < left.length; i++)
                                results.push((left[i] && !right[i]) || (right[i] && !left[i]));
                        break;

                        case '⊼': // NAND
                            console.log("NAND");
                            for(let i = 0; i < left.length; i++)
                                results.push(!(left[i] && right[i]));
                        break;

                        case '⊽': // NOR
                            console.log("NOR");
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
        if(results !== [])
            return {[exp.join("")]: results, ...acc};
    };

    return (
        <>
            <Grid container style={{background: '#66CDAA', paddingTop: '15px', paddingBottom: '15px'}}>
                <Grid item xs={1} />
                <Grid item xs={9}>
                    <TextField placeholder='Introduce your formalized formula.' fullWidth 
                        variant='filled' style={{background: "white"}} label="Input"
                        onChange={(e) => {checkCorrectness(e.target.value)}} />
                </Grid>
                <Grid item md={1} style={{display: "flex", flexDirection:"row-reverse"}}>
                    <Button fullWidth variant='contained' disabled={!correct} onClick={() => {setResults(evaluate(input, {}))}}>Submit</Button>
                </Grid>
            </Grid>
            {Object.keys(results).length !== 0 ? (<Results formula={input.join("") }tables={results} variables={variables} />) : (<>NADA</>)}
        </>
    );
};

export default Input;