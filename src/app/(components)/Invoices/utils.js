export const createUniqueTasksFromTimesheets = (filteredTimesheets) => {
  const result = {
    clientName: "",
    projectName: "",
    taskDescriptions: {},
  };

  filteredTimesheets.forEach((timesheet) => {
    if (!result.clientName) {
      result.clientName = timesheet.clientName;
      result.projectName = timesheet.projectName;
    }

    if (!result.taskDescriptions[timesheet.taskDescription]) {
      result.taskDescriptions[timesheet.taskDescription] = {
        taskTypes: [
          {
            type: timesheet.taskType,
            users: [timesheet.userEmail],
            time: timesheet.time,
          },
        ],
      };
    } else {
      const taskTypeIndex = result.taskDescriptions[
        timesheet.taskDescription
      ].taskTypes.findIndex((tt) => tt.type === timesheet.taskType);

      if (taskTypeIndex === -1) {
        result.taskDescriptions[timesheet.taskDescription].taskTypes.push({
          type: timesheet.taskType,
          users: [timesheet.userEmail],
          time: timesheet.time,
        });
      } else {
        if (
          !result.taskDescriptions[timesheet.taskDescription].taskTypes[
            taskTypeIndex
          ].users.includes(timesheet.userEmail)
        ) {
          result.taskDescriptions[timesheet.taskDescription].taskTypes[
            taskTypeIndex
          ].users.push(timesheet.userEmail);
          result.taskDescriptions[timesheet.taskDescription].taskTypes[
            taskTypeIndex
          ].time += timesheet.time;
        }
      }
    }
  });

  return result;
};
