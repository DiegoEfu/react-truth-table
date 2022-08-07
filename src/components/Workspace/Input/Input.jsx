import { TextField, Grid, Button } from '@mui/material';
import React, {useState} from 'react';
import Results from './Results';

const logicOperators = ['∧', '∨', '¬', '→', '↔', '⊻'];
const isLogicalOperator = (c) => logicOperators.indexOf(c) !== -1;

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

    const checkCorrectness = (formula) => { // Parsing
        // Spaces must be eliminated first.
        formula = formula.replaceAll(/\s/g, "");

        // Then a array containing all characters will be made.
        formula = formula.split("");

        // Different variables will be identified and then their table will be made.
        const vars = makeTableForVars([...new Set(formula.filter(x => x.match(/[a-zA-Z]/)).sort())]);
        setVariables({...vars});
        console.log(vars);

        const checkIfVar = (c) => Object.keys(vars).indexOf(c) !== -1;
        const checkIfClosed = (c) => c === ')';
        const checkIfOpen = (c) => c === '(';

        const checkParenthesesCorrectness = (formula) => {
            let stack = [];

            for(let i = 0; i < formula.length; i++){
                let c = formula[i];

                if(c === '(')
                    stack.push(c);
                else if(c === ')' && stack.length !== 0)
                    stack.pop();
                else if(c === ')')
                    return false;
            }

            return stack.length === 0;
        };

        const checkSymbolCorrectness = (formula) => {
            let invalidChars = [];

            for(let i = 0; i < formula.length; i++){
                const succ = formula[i + 1];
                const pred = formula[i - 1];
                if(logicOperators.indexOf(formula[i]) !== -1){
                    console.log(formula[i]);
                    if(formula[i] === '¬'){
                        if((checkIfVar(succ) || checkIfOpen(succ)) && !(checkIfVar(pred)))
                            continue;
                    }                        
                    else{
                        console.log((checkIfVar(succ) || checkIfOpen(succ) || succ === '¬'));
                        if((checkIfVar(succ) || checkIfOpen(succ) || succ === '¬') && (checkIfVar(pred) || checkIfClosed(pred)))
                            continue;
                    }
                        
                }
                else if(((checkIfVar(formula[i]) || checkIfOpen(formula[i])) && !checkIfVar(pred)) || checkIfClosed(formula[i]))
                    continue;

                invalidChars.push(formula[i]);
                console.log(invalidChars);
            }

            return invalidChars.length === 0;
        };

        const changeSymbols = (formula) => {
            formula = formula.join("");
            
            formula = formula.replace(/<->/g, '↔');
            formula = formula.replace(/->|⇒|⊃/g, '→');
            formula = formula.replace(/\|\|/g, '∨');
            formula = formula.replace(/&&|\^/g, '∧');
            formula = formula.replace(/!/g, '¬');
            formula = formula.replace(/¬¬/g, '');
            formula = formula.split("");

            for(let i = 0; i < formula.length; i++)
            {
                if(checkIfOpen(formula[i]) && checkIfVar(formula[i+1]) && checkIfClosed(formula[i+2])){
                    formula = [...formula.slice(0,i), ...formula.slice(i+1,i+2), ...formula.slice(i+3)];
                    console.log(formula);
                    i += 2;
                }
            }

            return formula;
        };
        console.log(formula);        
        formula = changeSymbols(formula);
        console.log(formula);    
        setCorrect(checkParenthesesCorrectness(formula) && checkSymbolCorrectness(formula) && Object.keys(vars).length > 0);
        setInput(formula);
        setResults({});
    }

    const checkHighestPrecedence = (exp) => {
        const precedences = {'∧': 1, '∨': 3, '→': 4, '↔': 5, '⊻': 2};
        let inParentheses = 0;
        let precedence = -1;
        for(let i = 0; i < exp.length; i++){ // Find all symbols with their precedence
            const currentSymbol = exp[i];
            if(currentSymbol === '(')
                inParentheses++;
            else if(currentSymbol === ')')
                inParentheses--;
            else if(!inParentheses && isLogicalOperator(currentSymbol) && currentSymbol !== '¬')
                precedence = precedence < precedences[currentSymbol] ? i : precedence;
        }
        return precedence;
    };

    const countSymbols = (exp) => {
        let count = 0, inParentheses = 0;
        for(let i = 0; i < exp.length; i++){ // Find all symbols with their precedence
            const currentSymbol = exp[i];
            if(currentSymbol === '(')
                inParentheses++;
            else if(currentSymbol === ')')
                inParentheses--;
            else if(!inParentheses && isLogicalOperator(currentSymbol)  && currentSymbol !== '¬')
                count++;
        }
        return count;
    };

    const evaluate = (exp, acc) => {
        const results = [];
        const arr = exp;
        const openParentheses = [];
        const closeParentheses = {};
        console.log(exp.join(""));
        const highestPrecedence = checkHighestPrecedence(arr);

        if(arr[highestPrecedence] !== '¬' && countSymbols(arr) >= 2){
             arr.splice(highestPrecedence, 0, ')');
             arr.splice(highestPrecedence+2,0, '(')
             arr.push(')');
             arr.unshift('(');
        }

        console.log(arr.join(""));
        if(exp.length > 2){ // Subexpression checking
            const openI = [];

            for(let i = 0; i < arr.length; i++){ // Check subexpressions.
                console.log(arr[i]);
                if(arr[i] === '¬' && arr[i+1] === '('){ // If it has negation+parentheses body.
                    openParentheses.push(i+1);
                    openI.push(i+1);
                    i += 1;
                } // If it has negation + variable body.
                else if(arr[i] === '¬' && Object.keys(variables).indexOf(arr[i+1]) !== -1 && exp.join("") !== arr[i] + arr[i+1]){
                    acc = {...acc, ...evaluate(arr.join("").substring(i, i+2).split(""), acc)};
                } // If it's a start of a parentheses.
                else if(arr[i] === '('){
                    openParentheses.push(i);
                    openI.push(i);
                } // If it's the end of a parentheses.
                else if(arr[i] === ')'){
                    const index = openI.pop() + 1;
                    let subexp = arr.join("").substring(index, i).split("");
                    closeParentheses[index - 1] = i;
                    if(Object.keys(acc).indexOf(subexp.join("")) !== -1) // If the subexpression exists, do nothing.
                        continue;
                    else 
                    {
                        acc = {...acc, ...evaluate(subexp, acc)};
                        console.log(subexp.join(""));
                        console.log(acc);

                        if(arr[index - 2] === '¬')
                            if(acc[subexp.join("")] === undefined)
                                continue;
                            else
                                acc = {...acc, ...evaluate(('¬(' + subexp.join("") + ')').split(""), acc)};
                                
                    }
                }
            }
        }

        console.log(exp.join(""));
        console.log(closeParentheses);
        console.log(acc);

        if(exp.length > 1)
            for(let i = 0; i < arr.length; i++){ // Evaluation
                let inParentheses = 0;
                if(logicOperators.indexOf(arr[i]) !== -1){ // If it's a logical operator

                    if(inParentheses) // If it's inside a subexpression, skip.
                        continue;
                    else{ // Else, evaluate.
                        // standard cases: (negation with variable and simple operations)
                        if(arr[i] === '¬' && Object.keys(variables).indexOf(arr[i+1]) !== -1 && Object.keys(acc).indexOf('¬'+arr[i+1]) !== -1)
                            continue;

                        const left = arr[i-1] === ')' ? acc[arr.join("").substring(openParentheses.shift() + 1, i-1)]
                        : arr[i-2] === '¬' ? acc['¬' + arr[i-1]] : variables[arr[i-1]];                

                        const right = arr[i+1] === '(' ? acc[arr.join("").substring(i + 2, closeParentheses[i+1])]
                        : (arr[i+1] === '¬' ? (Object.keys(variables).indexOf(arr[i+2]) !== -1 ? acc[arr.join("").substring(i+1, i+3)] 
                        : acc['¬(' + arr.join("").substring(i + 3, closeParentheses[i+2]) + ')']) : variables[arr[i+1]]);                        

                        console.log(arr[i]);
                        console.log(right);
                        console.log(left);
                        console.log(acc);

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
                        
                            default:
                                alert("An error occurred.");
                            break;
                        }
                        break;
                    }
                }
                else if(arr[i] === '(')
                    inParentheses++;
                else if(arr[i] === ')')
                    inParentheses--;
            }
        else // rare case: only one variable in the formula
            results.push(...variables[exp[0]]);
        console.log(exp.join(""));
        console.log(results);

        if(results.length > 0)
            return {...acc, [exp.join("")]: results};
        else // rare case: all the expression between parentheses
            return {...acc}
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