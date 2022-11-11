let uniqueValues = [];

function prec(c) {
	if (c === "&") {
		return 4;
	} else if (c === "|") {
		return 3;
	} else if (c === "-") {
		return 2;
	} else if (c === "~") {
		return 1;
	} else {
		return -1;
	}
}

const operations = ["&", "|", "-", "~", "(", ")"];

function infixToPostfix(s) {
	s = s.split(" ").join("");
	let st = []; // []
	let result = ""; // abc+-  ==== a - (b + c)

	for (let i = 0; i < s.length; i++) {
		let c = s[i];

		if (
			(c >= "a" && c <= "z") ||
			(c >= "A" && c <= "Z")) {
			result += c;
		} else if (c == "(") {
			st.push("(");
		} else if (c == ")") {
			while (st[st.length - 1] != "(") {
				result += st[st.length - 1];
				st.pop();
			}
			st.pop();
		} else { 
			while (st.length > 0 && prec(s[i]) <= prec(st[st.length - 1])) {
				result += st[st.length - 1];
				st.pop();
			}
			st.push(c);
		}
	}

	while (st.length > 0) {
		result += st[st.length - 1];
		st.pop();
	}

	return result;
}

function combos(num) {
	let arr = []


	var n = num,
	m = 1 << n;
	for (var i = 0; i < m; i++) {
		var s = i.toString(2); // convert to binary
		s = new Array(n + 1 - s.length).join('0') + s; // pad with zeroes
		let arr2 = []
		for (let i of s) {
			arr2.push(+i)
		}	
		
		arr.push(arr2)
	}


	return arr;
}

function withNumbers(str, obj) {
	let arr = []
	
	for (let i of str) {
		 if (i.toUpperCase() in obj) {
			if (i === i.toUpperCase()) {
				arr.push(obj[i])
			} else {
				arr.push((obj[i.toUpperCase()] + 1) % 2)
			}
		 } else {
			  arr.push(i)
		 }
	}
	
	return arr.join("");
}

const expression = document.querySelector(".expression")
const form = document.querySelector(".container");
const table = document.querySelector(".table");
let firstTr = document.querySelector(".first");

form.addEventListener("submit", (e) => {
	e.preventDefault()
	uniqueValues = []

	
	for (let i of expression.value.split(" ").join("").split("")) {
		if (!uniqueValues.includes(i) && !operations.includes(i)) {
			uniqueValues.push(i)
		}
	}

	let nums = [];

	uniqueValues.forEach((item, index) => {
		if (item === item.toLowerCase()) {
			nums.push(index);
		}
	})

	table.innerHTML = "";
	table.innerHTML += `
		<tr class="first"></tr>
	`;

	firstTr = document.querySelector(".first");

	for (let i of uniqueValues) {
		firstTr.innerHTML += `
			<td class="bold">${i}</td>
		`;
	}
	firstTr.innerHTML += `
		<td class="bold">Infix with numbers</td>
	`;
	firstTr.innerHTML += `
		<td class="bold">Postfix with numbers</td>
	`;
	firstTr.innerHTML += `
		<td class="bold">Result</td>
	`;

	
	let combinations = combos(uniqueValues.length);

	for (let i of combinations) {
		table.innerHTML += `<tr id="${i.join("")}"></tr>`;
		let currentTr = document.getElementById(i.join(""));
		

		i.forEach((item, index) => {
			if (nums.includes(index)) {
				if (item === 0) {
					currentTr.innerHTML += `<td>1</td>`
				} else if (item === 1) {
					currentTr.innerHTML += `<td>0</td>`
				}
			} else {
				currentTr.innerHTML += `<td>${item}</td>`
			}
		})

		let obj = {}

		i.forEach((item, index) => {
			obj[uniqueValues[index]] = item;
		})

		const postfix = infixToPostfix(expression.value);
	
		const infixWithNumbers = withNumbers(expression.value, obj)
		const postfixWithNumbers = withNumbers(postfix, obj)
		const result = evaluatePostfix(postfixWithNumbers);

		currentTr.innerHTML += `<td>${infixWithNumbers}</td>`;

		currentTr.innerHTML += `<td>${postfixWithNumbers}</td>`;

		currentTr.innerHTML += `<td>${result}</td>`;
	}
})

function evaluatePostfix(exp) {
		let stack=[];
		for(let i = 0; i < exp.length; i++)
		{
			let c = exp[i];
			if (!isNaN(parseInt(c))) {
				stack.push(c.charCodeAt(0) - '0'.charCodeAt(0));
			}

			else
			{
				let b = stack.pop();
				let a = stack.pop();
				
				switch(c){
					case '&':
						stack.push(Math.min(a, b));
						break;
					case '|':
						stack.push(Math.max(a, b));
						break;
					case '-':
						if (a) {
							stack.push(b);
						} else {
							stack.push(1);
						} 
						break;
					case '~':
						let first;
						let second;
						if (a) {
							first = b;
						} else {
							first = 1;
						} 
						if (b) {
							second = a;
						} else {
							second = 1;
						} 

						stack.push(Math.min(first, second));
						break;
			}
			}
		}
		return stack.pop();
}