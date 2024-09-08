const btnAddTask = document.querySelector(".app__button--add-task");
const formAddTask = document.querySelector(".app__form-add-task");
const textAreaAddTask = document.querySelector(".app__form-textarea");
const ulTasks = document.querySelector(".app__section-task-list");
const activeTask = document.querySelector('.app__section-active-task-description');
const typeName = document.querySelector(".app__form-label");
const buttonActivo = document.querySelector(".buttonIniciar");

const buttonCancel = document.querySelector(".app__form-footer__button--cancel");
const buttonDelete = document.querySelector(".app__form-footer__button--delete");

const buttonRemoveCompleted = document.querySelector('#btn-remover-concluidas');
const buttonRemoveAll = document.querySelector('#btn-remover-todas');

let selectedTasks = [];
let liSelectedTasks = [];

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function atualizarTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// fechando modal
buttonCancel.addEventListener("click", () => {
    formAddTask.classList.add("hidden");
    textAreaAddTask.value = "";
    selectedTasks = [];
})

function addTaskElement(task) {
    const li = document.createElement("li");
    li.classList.add("app__section-task-list-item");

    const svg = document.createElement("svg");
    svg.innerHTML = 
        `<svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>`;

    const paragrafo = document.createElement("p");
    paragrafo.textContent = task.description;
    paragrafo.classList.add("app__section-task-list-item-description");

    const button = document.createElement("button");
    button.classList.add("app_button-edit");
    button.onclick = () => {
        formAddTask.classList.add("hidden");
        buttonDelete.style.display = "block";
        selectedTasks = [task];
        textAreaAddTask.value = task.description;
        typeName.innerHTML = "Editando Task";

        // Remover o formulário de edição existente, se houver
        const existingEditForm = document.querySelector(".app__form-edit-task");
        if (existingEditForm) {
            existingEditForm.remove();
        }

        // Clonar o formulário de adição para edição
        const editForm = formAddTask.cloneNode(true);
        editForm.classList.remove("hidden");
        editForm.classList.add("app__form-edit-task");

        // Inserir o formulário de edição logo abaixo do item da lista
        li.after(editForm);

        // Preencher o textarea do formulário de edição com a descrição da tarefa
        editForm.querySelector("textarea").value = task.description;

        // Adicionar evento de submit ao formulário clonado
        editForm.addEventListener("submit", (evento) => {
            evento.preventDefault();
            task.description = editForm.querySelector("textarea").value;
            paragrafo.textContent = task.description;
            atualizarTasks();
            editForm.remove();
        });

        // Adicionar evento de cancelar ao botão de cancelar do formulário clonado
        editForm.querySelector(".app__form-footer__button--cancel").addEventListener("click", () => {
            editForm.remove();
        });

        // Adicionar evento de deletar ao botão de deletar do formulário clonado
        editForm.querySelector(".app__form-footer__button--delete").addEventListener("click", () => {
            tasks = tasks.filter(t => t !== task);
            atualizarTasks();
            li.remove();
            editForm.remove();
        });
    }

    const imageButton = document.createElement("img");
    imageButton.setAttribute("src", "/imagens/edit.png");

    button.append(imageButton);

    li.append(svg);
    li.append(paragrafo);
    li.append(button);

    if (task.completa) {
        li.classList.add("app__section-task-list-item-complete");
        button.setAttribute("disabled", "disabled");
        selectedTasks = [];
        liSelectedTasks = [];
    } else {
        li.onclick = () => {
            const buttonIniciarText = document.querySelector('.buttonIniciar').textContent.trim();

            if (buttonIniciarText === "Começar") {
                if (li.classList.contains('app__section-task-list-item-active')) {
                    li.classList.remove('app__section-task-list-item-active');
                    selectedTasks = selectedTasks.filter(t => t !== task);
                    liSelectedTasks = liSelectedTasks.filter(l => l !== li);
                    activeTask.textContent = selectedTasks.map(t => t.description).join(', ');
                } else {
                    if (!li.classList.contains("app__section-task-list-item-complete")) {
                        selectedTasks.push(task);
                        liSelectedTasks.push(li);
                        activeTask.textContent = selectedTasks.map(t => t.description).join(', ');
                        li.classList.add("app__section-task-list-item-active");
                    }
                }
            } else {
                alert("Você tem que pausar para selecionar outra tarefa!");
            }
        }
    }
    return li;
}

btnAddTask.addEventListener("click", () => {
    formAddTask.classList.toggle("hidden");
    typeName.innerHTML = "Cadastrando Task";
    textAreaAddTask.value = "";
    selectedTasks = [];
    buttonDelete.style.display = "none";

    const existingEditForm = document.querySelector(".app__form-edit-task");
    if (existingEditForm) {
        existingEditForm.remove();
    }
})

formAddTask.addEventListener("submit", (evento) => {
    evento.preventDefault();
    try {
        if (!selectedTasks.length) {
            const task = {
                description: textAreaAddTask.value
            }
            tasks.push(task);
            const elementTask = addTaskElement(task);
            ulTasks.append(elementTask);
            atualizarTasks();
        }
        textAreaAddTask.value = "";
        formAddTask.classList.add("hidden");
        showAlert('Task added', 'green');
    } catch (error) {
        showAlert(`Error ao realizar o cadastro ${error}`, 'red');
    }
})

tasks.forEach(element => {
    const elementTask = addTaskElement(element);
    ulTasks.append(elementTask);
});

document.addEventListener("FocoFinalizado", () => {
    if (selectedTasks.length && liSelectedTasks.length) {
        liSelectedTasks.forEach(li => {
            li.classList.remove("app__section-task-list-item-active");
            li.classList.add("app__section-task-list-item-complete");
            li.querySelector("button").setAttribute("disabled", "disabled");
        });
        selectedTasks.forEach(task => task.completa = true);
        atualizarTasks();
    }
})

const removeTasks = (somenteCompletas) => {
    const seletor = somenteCompletas ? '.app__section-task-list-item-complete' : '.app__section-task-list-item';
    document.querySelectorAll(seletor).forEach(element => {
        element.remove();
    })

    tasks = somenteCompletas ? tasks.filter(element => !element.completa) : [];
    atualizarTasks();
    showAlert(somenteCompletas ? "Tasks concluídas removidas" : "Tasks Removidas", "green");
}

buttonRemoveCompleted.onclick = () => removeTasks(true);
buttonRemoveAll.onclick = () => removeTasks(false);

function showAlert(title, type) {
    const alertContainer = document.getElementById('alert-container');

    const alert = document.createElement('div');
    alert.classList.add('alert', `alert-${type}`);

    const alertContent = document.createElement('div');
    alertContent.classList.add('alert-content');

    const icon = document.createElement("i");
    if (type == "green") {
        icon.classList.add("bi", "bi-check2")
    } else {
        icon.classList.add("bi", "bi-exclamation-lg")
    }

    const alertTitle = document.createElement('div');
    alertTitle.classList.add('alert-title');

    alertTitle.appendChild(icon);
    alertTitle.appendChild(document.createTextNode(" " + title));

    alertContent.appendChild(alertTitle);
    alert.appendChild(alertContent);
    alertContainer.appendChild(alert);

    setTimeout(() => {
        alert.style.animation = 'fadeOut 0.5s';
        setTimeout(() => {
            alert.remove();
        }, 500);
    }, 5000);
}
