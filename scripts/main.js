
// --- Data: Formula Definitions ---
const FORMULAS = {
    "Logical": {
        "IF": {
            desc: "Checks whether a condition is met, and returns one value if TRUE, and another value if FALSE.",
            syntax: "IF(logical_test, value_if_true, [value_if_false])",
            args: [
                { name: "logical_test", desc: "Any value or expression that can be evaluated to TRUE or FALSE." },
                { name: "value_if_true", desc: "The value that you want to be returned if the logical_test argument evaluates to TRUE." },
                { name: "value_if_false", desc: "The value that you want to be returned if the logical_test argument evaluates to FALSE." }
            ],
            eval: (args) => {
                const cond = evaluateExpression(args[0]);
                return cond ? args[1] : (args[2] !== undefined ? args[2] : false);
            }
        },
        "AND": {
            desc: "Returns TRUE if all of its arguments are TRUE.",
            syntax: "AND(logical1, [logical2], ...)",
            args: [
                { name: "logical1", desc: "The first condition that you want to test." },
                { name: "logical2", desc: "Additional conditions to test (optional)." }
            ],
            isVariadic: true,
            eval: (args) => args.every(a => evaluateExpression(a))
        },
        "OR": {
            desc: "Returns TRUE if any argument is TRUE.",
            syntax: "OR(logical1, [logical2], ...)",
            args: [
                { name: "logical1", desc: "The first condition that you want to test." },
                { name: "logical2", desc: "Additional conditions to test (optional)." }
            ],
            isVariadic: true,
            eval: (args) => args.some(a => evaluateExpression(a))
        },
        "NOT": {
            desc: "Reverses the logic of its argument.",
            syntax: "NOT(logical)",
            args: [
                { name: "logical", desc: "A value or expression that can be evaluated to TRUE or FALSE." }
            ],
            eval: (args) => !evaluateExpression(args[0])
        },
        "IFS": {
            desc: "Checks whether one or more conditions are met and returns a value that corresponds to the first TRUE condition.",
            syntax: "IFS(logical_test1, value_if_true1, ...)",
            args: [
                { name: "logical_test1", desc: "First condition." },
                { name: "value_if_true1", desc: "Result if first condition is true." }
            ],
            isVariadic: true,
            variadicPair: true,
            eval: (args) => {
                for(let i=0; i<args.length; i+=2) {
                    if(evaluateExpression(args[i])) return args[i+1];
                }
                return "#N/A";
            }
        }
    },
    "Text": {
        "MID": {
            desc: "Returns a specific number of characters from a text string starting at the position you specify.",
            syntax: "MID(text, start_num, num_chars)",
            args: [
                { name: "text", desc: "The text string containing the characters you want to extract." },
                { name: "start_num", desc: "The position of the first character you want to extract in text." },
                { name: "num_chars", desc: "The number of characters you want MID to return from text." }
            ],
            eval: (args) => {
                const txt = String(args[0] || "");
                const start = Math.max(0, Number(args[1]) - 1);
                const len = Number(args[2]);
                return txt.substring(start, start + len);
            }
        },
        "LEFT": {
            desc: "Returns the first character or characters in a text string.",
            syntax: "LEFT(text, [num_chars])",
            args: [
                { name: "text", desc: "The text string containing the characters you want to extract." },
                { name: "num_chars", desc: "Specifies the number of characters you want LEFT to extract." }
            ],
            eval: (args) => {
                const txt = String(args[0] || "");
                const len = args[1] === undefined ? 1 : Number(args[1]);
                return txt.substring(0, len);
            }
        },
        "RIGHT": {
            desc: "Returns the last character or characters in a text string.",
            syntax: "RIGHT(text, [num_chars])",
            args: [
                { name: "text", desc: "The text string containing the characters you want to extract." },
                { name: "num_chars", desc: "Specifies the number of characters you want RIGHT to extract." }
            ],
            eval: (args) => {
                const txt = String(args[0] || "");
                const len = args[1] === undefined ? 1 : Number(args[1]);
                return txt.slice(-len);
            }
        },
        "CONCATENATE": {
            desc: "Joins several text strings into one text string.",
            syntax: "CONCATENATE(text1, [text2], ...)",
            args: [
                { name: "text1", desc: "The first text item to join." },
                { name: "text2", desc: "Additional text items to join." }
            ],
            isVariadic: true,
            eval: (args) => args.join("")
        },
        "LEN": {
            desc: "Returns the number of characters in a text string.",
            syntax: "LEN(text)",
            args: [
                { name: "text", desc: "The text whose length you want to find." }
            ],
            eval: (args) => String(args[0]||"").length
        },
        "TRIM": {
            desc: "Removes all spaces from text except for single spaces between words.",
            syntax: "TRIM(text)",
            args: [
                { name: "text", desc: "The text from which you want to remove spaces." }
            ],
            eval: (args) => String(args[0]||"").trim()
        },
        "FIND": {
            desc: "Locates one text string within a second text string.",
            syntax: "FIND(find_text, within_text, [start_num])",
            args: [
                { name: "find_text", desc: "The text you want to find." },
                { name: "within_text", desc: "The text containing the text you want to find." },
                { name: "start_num", desc: "Specifies the character at which to start the search." }
            ],
            eval: (args) => {
                const search = String(args[0]);
                const text = String(args[1]);
                const start = args[2] ? Number(args[2]) - 1 : 0;
                const pos = text.indexOf(search, start);
                return pos === -1 ? "#VALUE!" : pos + 1;
            }
        }
    },
    "Math": {
        "SUM": {
            desc: "Adds all the numbers in a range of cells.",
            syntax: "SUM(number1, [number2], ...)",
            args: [
                { name: "number1", desc: "The first number argument you want to add." },
                { name: "number2", desc: "Number arguments 2 to 255 that you want to add." }
            ],
            isVariadic: true,
            eval: (args) => args.reduce((a,b) => Number(a) + Number(b), 0)
        },
        "AVERAGE": {
            desc: "Returns the average (arithmetic mean) of the arguments.",
            syntax: "AVERAGE(number1, [number2], ...)",
            args: [
                { name: "number1", desc: "The first number, cell reference, or range for which you want the average." },
                { name: "number2", desc: "Additional numbers, cell references or ranges." }
            ],
            isVariadic: true,
            eval: (args) => {
                if(args.length === 0) return 0;
                const sum = args.reduce((a,b) => Number(a) + Number(b), 0);
                return sum / args.length;
            }
        },
        "MAX": {
            desc: "Returns the largest value in a set of values.",
            syntax: "MAX(number1, [number2], ...)",
            args: [
                { name: "number1", desc: "A number, cell reference, or range." },
                { name: "number2", desc: "Additional numbers, cell references or ranges." }
            ],
            isVariadic: true,
            eval: (args) => Math.max(...args.map(Number))
        },
        "MIN": {
            desc: "Returns the smallest number in a set of values.",
            syntax: "MIN(number1, [number2], ...)",
            args: [
                { name: "number1", desc: "A number, cell reference, or range." },
                { name: "number2", desc: "Additional numbers, cell references or ranges." }
            ],
            isVariadic: true,
            eval: (args) => Math.min(...args.map(Number))
        }
    },
    "Lookup": {
        "VLOOKUP": {
            desc: "Looks for a value in the leftmost column of a table, and then returns a value in the same row from a column you specify.",
            syntax: "VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])",
            args: [
                { name: "lookup_value", desc: "The value to search in the first column of the table or range." },
                { name: "table_array", desc: "The range of cells that contains the data." },
                { name: "col_index_num", desc: "The column number in the table_array from which the matching value must be returned." },
                { name: "range_lookup", desc: "A logical value that specifies whether you want VLOOKUP to find an exact match or an approximate match." }
            ],
            eval: () => "Ref" // Too complex for simple live preview
        }
    },
    "Date & Time": {
        "TODAY": {
            desc: "Returns the serial number of the current date.",
            syntax: "TODAY()",
            args: [],
            eval: () => new Date().toLocaleDateString()
        },
        "NOW": {
            desc: "Returns the serial number of the current date and time.",
            syntax: "NOW()",
            args: [],
            eval: () => new Date().toLocaleString()
        }
    },
    "Statistical": {
        "AVERAGE": {
            desc: "Returns the average of its arguments.",
            syntax: "AVERAGE(number1, [number2], ...)",
            args: [
                { name: "number1", desc: "The first number, cell reference, or range for which you want the average." },
                { name: "number2", desc: "Additional numbers, cell references or ranges." }
            ],
            isVariadic: true,
            eval: (args) => {
                const nums = args.map(a => Number(a)).filter(n => !isNaN(n));
                return nums.length > 0 ? (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(2) : 0;
            }
        },
        "COUNT": {
            desc: "Counts the number of cells that contain numbers.",
            syntax: "COUNT(value1, [value2], ...)",
            args: [
                { name: "value1", desc: "The first item, cell reference, or range in which you want to count numbers." }
            ],
            isVariadic: true,
            eval: (args) => args.filter(a => !isNaN(Number(a))).length
        },
        "MAX": {
            desc: "Returns the maximum value in a set of values.",
            syntax: "MAX(number1, [number2], ...)",
            args: [
                { name: "number1", desc: "The first number or range for which you want the maximum." }
            ],
            isVariadic: true,
            eval: (args) => Math.max(...args.map(a => Number(a)))
        },
        "MIN": {
            desc: "Returns the minimum value in a set of values.",
            syntax: "MIN(number1, [number2], ...)",
            args: [
                { name: "number1", desc: "The first number or range for which you want the minimum." }
            ],
            isVariadic: true,
            eval: (args) => Math.min(...args.map(a => Number(a)))
        }
    },
    "Financial": {
        "PMT": {
            desc: "Calculates the payment for a loan based on constant payments and a constant interest rate.",
            syntax: "PMT(rate, nper, pv, [fv], [type])",
            args: [
                { name: "rate", desc: "The interest rate for the loan." },
                { name: "nper", desc: "The total number of payment periods." },
                { name: "pv", desc: "The present value (loan amount)." }
            ],
            eval: () => "Financial calculation"
        },
        "PV": {
            desc: "Returns the present value of an investment.",
            syntax: "PV(rate, nper, pmt, [fv], [type])",
            args: [
                { name: "rate", desc: "The interest rate per period." },
                { name: "nper", desc: "The total number of payment periods." },
                { name: "pmt", desc: "The payment made each period." }
            ],
            eval: () => "Financial calculation"
        },
        "FV": {
            desc: "Returns the future value of an investment.",
            syntax: "FV(rate, nper, pmt, [pv], [type])",
            args: [
                { name: "rate", desc: "The interest rate per period." },
                { name: "nper", desc: "The total number of payment periods." },
                { name: "pmt", desc: "The payment made each period." }
            ],
            eval: () => "Financial calculation"
        }
    },
    "Engineering": {
        "CONVERT": {
            desc: "Converts a number from one measurement system to another.",
            syntax: "CONVERT(number, from_unit, to_unit)",
            args: [
                { name: "number", desc: "The value in from_unit to convert." },
                { name: "from_unit", desc: "The units for number." },
                { name: "to_unit", desc: "The units for the result." }
            ],
            eval: () => "Unit conversion"
        },
        "BASE": {
            desc: "Converts a number into a text representation with the given radix (base).",
            syntax: "BASE(number, radix, [min_length])",
            args: [
                { name: "number", desc: "The number you want to convert." },
                { name: "radix", desc: "The base radix that you want to convert the number into (between 2 and 36)." }
            ],
            eval: (args) => {
                try {
                    return Number(args[0]).toString(Number(args[1]));
                } catch {
                    return "#VALUE!";
                }
            }
        }
    },
    "Information": {
        "ISBLANK": {
            desc: "Returns TRUE if the value is blank.",
            syntax: "ISBLANK(value)",
            args: [
                { name: "value", desc: "The value you want to test." }
            ],
            eval: (args) => args[0] === "" || args[0] === undefined
        },
        "ISNUMBER": {
            desc: "Returns TRUE if the value is a number.",
            syntax: "ISNUMBER(value)",
            args: [
                { name: "value", desc: "The value you want to test." }
            ],
            eval: (args) => !isNaN(Number(args[0]))
        },
        "ISTEXT": {
            desc: "Returns TRUE if the value is text.",
            syntax: "ISTEXT(value)",
            args: [
                { name: "value", desc: "The value you want to test." }
            ],
            eval: (args) => typeof args[0] === 'string'
        },
        "ISERROR": {
            desc: "Returns TRUE if the value is an error value.",
            syntax: "ISERROR(value)",
            args: [
                { name: "value", desc: "The value you want to test." }
            ],
            eval: (args) => String(args[0]).startsWith("#")
        }
    },
    "Database": {
        "DSUM": {
            desc: "Sums the numbers in a column of a list or database that satisfy criteria you specify.",
            syntax: "DSUM(database, field, criteria)",
            args: [
                { name: "database", desc: "The range of cells that makes up the list or database." },
                { name: "field", desc: "The column number in the database." },
                { name: "criteria", desc: "The range of cells that specify the criteria." }
            ],
            eval: () => "Database operation"
        },
        "DAVERAGE": {
            desc: "Averages the values in a column of a list or database that meet the criteria you specify.",
            syntax: "DAVERAGE(database, field, criteria)",
            args: [
                { name: "database", desc: "The range of cells that makes up the list or database." },
                { name: "field", desc: "The column number in the database." },
                { name: "criteria", desc: "The range of cells that specify the criteria." }
            ],
            eval: () => "Database operation"
        }
    }
};

// --- State Management ---
let formulaTree = null;
let nodeCounter = 0;
let activeNodeIdForReplace = null;

// Mock Data State for Live Preview
const MOCK_DATA = {
    "A1": "10", "B1": "20",
    "A2": "Test", "B2": "Excel"
};

// --- DOM Elements ---
const libraryContainer = document.getElementById('library-container');
const functionSearch = document.getElementById('function-search');
const builderRoot = document.getElementById('builder-root');
const emptyState = document.getElementById('empty-state');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const copyBtn = document.getElementById('copy-btn');
const formulaResult = document.getElementById('formula-result');
const helperPanel = document.getElementById('helper-panel');
const helpTitle = document.getElementById('help-title');
const helpDesc = document.getElementById('help-desc');
const helpSyntax = document.getElementById('help-syntax');

// Live Preview Elements
const livePreviewResult = document.getElementById('live-preview-result');
const livePreviewContainer = document.getElementById('live-preview-container');

// Modal Elements
const modalOverlay = document.getElementById('modal-overlay');
const closeModalBtn = document.getElementById('close-modal');
const modalSearch = document.getElementById('modal-search');
const modalList = document.getElementById('modal-list');

// Roadmap Elements
const roadmapBtn = document.getElementById('roadmap-btn');
const roadmapModal = document.getElementById('roadmap-modal');
const closeRoadmapBtn = document.getElementById('close-roadmap');

// Disclaimer Elements
const disclaimerBtn = document.getElementById('disclaimer-btn');
const disclaimerModal = document.getElementById('disclaimer-modal');
const closeDisclaimerBtn = document.getElementById('close-disclaimer');

// Sidebar Elements (Mobile)
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');

// --- Initialization ---
function init() {
    renderLibrary();
    setupEventListeners();
    renderLivePreviewInputs();
}

// --- Rendering Library ---
function renderLibrary(filter = "") {
    libraryContainer.innerHTML = "";
    
    const flatFilter = filter.toLowerCase().trim();

    for (const [category, funcs] of Object.entries(FORMULAS)) {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = "mb-4";
        
        const catTitle = document.createElement('h3');
        catTitle.className = "px-3 py-1 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1";
        catTitle.textContent = category;
        
        const funcList = document.createElement('div');
        funcList.className = "space-y-1";
        
        let hasVisibleFuncs = false;

        for (const [funcName, details] of Object.entries(funcs)) {
            if (flatFilter && !funcName.toLowerCase().includes(flatFilter) && !details.desc.toLowerCase().includes(flatFilter)) {
                continue;
            }
            hasVisibleFuncs = true;

            const btn = document.createElement('button');
            btn.className = "w-full text-left px-3 py-2 rounded hover:bg-slate-800 text-slate-300 text-sm font-medium flex items-center justify-between group transition-colors";
            btn.innerHTML = `
                <span>${funcName}</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-600 group-hover:text-green-400 opacity-0 group-hover:opacity-100 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
            `;
            
            btn.onclick = () => handleLibraryClick(funcName);
            btn.onmouseenter = () => showHelp(funcName, details);
            
            funcList.appendChild(btn);
        }

        if (hasVisibleFuncs) {
            categoryDiv.appendChild(catTitle);
            categoryDiv.appendChild(funcList);
            libraryContainer.appendChild(categoryDiv);
        }
    }
}

// --- Rendering Builder ---

const uid = () => `node-${nodeCounter++}`;

function handleLibraryClick(funcName) {
    if (!formulaTree) {
        startNewTree(funcName);
    } else {
        if(confirm("Replace current formula with new " + funcName + "?")) {
            startNewTree(funcName);
        }
    }
}

function startNewTree(funcName) {
    const funcDef = getFuncDef(funcName);
    formulaTree = createFunctionNode(funcName, funcDef);
    
    emptyState.classList.add('hidden');
    builderRoot.classList.remove('hidden');
    renderBuilder();
    updateResult();
}

function createFunctionNode(funcName, funcDef) {
    const args = funcDef.args.map(argDef => createValueNode(""));
    return {
        id: uid(),
        type: "function",
        name: funcName,
        args: args,
        def: funcDef
    };
}

function createValueNode(value = "") {
    return {
        id: uid(),
        type: "value",
        value: value
    };
}

function getFuncDef(name) {
    for (const cat in FORMULAS) {
        if (FORMULAS[cat][name]) return FORMULAS[cat][name];
    }
    return null;
}

function renderBuilder() {
    builderRoot.innerHTML = "";
    if (formulaTree) {
        builderRoot.appendChild(renderNode(formulaTree, 0));
    }
}

function renderNode(node, depth) {
    const container = document.createElement('div');
    container.className = "node-container mb-4";
    
    if (node.type === "function") {
        // Header for Function
        const header = document.createElement('div');
        header.className = "flex items-center gap-2 mb-2 p-2 bg-slate-800 border border-slate-700 rounded-lg shadow-md";
        
        const label = document.createElement('span');
        label.className = "font-bold text-green-400 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-sm";
        label.textContent = node.name;
        
        const removeBtn = document.createElement('button');
        removeBtn.className = "ml-auto text-slate-500 hover:text-red-400 p-1 rounded transition-colors";
        removeBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>`;
        removeBtn.title = "Remove Function (Reset to value)";
        removeBtn.onclick = () => {
            formulaTree = replaceNodeInTree(formulaTree, node.id, createValueNode(""));
            renderBuilder();
            updateResult();
        };

        header.appendChild(label);
        header.appendChild(removeBtn);
        container.appendChild(header);

        // Arguments Container
        const argsContainer = document.createElement('div');
        argsContainer.className = "pl-6 relative border-l-2 border-slate-700 ml-4 space-y-4";
        
        node.args.forEach((argNode, index) => {
            const argDef = node.def.args[index] || { name: `arg${index+1}`, desc: "Additional argument" };
            
            const argWrapper = document.createElement('div');
            
            // Label for Argument
            const argLabel = document.createElement('div');
            argLabel.className = "text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-2";
            argLabel.textContent = argDef.name;

            const infoIcon = document.createElement('span');
            infoIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 cursor-help text-slate-600 hover:text-slate-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" /></svg>`;
            infoIcon.title = argDef.desc;
            argLabel.appendChild(infoIcon);

            argWrapper.appendChild(argLabel);
            argWrapper.appendChild(renderNode(argNode, depth + 1));
            
            argsContainer.appendChild(argWrapper);
        });

        // Add Argument Button for Variadic Functions
        if (node.def.isVariadic) {
            const addBtn = document.createElement('button');
            addBtn.className = "mt-2 text-xs font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors";
            addBtn.innerHTML = `<span>+ Add Argument</span>`;
            addBtn.onclick = () => {
                node.args.push(createValueNode(""));
                renderBuilder();
                updateResult();
            };
            argsContainer.appendChild(addBtn);
        }

        container.appendChild(argsContainer);

    } else {
        // Value Node
        const valueWrapper = document.createElement('div');
        valueWrapper.className = "flex items-center gap-2";
        
        const input = document.createElement('input');
        input.type = "text";
        input.value = node.value;
        input.placeholder = "Value, cell (A1), or text...";
        input.className = "flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded text-sm text-slate-200 placeholder-slate-600 focus:ring-2 focus:ring-green-500/50 focus:border-green-500 outline-none transition-all";
        input.oninput = (e) => {
            node.value = e.target.value;
            updateResult();
        };

        const funcBtn = document.createElement('button');
        funcBtn.className = "px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-slate-400 hover:text-slate-200 text-sm font-medium transition-colors flex items-center gap-1";
        funcBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg> Func`;
        funcBtn.onclick = () => openFunctionModal(node.id);

        valueWrapper.appendChild(input);
        valueWrapper.appendChild(funcBtn);
        container.appendChild(valueWrapper);
    }
    
    return container;
}

// --- Tree Manipulation ---
function replaceNodeInTree(currentNode, targetId, newNode) {
    if (currentNode.id === targetId) {
        return newNode;
    }
    
    if (currentNode.type === "function") {
        for (let i = 0; i < currentNode.args.length; i++) {
            if (currentNode.args[i].id === targetId) {
                currentNode.args[i] = newNode;
                return currentNode;
            }
            // Important: Assign result of recursion
            currentNode.args[i] = replaceNodeInTree(currentNode.args[i], targetId, newNode);
        }
    }
    return currentNode;
}

// --- Modal Logic ---
function openFunctionModal(nodeId) {
    activeNodeIdForReplace = nodeId;
    renderModalList();
    modalOverlay.classList.remove('hidden');
    modalSearch.focus();
}

function closeModal() {
    modalOverlay.classList.add('hidden');
    activeNodeIdForReplace = null;
    modalSearch.value = "";
}

function renderModalList(filter = "") {
    modalList.innerHTML = "";
    const flatFilter = filter.toLowerCase().trim();

    for (const [category, funcs] of Object.entries(FORMULAS)) {
        let categoryHasMatch = false;
        const fragment = document.createDocumentFragment();
        
        const catHeader = document.createElement('div');
        catHeader.className = "px-2 py-1 mt-2 text-xs font-bold text-slate-500 uppercase";
        catHeader.textContent = category;
        fragment.appendChild(catHeader);

        for (const [funcName, details] of Object.entries(funcs)) {
            if (flatFilter && !funcName.toLowerCase().includes(flatFilter)) continue;
            
            categoryHasMatch = true;
            const btn = document.createElement('button');
            btn.className = "w-full text-left px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-800 hover:border-slate-600 rounded text-sm flex flex-col group transition-all";
            btn.onclick = () => selectFunctionFromModal(funcName);
            
            const nameSpan = document.createElement('span');
            nameSpan.className = "font-bold text-slate-200 group-hover:text-green-400";
            nameSpan.textContent = funcName;
            
            const descSpan = document.createElement('span');
            descSpan.className = "text-slate-400 text-xs truncate w-full group-hover:text-slate-300 mt-0.5";
            descSpan.textContent = details.desc;
            
            btn.appendChild(nameSpan);
            btn.appendChild(descSpan);
            fragment.appendChild(btn);
        }

        if (categoryHasMatch) {
            modalList.appendChild(fragment);
        }
    }
}

function selectFunctionFromModal(funcName) {
    const funcDef = getFuncDef(funcName);
    const newNode = createFunctionNode(funcName, funcDef);
    
    if (activeNodeIdForReplace === "NEW_ROOT") {
        startNewTree(funcName);
    } else if (formulaTree.id === activeNodeIdForReplace) {
        formulaTree = newNode;
    } else {
        replaceNodeInTree(formulaTree, activeNodeIdForReplace, newNode);
    }
    
    renderBuilder();
    updateResult();
    closeModal();
}

// --- Output Generation ---
function generateFormula(node) {
    if (!node) return "";
    
    if (node.type === "value") {
        return node.value; 
    }
    
    if (node.type === "function") {
        const args = node.args.map(arg => generateFormula(arg));
        return `${node.name}(${args.join(", ")})`;
    }
    return "";
}

function updateResult() {
    if (formulaTree) {
        const formula = "=" + generateFormula(formulaTree);
        formulaResult.value = formula;
        updateLivePreview();
    } else {
        formulaResult.value = "";
        if(livePreviewResult) livePreviewResult.textContent = "...";
    }
}

// --- Live Preview & Logic ---

function renderLivePreviewInputs() {
    if(!livePreviewContainer) return;
    livePreviewContainer.innerHTML = "";
    
    Object.keys(MOCK_DATA).forEach(cell => {
        const wrapper = document.createElement('div');
        wrapper.className = "flex flex-col gap-1";
        
        const label = document.createElement('label');
        label.className = "text-xs font-bold text-slate-500";
        label.textContent = cell;
        
        const input = document.createElement('input');
        input.type = "text";
        input.value = MOCK_DATA[cell];
        input.className = "w-full px-2 py-1.5 bg-slate-800 border border-slate-700 rounded text-sm text-slate-200 focus:border-green-500 focus:outline-none";
        input.oninput = (e) => {
            MOCK_DATA[cell] = e.target.value;
            updateLivePreview();
        };
        
        wrapper.appendChild(label);
        wrapper.appendChild(input);
        livePreviewContainer.appendChild(wrapper);
    });
}

function updateLivePreview() {
    if (!formulaTree || !livePreviewResult) return;
    
    try {
        const result = evaluateTree(formulaTree);
        livePreviewResult.textContent = result;
    } catch (e) {
        console.error(e);
        livePreviewResult.textContent = "Error";
    }
}

function evaluateTree(node) {
    if (node.type === "value") {
        return evaluateExpression(node.value);
    }
    if (node.type === "function") {
        const argValues = node.args.map(arg => evaluateTree(arg));
        if (node.def.eval) {
            return node.def.eval(argValues);
        }
        return "#N/A (Not Implemented)";
    }
    return "";
}

function evaluateExpression(val) {
    if (typeof val !== 'string') return val;
    
    // Check if it's a cell reference in MOCK_DATA
    const trimmed = val.trim();
    if (MOCK_DATA.hasOwnProperty(trimmed)) {
        const cellVal = MOCK_DATA[trimmed];
        // Try to return number if possible
        const num = Number(cellVal);
        return isNaN(num) || cellVal === "" ? cellVal : num;
    }
    
    // Try to parse number literal
    if (!isNaN(Number(val)) && val.trim() !== "") {
        return Number(val);
    }
    
    // Remove quotes if it's a string literal "text"
    if (val.startsWith('"') && val.endsWith('"')) {
        return val.slice(1, -1);
    }
    
    return val;
}

// --- Help & UI Interactions ---
function showHelp(funcName, details) {
    helpTitle.textContent = funcName;
    helpDesc.textContent = details.desc;
    helpSyntax.textContent = "Syntax: " + details.syntax;
}

function setupEventListeners() {
    if(functionSearch) functionSearch.addEventListener('input', (e) => renderLibrary(e.target.value));
    if(modalSearch) modalSearch.addEventListener('input', (e) => renderModalList(e.target.value));
    if(closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    
    if(startBtn) startBtn.addEventListener('click', () => {
        activeNodeIdForReplace = "NEW_ROOT";
        renderModalList();
        modalOverlay.classList.remove('hidden');
        modalSearch.focus();
    });

    if(resetBtn) resetBtn.addEventListener('click', () => {
        if(confirm("Are you sure you want to reset everything?")) {
            formulaTree = null;
            builderRoot.innerHTML = "";
            builderRoot.classList.add('hidden');
            emptyState.classList.remove('hidden');
            formulaResult.value = "";
            if(livePreviewResult) livePreviewResult.textContent = "...";
        }
    });

    if(copyBtn) copyBtn.addEventListener('click', () => {
        formulaResult.select();
        document.execCommand('copy');
        
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg> Copied!`;
        copyBtn.classList.replace('bg-green-600', 'bg-slate-700');
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.classList.replace('bg-slate-700', 'bg-green-600');
        }, 2000);
    });

    if(roadmapBtn) roadmapBtn.addEventListener('click', () => {
        roadmapModal.classList.remove('hidden');
    });

    if(closeRoadmapBtn) closeRoadmapBtn.addEventListener('click', () => {
        roadmapModal.classList.add('hidden');
    });

    // Close roadmap on outside click
    if(roadmapModal) roadmapModal.addEventListener('click', (e) => {
        if (e.target === roadmapModal) {
            roadmapModal.classList.add('hidden');
        }
    });

    // Disclaimer Logic
    if(disclaimerBtn) disclaimerBtn.addEventListener('click', () => {
        disclaimerModal.classList.remove('hidden');
    });

    if(closeDisclaimerBtn) closeDisclaimerBtn.addEventListener('click', () => {
        disclaimerModal.classList.add('hidden');
    });

    const closeDisclaimerFooterBtn = document.getElementById('close-disclaimer-btn');
    if(closeDisclaimerFooterBtn) closeDisclaimerFooterBtn.addEventListener('click', () => {
        disclaimerModal.classList.add('hidden');
    });

    if(disclaimerModal) disclaimerModal.addEventListener('click', (e) => {
        if (e.target === disclaimerModal) {
            disclaimerModal.classList.add('hidden');
        }
    });

    // Sidebar Toggle (Mobile)
    function toggleSidebar() {
        if(sidebar) {
            sidebar.classList.toggle('hidden');
            sidebar.classList.toggle('fixed');
            sidebar.classList.toggle('md:flex');
        }
        if(sidebarOverlay) {
            sidebarOverlay.classList.toggle('hidden');
        }
    }

    function closeSidebar() {
        if(sidebar && window.innerWidth < 768) {  // Only close on mobile (< md breakpoint)
            sidebar.classList.add('hidden');
            sidebar.classList.remove('fixed');
            sidebar.classList.remove('md:flex');
        }
        if(sidebarOverlay) {
            sidebarOverlay.classList.add('hidden');
        }
    }

    if(sidebarToggle) sidebarToggle.addEventListener('click', toggleSidebar);
    if(sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

    // Close sidebar when a function is selected (mobile)
    if(libraryContainer) {
        libraryContainer.addEventListener('click', (e) => {
            if(e.target.closest('[data-function]')) {
                closeSidebar();
            }
        });
    }
}

// Run Init
document.addEventListener('DOMContentLoaded', init);