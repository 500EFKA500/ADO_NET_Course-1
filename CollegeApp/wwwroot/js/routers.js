let editingId = null;
let currentPage = "students";
const $ = id => document.getElementById(id);

document.addEventListener("DOMContentLoaded", () => {
    $("studentsButton").addEventListener("click", () => showPage("students"));
    $("groupsButton").addEventListener("click", () => showPage("groups"));
    $("studentForm").addEventListener("submit", saveStudent);
    $("groupForm").addEventListener("submit", addGroup);
    $("cancelEditButton").addEventListener("click", resetStudentForm);
    loadGroups();
    loadStudents();
});

async function api(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: { ...(options.body ? { "Content-Type": "application/json" } : {}), ...options.headers }
    });
    if (!response.ok) {
        let message = `Ошибка: ${response.status}`;
        try {
            const data = await response.json();
            message = data.message || data.detail || (typeof data === "string" ? data : message);
        } catch {
            try { message = await response.text() || message; } catch {}
        }
        throw new Error(message);
    }
    if (response.status === 204) return null;
    const type = response.headers.get("content-type") || "";
    return type.includes("application/json") ? response.json() : null;
}

function message(text, error = false) {
    $("message").textContent = text;
    $("message").className = error ? "error" : "success";
}

function showPage(page) {
    currentPage = page;
    $("studentsTable").hidden = page !== "students";
    $("groupsTable").hidden = page !== "groups";
    $("studentSection").hidden = page !== "students";
    $("groupSection").hidden = page !== "groups";
    $("studentsButton").classList.toggle("active", page === "students");
    $("groupsButton").classList.toggle("active", page === "groups");
    message("");
    if (page === "students") loadStudents();
    else loadGroups();
}

async function loadStudents() {
    try {
        const students = await api("/students/all");
        const body = $("studentBody");
        body.replaceChildren();
        students.forEach(s => {
            const row = document.createElement("tr");
            [s.studentId, s.firstName, s.lastName, s.age, s.groupId].forEach(value => {
                const td = document.createElement("td");
                td.textContent = value ?? "";
                row.append(td);
            });

            const actions = document.createElement("td");
            const edit = document.createElement("button");
            edit.textContent = "Изменить";
            edit.type = "button";
            edit.addEventListener("click", () => editStudent(s));

            const del = document.createElement("button");
            del.textContent = "Удалить";
            del.type = "button";
            del.className = "delete";
            del.addEventListener("click", () => deleteStudent(s));
            actions.append(edit, del);
            row.append(actions);
            body.append(row);
        });
    } catch (e) { message(e.message, true); }
}

async function loadGroups() {
    try {
        const groups = await api("/groups/all");
        const body = $("groupBody");
        body.replaceChildren();
        const select = $("groupId");
        const selected = select.value;
        select.replaceChildren(new Option("Выберите группу", ""));
        groups.forEach(g => {
            const row = document.createElement("tr");
            [g.groupId, g.groupName].forEach(value => {
                const td = document.createElement("td");
                td.textContent = value ?? "";
                row.append(td);
            });
            body.append(row);
            select.add(new Option(`${g.groupName} (ID: ${g.groupId})`, g.groupId));
        });
        if (selected) select.value = selected;
    } catch (e) { message(e.message, true); }
}

async function saveStudent(event) {
    event.preventDefault();
    const student = {
        firstName: $("firstNameStudent").value.trim(),
        lastName: $("lastNameStudent").value.trim(),
        age: Number($("ageStudent").value),
        groupId: Number($("groupId").value)
    };
    if (!student.firstName || !student.lastName || !student.groupId ||
        !Number.isInteger(student.age) || student.age < 1 || student.age > 120) {
        message("Проверьте имя, фамилию, возраст и группу.", true);
        return;
    }

    try {
        if (editingId === null) {
            const id = await api("/students/add", { method: "POST", body: JSON.stringify(student) });
            message(`Студент добавлен. ID: ${id}`);
        } else {
            await api(`/students/${editingId}`, { method: "PUT", body: JSON.stringify(student) });
            message("Данные студента обновлены.");
        }
        resetStudentForm();
        await loadStudents();
    } catch (e) { message(e.message, true); }
}

