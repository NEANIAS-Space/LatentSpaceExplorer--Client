import api from 'app/api';
import sleep from 'app/utils/chronos';

const getTask = async (taskId) => {
    const result = await api()
        .get(`/tasks/${taskId}`)
        .then((task) => {
            if (task.status === 'SUCCESS') {
                return task;
            }
            return sleep(5000).then(() => getTask(task.task_id));
        });

    return result;
};

export default getTask;
