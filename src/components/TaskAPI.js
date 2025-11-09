import React from "react";

class TaskAPI {
    constructor() {
        this.apiUrl = 'http://localhost:3005/data';
    }

    getTasks() {
        return fetch(this.apiUrl)
            .then(resp => {
                if (!resp.ok) throw new Error('Błą ładowania danych z API');
                return resp.json();
            });
    }

    addTask(data) {
        const options = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        };

        return fetch(this.apiUrl, options)
            .then(resp => {
                if (!resp.ok) throw new Error("Błąd podczas dodawania");
                return resp.json();
            });
    }

    updateTask(task) {
        const options = {
            method: 'PATCH',
            body: JSON.stringify(task),
            headers: {'Content-Type': 'application/json' },
        };

        return fetch(`${this.apiUrl}/${task.id}`, options)
            .then(resp => {
                if (!resp.ok) throw Error('Błąd podczas aktualizacji czasu');
                return resp.json();
            });
    }
}

export default TaskAPI;