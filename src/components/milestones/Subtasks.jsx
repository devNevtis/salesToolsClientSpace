// src/components/milestones/Subtasks.js
import useMilestonesStore from '@/store/useMilestonesStore';

const Subtasks = ({ milestoneId, taskId, subtasks }) => {
  const { addSubtask, updateSubtask, deleteSubtask } = useMilestonesStore();

  const handleAdd = () => {
    const newSubtask = {
      id: `st-${Date.now()}`,
      title: 'Nueva Subtarea',
      description: '',
      completed: false,
    };
    addSubtask(milestoneId, taskId, newSubtask);
  };

  return (
    <div>
      <h4>Subtasks</h4>
      <ul>
        {subtasks.map((subtask) => (
          <li key={subtask.id}>
            <input
              type="text"
              value={subtask.title}
              onChange={(e) =>
                updateSubtask(milestoneId, taskId, subtask.id, {
                  title: e.target.value,
                })
              }
            />
            <button onClick={() => deleteSubtask(milestoneId, taskId, subtask.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      <button onClick={handleAdd}>Add Subtask</button>
    </div>
  );
};

export default Subtasks;
