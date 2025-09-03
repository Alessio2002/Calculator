import "./App.css";
import { useState } from "react";

const App = () => {
  const [counter, setCounter] = useState(0);
  const [calcInput, setCalcInput] = useState("");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleCalcClick = (value) => {
    setCalcInput(calcInput + value);
  };

  const handleCalcClear = () => {
    setCalcInput("");
  };

  const handleCalcEvaluate = () => {
    try {
      let expression = calcInput
        .replace(/PI/g, "Math.PI")
        .replace(/E/g, "Math.E")
        .replace(/sin/g, "Math.sin")
        .replace(/cos/g, "Math.cos")
        .replace(/tan/g, "Math.tan")
        .replace(/log/g, "Math.log")
        .replace(/√/g, "Math.sqrt")
        .replace(/\^/g, "**");

      expression = parsePercentages(expression);

      const result = eval(expression);
      setCalcInput(String(result));
      setHistory((prev) => [...prev, { expression: calcInput, result }]);
    } catch {
      setCalcInput("Error");
    }
  };

  const parsePercentages = (expr) => {
    return expr
      .replace(
        /(\d+)([\+\-\*\/])\s*(\d+)%/g,
        (match, base, operator, percent) => {
          return `${base}${operator}(${base}*${percent}/100)`;
        }
      )
      .replace(/(\d+)%/g, "($1/100)");
  };

  // General rounding to decimals (optional)
  const handleRoundDecimals = (decimals = 5) => {
    try {
      const currentNumber = Number(calcInput);

      if (!isNaN(currentNumber)) {
        const factor = 10 ** decimals;
        const rounded = Math.round(currentNumber * factor) / factor;
        setCalcInput(String(rounded));
        setHistory((prev) => [
          ...prev,
          { expression: `round(${calcInput}, ${decimals})`, result: rounded },
        ]);
      } else {
        let expression = calcInput
          .replace(/PI/g, "Math.PI")
          .replace(/E/g, "Math.E")
          .replace(/sin/g, "Math.sin")
          .replace(/cos/g, "Math.cos")
          .replace(/tan/g, "Math.tan")
          .replace(/log/g, "Math.log")
          .replace(/√/g, "Math.sqrt")
          .replace(/\^/g, "**");

        const evaluated = eval(expression);

        if (typeof evaluated === "number" && !isNaN(evaluated)) {
          const factor = 10 ** decimals;
          const rounded = Math.round(evaluated * factor) / factor;
          setCalcInput(String(rounded));
          setHistory((prev) => [
            ...prev,
            { expression: `round(${calcInput}, ${decimals})`, result: rounded },
          ]);
        } else {
          setCalcInput("Error");
        }
      }
    } catch {
      setCalcInput("Error");
    }
  };

  // Helper for custom rounding based on second decimal digit
  const customRoundNearestDecimal = (num) => {
    const str = num.toFixed(2);
    const [, decPart] = str.split(".");
    const secondDecDigit = Number(decPart[1]);

    if (secondDecDigit > 5) {
      return Math.ceil(num * 10) / 10;
    } else if (secondDecDigit === 5) {
      return Number(str);
    } else {
      return Math.floor(num * 10) / 10;
    }
  };

  // Custom rounding handler
  const handleRoundCustom = () => {
    try {
      let expression = calcInput
        .replace(/PI/g, "Math.PI")
        .replace(/E/g, "Math.E")
        .replace(/sin/g, "Math.sin")
        .replace(/cos/g, "Math.cos")
        .replace(/tan/g, "Math.tan")
        .replace(/log/g, "Math.log")
        .replace(/√/g, "Math.sqrt")
        .replace(/\^/g, "**");

      const evaluated = eval(expression);

      if (typeof evaluated === "number" && !isNaN(evaluated)) {
        const rounded = customRoundNearestDecimal(evaluated);

        const formatted =
          rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(2);

        setCalcInput(formatted);
        setHistory((prev) => [
          ...prev,
          { expression: `customRound(${calcInput})`, result: formatted },
        ]);
      } else {
        setCalcInput("Error");
      }
    } catch {
      setCalcInput("Error");
    }
  };

  return (
    <div>
      {/* Counter */}
      <h1>Stress buttons</h1>
      <div className="button">
        <p>{counter}</p>
        <button onClick={() => setCounter(counter + 1)}>1</button>
        <button onClick={() => setCounter(0)}>C</button>
        <button onClick={() => setCounter(counter - 1)}>-1</button>
      </div>

      <hr />

      {/* Calculator */}
      <h1>Calculator</h1>
      <div className="calculator">
        <input
          className="display"
          type="text"
          value={calcInput}
          onChange={(e) => setCalcInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleCalcEvaluate();
          }}
          placeholder="0"
        />

        <div className="buttons">
          {/* Row 1 */}
          <button onClick={() => handleCalcClick("1")}>1</button>
          <button onClick={() => handleCalcClick("2")}>2</button>
          <button onClick={() => handleCalcClick("3")}>3</button>
          <button onClick={() => handleCalcClick("/")}>÷</button>

          {/* Row 2 */}
          <button onClick={() => handleCalcClick("4")}>4</button>
          <button onClick={() => handleCalcClick("5")}>5</button>
          <button onClick={() => handleCalcClick("6")}>6</button>
          <button onClick={() => handleCalcClick("*")}>×</button>

          {/* Row 3 */}
          <button onClick={() => handleCalcClick("7")}>7</button>
          <button onClick={() => handleCalcClick("8")}>8</button>
          <button onClick={() => handleCalcClick("9")}>9</button>
          <button onClick={() => handleCalcClick("-")}>-</button>

          {/* Row 4 */}
          <button onClick={() => handleCalcClick(".")}>.</button>
          <button onClick={() => handleCalcClick("0")}>0</button>
          {/* Removed Clear and Plus buttons from here */}
          <button
            className="back"
            onClick={() => setCalcInput(calcInput.slice(0, -1))}
          >
            ←
          </button>

          {/* Round buttons */}
          <button className="round" onClick={handleRoundCustom}>
            (nearest decimal)
          </button>
          <button className="round-5" onClick={() => handleRoundDecimals(5)}>
            ≈
          </button>
          <button className="equal" onClick={handleCalcEvaluate}>
            =
          </button>
        </div>

        {/* Moved Clear and Plus buttons here */}
        <div className="special-buttons">
          <button className="clear" onClick={handleCalcClear}>
            C
          </button>
          <button className="plus" onClick={() => handleCalcClick("+")}>
            +
          </button>
        </div>

        {/* Extra controls */}
        <h1>Extra controls</h1>
        <div className="extra-buttons">
          <button
            className="func"
            onClick={() => {
              if (calcInput.startsWith("-")) {
                setCalcInput(calcInput.slice(1));
              } else {
                setCalcInput("-" + calcInput);
              }
            }}
          >
            +/-
          </button>
          <button className="func" onClick={() => handleCalcClick("(")}>
            (
          </button>
          <button className="func" onClick={() => handleCalcClick(")")}>
            )
          </button>
          <button className="func" onClick={() => handleCalcClick("%")}>
            %
          </button>
          <button className="func" onClick={() => handleCalcClick("**")}>
            ^
          </button>
          <button className="func" onClick={() => handleCalcClick("√")}>
            √
          </button>
          <button className="func" onClick={() => handleCalcClick("log")}>
            log
          </button>
          <button className="func" onClick={() => handleCalcClick("sin")}>
            sin
          </button>
          <button className="func" onClick={() => handleCalcClick("cos")}>
            cos
          </button>
          <button className="func" onClick={() => handleCalcClick("tan")}>
            tan
          </button>
          <button className="func" onClick={() => handleCalcClick("PI")}>
            π
          </button>
          <button className="func" onClick={() => handleCalcClick("E")}>
            e
          </button>
        </div>
      </div>

      {/* History toggle */}
      <button
        className="toggle-history"
        onClick={() => setShowHistory(!showHistory)}
        style={{ marginTop: 20 }}
      >
        {showHistory ? "Hide History" : "Show History"}
      </button>

      {/* History Tab */}
      {showHistory && (
        <div className="history-tab">
          <h2>Calculation History</h2>
          <ul>
            {history.length === 0 && <li>No history yet</li>}
            {history.map((item, index) => (
              <li key={index}>
                {item.expression} = {item.result}
              </li>
            ))}
          </ul>
          <button onClick={() => setHistory([])}>Clear History</button>
        </div>
      )}
    </div>
  );
};

export default App;
