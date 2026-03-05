let tasks = JSON.parse(localStorage.getItem('dashboard')) || [];
const statusOptions = ['Pending', 'Shipped', 'Completed', 'Cancelled'];
function render() {
    localStorage.setItem('dashboard', JSON.stringify(tasks));
    const tableBody = document.getElementById('table-body');
    const pendingDisplay = document.getElementById('pending-count');
    const emptyMsg = document.getElementById('empty-msg');
    
    tableBody.innerHTML = '';
    let pendingCount = 0;

    if (tasks.length === 0) {
        emptyMsg.classList.remove('hidden');
    } else {
        emptyMsg.classList.add('hidden');
        tasks.forEach((task, index) => {
            if (task.status === 'Pending') pendingCount++;

            const row = document.createElement('tr');
            row.className = "border-b border-gray-50 hover:bg-gray-50/50 transition text-sm";
            row.innerHTML = `
                <td class="p-4 font-bold text-gray-400">#${task.id}</td>
                <td class="p-4 font-bold text-gray-800">${task.name}</td>
                <td class="p-4 text-gray-500 font-medium">${task.date}</td>
                <td class="p-4 font-black text-gray-900">${task.amount}</td>
                <td class="p-4">
                    <select onchange="updateStatus(${index}, this.value)" 
                            class="bg-gray-100 border-none rounded-lg px-2 py-1.5 text-[10px] font-black uppercase tracking-tighter cursor-pointer outline-none focus:ring-1 focus:ring-blue-400 ${getStatusTextColor(task.status)}">
                        ${statusOptions.map(opt => `<option value="${opt}" ${task.status === opt ? 'selected' : ''}>${opt}</option>`).join('')}
                    </select>
                </td>
                <td class="p-4">
                    <div class="flex justify-center items-center gap-3">
                        <button onclick="openModal(${index})" class="text-blue-500 hover:text-blue-700 transition" title="Edit Full Details"><i class="fas fa-edit"></i></button>
                        <button onclick="deleteTask(${index})" class="text-red-400 hover:text-red-600 transition" title="Delete"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
    pendingDisplay.innerText = pendingCount;
}

function getStatusTextColor(status) {
    switch(status) {
        case 'Pending': return 'text-orange-600';
        case 'Shipped': return 'text-blue-600';
        case 'Completed': return 'text-green-600';
        case 'Cancelled': return 'text-red-600';
        default: return 'text-gray-500';
    }
}

function updateStatus(index, newStatus) {
    tasks[index].status = newStatus;
    render();
}
function openModal(index = null) {
    const modal = document.getElementById('task-modal');
    const title = document.getElementById('modal-title');
    const editIdx = document.getElementById('edit-index');
    
    if (index !== null) {
        title.innerText = "Edit Task Record";
        editIdx.value = index;
        document.getElementById('modal-id').value = tasks[index].id;
        document.getElementById('modal-date').value = tasks[index].date;
        document.getElementById('modal-name').value = tasks[index].name;
        document.getElementById('modal-amount').value = tasks[index].amount;
        document.getElementById('modal-status').value = tasks[index].status;
    } else {
        title.innerText = "Create New Task";
        editIdx.value = "";
        const nextId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1001;
        document.getElementById('modal-id').value = nextId;
        document.getElementById('modal-date').value = new Date().toISOString().split('T')[0];
        document.getElementById('modal-name').value = "";
        document.getElementById('modal-amount').value = "";
        document.getElementById('modal-status').value = "Pending";
    }
    modal.classList.remove('hidden');
}
function closeModal() {
    document.getElementById('task-modal').classList.add('hidden');
}
function submitTask() {
    const editIdx = document.getElementById('edit-index').value;
    const taskData = {
        id: parseInt(document.getElementById('modal-id').value),
        date: document.getElementById('modal-date').value,
        name: document.getElementById('modal-name').value,
        amount: document.getElementById('modal-amount').value,
        status: document.getElementById('modal-status').value
    };

    if (!taskData.name || !taskData.amount) return alert("Customer Name and Amount are required.");

    if (editIdx !== "") {
        tasks[editIdx] = taskData;
    } else {
        tasks.push(taskData);
    }
    render();
    closeModal();
}

function deleteTask(index) {
    if (confirm("Permanently delete this entry?")) {
        tasks.splice(index, 1);
        render();
    }
}

document.getElementById('menu-btn').onclick = () => document.getElementById('mobile-menu').classList.toggle('hidden');

render();