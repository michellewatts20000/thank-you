const actionBtn = document.getElementById("action-button");

const makeNote = document.getElementById("make-new");

const results = document.getElementById("results");

const email = document.getElementById("email");

const status = document.getElementById("status");

function getResults() {
    fetch("/all")
        .then(function (response) {
            if (response.status !== 200) {
                console.log("Looks like there was a problem. Status Code: " + response.status);
                return;
            }
            response.json().then(function (data) {
                newTodoSnippet(data);
           
            });
                 
        })
        .catch(function (err) {
            console.log("Fetch Error :-S", err);
        });
}

function newTodoSnippet(res) {
    for (var i = 0; i < res.length; i++) {
        let title = res[i]["title"];
        let note = res[i]["note"];
        let created = res[i]["created"];
        console.log(res);
        let todoList = document.getElementById("results");
        snippet = `
     <li class="list-group-item">
      <span>${note}</span><br>
      <span style="font-size:12px">${title} - ${moment(created).format('MMMM Do, h:mm a')}</span>
      </li>`;
        todoList.insertAdjacentHTML("beforeend", snippet);
        
    }
}

function resetTitleAndNote() {
    const note = document.getElementById("note");
    note.value = "";
    const title = document.getElementById("title");
    title.value = "";
    const email = document.getElementById("email");
    email.value = "";
   
}

function updateTitleAndNote(data) {
    const note = document.getElementById("note");
    note.value = data.note;
    const title = document.getElementById("title");
    title.value = data.title;
    const email = document.getElementById("email");
    email.value = data.email;
}

getResults();


actionBtn.addEventListener("click", function (e) {
    if (e.target.matches("#make-new")) {
        element = e.target;
        data_id = element.getAttribute("data-id");
        fetch("/submit", {
                method: "post",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: document.getElementById("title").value,
                    email: document.getElementById("email").value,
                    note: document.getElementById("note").value,
                    created: Date.now()
                })
            })
            .then(res => res.json())
            .then(res => newTodoSnippet([res]));
        resetTitleAndNote();
      location.reload();
    }
});