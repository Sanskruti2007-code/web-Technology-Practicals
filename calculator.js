let display = document.getElementById("display");

let numbers = document.querySelectorAll(".number");
let operators = document.querySelectorAll(".operator");

numbers.forEach(function(button) {
    button.addEventListener("click", function() {
        display.value += button.innerText;
    });
});

operators.forEach(function(button) {
    button.addEventListener("click", function() {
        display.value += button.innerText;
    });
});

document.getElementById("clear").addEventListener("click", function() {
    display.value = "";
});

document.getElementById("equal").addEventListener("click", function() {
    try {
        display.value = eval(display.value);
    } catch {
        display.value = "Error";
    }
});

document.addEventListener("keydown", function(event) {

    if (
        (event.key >= "0" && event.key <= "9") ||
        event.key == "+" ||
        event.key == "-" ||
        event.key == "*" ||
        event.key == "/"
    ) {
        display.value += event.key;
    }

    else if (event.key == "Enter") {
        try {
            display.value = eval(display.value);
        } catch {
            display.value = "Error";
        }
    }

    else if (event.key == "Escape") {
        display.value = "";
    }
});