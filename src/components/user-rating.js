export function userRating(element, game) {
    const table = document.createElement('table');
    table.classList.add('user-rating');
    table.classList.add('table-bordered');
    element.appendChild(table);

    const thead = document.createElement('thead');
    table.appendChild(thead);

    const tr = document.createElement('tr');
    thead.appendChild(tr);

    const th0 = document.createElement('th');
    th0.textContent = '№';
    tr.appendChild(th0);

    const th = document.createElement('th');
    th.textContent = 'User';
    tr.appendChild(th);

    const th2 = document.createElement('th');
    th2.textContent = 'Score';
    tr.appendChild(th2);

    const tbody = document.createElement('tbody');
    table.appendChild(tbody);

    const users = game.userQueue.getUsers();
    const usersLength = users.length;

    for (let i = 0; i < usersLength; i++) {
        const tr = document.createElement('tr');
        tbody.appendChild(tr);

        const td0 = document.createElement('td');
        td0.textContent = i + 1;
        tr.appendChild(td0);

        const td = document.createElement('td');
        td.textContent = users[i].name;
        tr.appendChild(td);

        const td2 = document.createElement('td');
        td2.textContent = users[i].score;
        tr.appendChild(td2);
    }

    document.addEventListener('usersAnswered', () => {
        const users = game.userQueue.getUsers();
        const usersLength = users.length;

        for (let i = 0; i < usersLength; i++) {
            const tr = tbody.querySelector('tr:nth-child(' + (i + 1) + ')');
            const tdNumber = tr.querySelector('td:nth-child(1)');
            const tdScore = tr.querySelector('td:nth-child(3)');
            tdNumber.textContent = i + 1;
            tdScore.textContent = users[i].score;
        }

        //Sort table by score
        const rows = tbody.querySelectorAll('tr');
        const rowsArray = Array.from(rows);
        rowsArray.sort((a, b) => {
            const aScore = parseInt(a.querySelector('td:nth-child(3)').textContent);
            const bScore = parseInt(b.querySelector('td:nth-child(3)').textContent);
            return bScore - aScore;
        });
        tbody.innerHTML = '';
        rowsArray.forEach((row, i) => {
            row.querySelector('td:nth-child(1)').textContent = i + 1;
            tbody.appendChild(row);
        });
    });

    document.addEventListener('userAdded', () => {
        const users = game.userQueue.getUsers();
        const usersLength = users.length;

        const tr = document.createElement('tr');
        tbody.appendChild(tr);

        const td0 = document.createElement('td');
        td0.textContent = usersLength;
        tr.appendChild(td0);

        const td = document.createElement('td');
        td.textContent = users[usersLength - 1].name;
        tr.appendChild(td);

        const td2 = document.createElement('td');
        td2.textContent = users[usersLength - 1].score;
        tr.appendChild(td2);
    });
}