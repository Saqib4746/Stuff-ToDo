document.addEventListener('DOMContentLoaded', () => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));

    if (storedTasks) {
        storedTasks.forEach(task => tasks.push(task));
        updateTasksList();
        updateStats();
    }
});

let tasks = [];

const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

const addTask = () => {
    const taskInput = document.getElementById('taskInput');
    const task = taskInput.value.trim();

    if (task) {
        tasks.push({ text: task, completed: false });
        taskInput.value = "";
        updateTasksList();
        updateStats();
        saveTasks();
    }
};

const toggleTaskCompletion = (index) => {
    tasks[index].completed = !tasks[index].completed;
    updateTasksList();
    updateStats();
    saveTasks();
}

const deleteTask = (index) => {
    tasks.splice(index, 1);
    updateTasksList();
    updateStats();
    saveTasks();
};

const editTask = (index) => {
    const taskInput = document.getElementById("taskInput");
    taskInput.value = tasks[index].text; // put old text into input box
    tasks.splice(index, 1); // remove the old task
    updateTasksList();
    updateStats();
    saveTasks();
};

const updateStats = () => {
    const completeTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;

    let progress = 0;
    if (totalTasks > 0) {
        progress = (completeTasks / totalTasks) * 100;
    }

    // update progress bar
    const progressBar = document.getElementById("progress");
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }

    // update counter text
    const counter = document.getElementById("counter");
    if (counter) {
        counter.textContent = `${completeTasks} / ${totalTasks}`;
    }

    // 🎉 trigger confetti when all tasks are completed
    if (tasks.length && completeTasks === totalTasks) {
        launchConfetti();
    }
}

const updateTasksList = () => {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const listitem = document.createElement('li');
        listitem.innerHTML = `
        <div class="taskItem">
            <div class="task ${task.completed ? 'completed' : ''}">
                <input type="checkbox" class="checkbox" ${task.completed ? "checked" : ""}/>
                <p>${task.text}</p>
            </div>
            <div class="icons">
                <img src="./img/edit.png" onClick="editTask(${index})"/>
                <img src="./img/delete.png" onClick="deleteTask(${index})"/>
            </div>
        </div>
        `;

        // ✅ make checkbox toggle only when clicked
        const checkbox = listitem.querySelector('.checkbox');
        checkbox.addEventListener('change', () => toggleTaskCompletion(index));

        taskList.appendChild(listitem);
    });
};

// initialize with empty stats
window.onload = () => {
    updateStats();
};

document.getElementById('newTask').addEventListener('click', function (e) {
    e.preventDefault();
    addTask();
});

// 🎉 Fixed confetti (renamed to avoid recursion)
const launchConfetti = () => {
    const count = 200,
    defaults = { origin: { y: 0.7 } };

    function fire(particleRatio, opts) {
        // ✅ call the real canvas-confetti library function
        window.confetti(
            Object.assign({}, defaults, opts, {
                particleCount: Math.floor(count * particleRatio),
            })
        );
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
};