function editStudent(s) {
    editingId = s.studentId;
    $("firstNameStudent").value = s.firstName;
    $("lastNameStudent").value = s.lastName;
    $("ageStudent").value = s.age;
    $("groupId").value = s.groupId;
    $("studentFormTitle").textContent = "Изменить студента";
    $("saveStudentButton").textContent = "Сохранить";
    $("cancelEditButton").hidden = false;
    $("studentSection").scrollIntoView({ behavior: "smooth" });
}

async function deleteStudent(s) {
    if (!confirm(`Удалить студента ${s.firstName} ${s.lastName}?`)) return;
    try {
        await api(`/students/${s.studentId}`, { method: "DELETE" });
        message("Студент удалён.");
        await loadStudents();
    } catch (e) { message(e.message, true); }
}

function resetStudentForm() {
    editingId = null;
    $("studentForm").reset();
    $("studentFormTitle").textContent = "Добавить студента";
    $("saveStudentButton").textContent = "Добавить";
    $("cancelEditButton").hidden = true;
}

async function addGroup(event) {
    event.preventDefault();
    const groupName = $("groupName").value.trim();
    if (!groupName) {
        message("Введите название группы.", true);
        return;
    }
    try {
        const id = await api("/groups/add", {
            method: "POST",
            body: JSON.stringify({ groupName })
        });
        $("groupForm").reset();
        await loadGroups();
        message(`Группа добавлена. ID: ${id}`);
    } catch (e) { message(e.message, true); }
}


// CRUD преподавателей, предметов, оценок и групп.
const entities={groups:['groupName'],teachers:['firstName','lastName'],subjects:['subjectName','teacherId'],grades:['studentId','subjectId','value']};
for(const [entity,fields] of Object.entries(entities)) {
 const section=document.createElement('section'), title=document.createElement('h2'),form=document.createElement('form'), table=document.createElement('div'); title.textContent=entity;section.append(title,form,table);document.querySelector('main').append(section);
 let editing=null;
 for(const field of fields){const input=document.createElement('input');input.name=field;input.placeholder=field;input.required=true;input.type=field.endsWith('Id')||field==='value'?'number':'text';if(input.type==='number')input.min=1;if(field==='value')input.max=5;form.append(input);}
 const save=document.createElement('button');save.textContent='Сохранить';form.append(save);
 const cancel=document.createElement('button');cancel.type='button';cancel.textContent='Отмена';cancel.onclick=()=>{editing=null;form.reset();};form.append(cancel);
 const reload=async()=>{try{const rows=await api('/'+entity+'/all');table.replaceChildren();for(const row of rows){const line=document.createElement('p');line.textContent=Object.values(row).join(' | ');const edit=document.createElement('button');edit.textContent='Изменить';edit.onclick=()=>{editing=row[entity.slice(0,-1)+'Id'];fields.forEach(f=>form.elements[f].value=row[f]);};const del=document.createElement('button');del.textContent='Удалить';del.onclick=async()=>{if(!confirm('Удалить запись?'))return;try{await api('/'+entity+'/'+row[entity.slice(0,-1)+'Id'],{method:'DELETE'});await reload();}catch(e){message(e.message,true);}};line.append(edit,del);table.append(line);}}catch(e){message(e.message,true);}};
 form.onsubmit=async(event)=>{event.preventDefault();const data=Object.fromEntries(fields.map(f=>[f,form.elements[f].type==='number'?Number(form.elements[f].value):form.elements[f].value.trim()]));try{await api('/'+entity+'/'+(editing===null?'add':editing),{method:editing===null?'POST':'PUT',body:JSON.stringify(data)});editing=null;form.reset();await reload();}catch(e){message(e.message,true);}};reload();
}

