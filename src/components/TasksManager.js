import React from 'react';
import TaskAPI from './TaskAPI';


class TasksManager extends React.Component {
    state = {
        tasks: [],
        task: '',
    }

    taskAPI = new TaskAPI();

    componentDidMount() {
        this.intervalId = setInterval(() => {
            const runningTask = this.state.tasks.find(t => t.isRunning);
            if(runningTask) {
                this.incrementTime(runningTask.id);
            }
        }, 1000);

        this.taskAPI.getTasks()
            .then(tasks => {
                this.setState({ tasks });
            })
            .catch(err => console.error(err, "Błąd pobierania tasków"));
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    toggleRunning = id => {
        this.setState(state => {
            const newTask = state.tasks.map(task => {
                if (task.id === id) {
                    const newRunningState = !task.isRunning;
                    const updateTask = {
                        ...task, 
                        isRunning: newRunningState,
                    };
                    this.taskAPI.updateTask(updateTask);

                    if(!newRunningState) {
                        this.stopTime(id);
                    }
                    return updateTask;
                }

                if(task.isRunning) {
                    this.taskAPI.updateTask({ ...task, isRunning: false });
                    return { ...task, isRunning: false };
                }
                return task;
            });
            return { tasks: newTask };
        });
    };

    updateTaskById = (id, updateProperties) => {
        this.setState(state => {
            const newTasks = state.tasks.map(task => {
                if (task.id === id) {
                    const updateTask = { ...task, ...updateProperties };
                    this.taskAPI.updateTask(updateTask);
                    return updateTask;
                }
                return task;
            });
            return { tasks: newTasks };
        });
    };

    
    stopTime = id => this.updateTaskById(id, { isDone: true });
    incrementTime = id => this.updateTaskById(id, { time: this.state.tasks.find(t => t.id === id).time + 1});
    overTask = id => this.updateTaskById(id, { isRemoved: true, isDone: true });
        


    inputChange = e => {
        this.setState({ task: e.target.value });
    };

    onSubmit = e => {
        e.preventDefault();

        const { task, tasks } = this.state;
        if (!task.trim()) return; 

        const newTask = {
            name: task,
            time: 0,
            isRunning: false,
            isDone: false,
            isRemoved: false,
        };

        this.taskAPI.addTask(newTask)
            .then(addedTask => {
                this.setState({
                    tasks: [...tasks, addedTask],
                    task: '',
                });
            })
            .catch(err => console.error(err, 'Błąd ładowania taska'));
    }

    formatTime(seconds) {
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    }

   
    render() {
        const { task, tasks } = this.state;

        return ( 
            <section className='container'>
                <div className='container_wrapper'>
                    <h1>StepByStep ADHD</h1>
                    <form onSubmit={this.onSubmit} >
                        <input 
                            className='input__text'
                            name="task" 
                            value={task} 
                            onChange={ this.inputChange } 
                            placeholder='Dodaj nowe zadanie'
                        />
                        <input type='submit' className='input__submit' />
                    </form>
                    <ul>
                        {tasks.filter(t => !t.isRemoved).map((t) => (
                            <li key={t.id}>
                                <section>
                                    <header>
                                        {t.name}, {this.formatTime(t.time)}
                                    </header>
                                    <footer>
                                        <button 
                                            onClick={() => this.toggleRunning(t.id)}
                                        >
                                                {t.isRunning ? 'stop' : 'start'}
                                        </button>
                                        <button 
                                            onClick={() => this.overTask(t.id)}
                                            disabled={t.isRunning}
                                        >
                                            Zakończ
                                        </button>
                                    </footer>
                                </section>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        );
    }
}

export default TasksManager;