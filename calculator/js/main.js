const initApp = () => {
  const currentValueElem = document.querySelector(".currentValue");
  const previousValueElem = document.querySelector(".previousValue");
  let itemArray = [];
  const equationArray = [];
  let newNumberFlag = false;

  const inputButtons = document.querySelectorAll(".number");
  inputButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const newInput = event.target.textContent;
      if (newNumberFlag) {
        currentValueElem.value = newInput;
        newNumberFlag = false;
      } else {
        currentValueElem.value =
          currentValueElem.value == 0
            ? newInput
            : currentValueElem.value + newInput;
      }
    });
  });

  const equalsButton = document.querySelector(".equals");
  equalsButton.addEventListener("click", () => {
    const currentVal = currentValueElem.value;
    let equationObj;
    //pressing equals repeatedly
    if (!itemArray.length && equationArray.length) {
      const lastEquation = equationArray[equationArray.length - 1];
      equationObj = {
        num1: parseFloat(currentVal),
        num2: lastEquation.num2,
        op: lastEquation.op,
      };
    } else if (!itemArray.length) {
      return currentVal;
    } else {
      itemArray.push(currentVal);
      equationObj = {
        num1: parseFloat(itemArray[0]),
        num2: parseFloat(currentVal),
        op: itemArray[1],
      };
    }

    equationArray.push(equationObj);
    const equationString =
      equationObj["num1"] + equationObj["op"] + equationObj["num2"];

    calculate(equationString, currentValueElem);
    previousValueElem.textContent = equationString;

    newNumberFlag = true;
    itemArray = [];
    console.log(equationArray);
  });

  const clearButtons = document.querySelectorAll(".clear, .clearEntry");
  clearButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      currentValueElem.value = 0;
      if (event.target.classList.contains("clear")) {
        previousValueElem.textContent = "";
        itemArray = [];
      }
    });
  });

  const deleteButton = document.querySelector(".delete");
  deleteButton.addEventListener("click", () => {
    currentValueElem.value = currentValueElem.value.slice(0, -1);
  });

  const singChangeButton = document.querySelector(".singChange");
  singChangeButton.addEventListener("click", () => {
    currentValueElem.value = parseFloat(currentValueElem.value) * -1;
  });

  const opButtons = document.querySelectorAll(".operator");
  opButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      //equals sing showing
      if (newNumberFlag) {
        previousValueElem.textContent = "";
        itemArray = [];
      }

      const newOperator = event.target.textContent;
      const currentVal = currentValueElem.value;

      //need number
      if (!itemArray.length && currentVal == 0) return;

      //begin new equation
      if (!itemArray.length) {
        itemArray.push(currentVal, newOperator);
        previousValueElem.textContent = currentVal + newOperator;
        return (newNumberFlag = true);
      }

      //complete equation
      if (itemArray.length) {
        itemArray.push(currentVal);

        const equationObj = {
          num1: parseFloat(itemArray[0]),
          num2: parseFloat(currentVal),
          op: itemArray[1],
        };

        equationArray.push(equationObj);
        const equationString =
          equationObj["num1"] + equationObj["op"] + equationObj["num2"];

        const newValue = calculate(equationString, currentValueElem);

        previousValueElem.textContent = newValue + newOperator;

        //start new equation
        itemArray = [newValue, newOperator];
        newNumberFlag = true;
        console.log(equationArray);
      }
    });
  });
};

document.addEventListener("DOMContentLoaded", initApp);

const calculate = (equation, currentValueElem) => {
  const regex = /(^[*/=])|(\s)/g;
  equation.replace(regex, "");
  const divByZero = /(\0)/.test(equation);
  if (divByZero) return (currentValueElem.value = 0);
  return (currentValueElem.value = eval(equation));
};
