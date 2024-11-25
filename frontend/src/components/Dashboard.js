import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addTask, moveTask, deleteTask, editTask } from '../redux/taskSlice';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './Dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { faBell, faEnvelope, faCalendarAlt } from '@fortawesome/free-regular-svg-icons';


const Dashboard = () => {
    const dispatch = useDispatch();

    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskPriority, setTaskPriority] = useState('medium');
    const [editMode, setEditMode] = useState(null);
    const [editName, setEditName] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editPriority, setEditPriority] = useState('low');
    const [filterCriteria, setFilterCriteria] = useState('all'); // Simplified filter for category

    const tasks = useSelector((state) => state.tasks);

    const handleAddTask = (e) => {
        e.preventDefault();
        if (taskName && taskDescription) {
            const newTask = {
                id: Date.now(),
                name: taskName,
                description: taskDescription,
                priority: taskPriority,
            };
            dispatch(addTask({ section: 'todo', task: newTask }));
            setTaskName('');
            setTaskDescription('');
            setTaskPriority('medium');
        }
    };

    const handleDragEnd = (result) => {
        const { destination, source } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const taskId = result.draggableId;
        const fromSection = source.droppableId;
        const toSection = destination.droppableId;

        dispatch(moveTask({ from: fromSection, to: toSection, taskId }));
    };

    const handleEdit = (task) => {
        setEditMode(task.id);
        setEditName(task.name);
        setEditDescription(task.description);
        setEditPriority(task.priority);
    };

    const handleSaveEdit = () => {
        dispatch(editTask({ id: editMode, name: editName, description: editDescription, priority: editPriority }));
        setEditMode(null);
        setEditName('');
        setEditDescription('');
        setEditPriority('medium');
    };

    const handleDelete = (taskId) => {
        dispatch(deleteTask({ id: taskId }));
    };

    const renderFilteredTasks = (section) => {
        if (filterCriteria === 'all') {
            return tasks[section];
        }
        return tasks[section].filter((task) => task.priority === filterCriteria);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.reload();
    }

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className="dashboard w-full p-3">
                {/* <h2 className=' text-3xl bg-red-500 '>Add a Task</h2> */}
                <div className=' flex flex-row justify-between  border-b-2 px-5 py-4 mb-4'>
                    <form onSubmit={handleAddTask}
                        className='  '>
                        {/* <div> */}
                        <input
                            type="text"
                            placeholder="Task Name"
                            value={taskName}
                            onChange={(e) => setTaskName(e.target.value)}
                            className=' bg-slate-100 border-0 px-4 py-2 rounded-md placeholder-slate-500 mr-4 '
                        />
                        <input
                            type="text"
                            placeholder="Task Description"
                            value={taskDescription}
                            onChange={(e) => setTaskDescription(e.target.value)}
                            className=' bg-slate-100 border-0 px-4 py-2 rounded-md placeholder-slate-500 w-56 mr-4 '
                        />
                        <select
                            value={taskPriority}
                            onChange={(e) => setTaskPriority(e.target.value)}
                            className="px-3 py-1.5 border-2 border-slate-500 text-slate-500 rounded-md  appearance-none pr-10 relative  mr-4 "
                            style={{
                                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>')`,
                                backgroundPosition: 'right 0.75rem center',
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: '1rem',
                            }}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                        {/* </div> */}
                        {/* <div> */}
                        <button className=' px-4 py-1.5 bg-red-300 rounded-lg text-red-500  font-bold ' type="submit">Add Task</button>
                        {/* </div> */}

                    </form>
                    <div className=' flex flex-row gap-3'>
                        <div className=' flex flex-row gap-6 my-auto mx-auto mr-8'>
                            <FontAwesomeIcon icon={faBell} className="text-gray-400 text-2xl cursor-pointer hover:text-blue-500" />
                            <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 text-2xl cursor-pointer hover:text-blue-500" />
                            <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400 text-2xl cursor-pointer hover:text-blue-500" />
                        </div>
                        <div>
                            <button className=' px-2 py-1.5 bg-green-400 rounded-md text-white font-semibold border-0' onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                {/* filter */}
                <div className="filters">
                    <div className=' flex flex-row p-4 ml-10 gap-4 '>
                        <div className=' flex flex-row p-2 border-2 border-slate-400 rounded-md gap-3'>
                            <FontAwesomeIcon icon={faFilter} className="text-slate-400 align-middle text-xl  " />
                            <h3 className=' text-slate-400'>Filters</h3>
                        </div>
                        <select
                            value={filterCriteria}
                            onChange={(e) => setFilterCriteria(e.target.value)}
                            className="px-3 py-1.5 border-2 border-slate-400 text-slate-400 rounded-md  appearance-none pr-10 relative  mr-4 "
                            style={{
                                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>')`,
                                backgroundPosition: 'right 0.75rem center',
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: '1rem',
                            }}
                        >
                            <option value="all">All</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                    </div>
                </div>
                <div className=' flex flex-row w-[100%] mx-auto justify-center gap-6'>
                    {['todo', 'inProgress', 'done'].map((section) => (
                        <Droppable key={section} droppableId={section}>
                            {(provided) => (
                                <div
                                    className="section border bg-[#F5F5F5] rounded-lg min-h-screen flex flex-col w-[30%] p-4"
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    <h2 className=' flex flex-row font-semibold text-xl'>
                                        <div
                                            className={` w-3 h-3 rounded-md bg-opacity-75 m-2 ${section === 'todo'
                                                ? 'bg-purple-500'
                                                : section === 'inProgress'
                                                    ? 'bg-yellow-500'
                                                    : section === 'done'
                                                        ? 'bg-green-500'
                                                        : 'bg-gray-800'
                                                }`}>
                                        </div>
                                        {section.replace(/([A-Z])/g, ' $1')}
                                    </h2>
                                    <div
                                        className={`border border-b-4 rounded-md border-opacity-75 m-2 ${section === 'todo'
                                            ? 'border-purple-500'
                                            : section === 'inProgress'
                                                ? 'border-yellow-500'
                                                : section === 'done'
                                                    ? 'border-green-500'
                                                    : 'border-gray-800'
                                            }`}>
                                    </div>
                                    <ul >
                                        {renderFilteredTasks(section).map((task, index) => (
                                            <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                                                {(provided) => (
                                                    <div>


                                                        <li
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className=' max-w-fill min-h-44 rounded-xl bg-white border p-4 m-4'
                                                        >

                                                            <div className=' flex flex-row justify-between'>
                                                                <div className={`border-0 w-fit font-normal px-1.5 rounded ${task.priority === 'low' ? 'bg-green-200 text-green-600 text-opacity-80' :
                                                                    task.priority === 'medium' ? 'bg-yellow-200 text-yellow-600 text-opacity-80' :
                                                                        'bg-red-200 text-red-600 text-opacity-80'
                                                                    }`}>
                                                                    <span className={`priority ${task.priority}`}>{task.priority}</span>
                                                                </div>
                                                                <div className=' flex flex-row gap-3 text-gray-500 '>
                                                                    <button
                                                                        className=' '
                                                                        onClick={() => handleEdit(task)}>
                                                                        <FontAwesomeIcon icon={faPenToSquare} />
                                                                        <i class="fa-solid fa-pen-to-square"></i>
                                                                    </button>
                                                                    <button
                                                                        className=''
                                                                        onClick={() => handleDelete(task.id)}>
                                                                        <FontAwesomeIcon icon={faTrash} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <div className=' pt-3 text-xl font-bold'>
                                                                {task.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500 line-clamp-2">{task.description}</div>


                                                        </li>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </ul>
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>

                <div >
                    {editMode && (
                        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
                                <h3 className="text-lg font-bold mb-4">Edit Task</h3>
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    placeholder="Edit task name"
                                    className="block w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                                />
                                <input
                                    type="text"
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    placeholder="Edit task description"
                                    className="block w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                                />
                                <select
                                    value={editPriority}
                                    onChange={(e) => setEditPriority(e.target.value)}
                                    className="block w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                                >
                                    <option value="high" className="text-red-500">High</option>
                                    <option value="medium" className="text-yellow-500">Medium</option>
                                    <option value="low" className="text-green-500">Low</option>
                                </select>
                                <div className="flex justify-end gap-4">
                                    <button
                                        onClick={handleSaveEdit}
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={() => setEditMode(null)}
                                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </DragDropContext>
    );
};

export default Dashboard;
