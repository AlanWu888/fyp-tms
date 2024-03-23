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
            users: [{ email: timesheet.userEmail, time: timesheet.time }],
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
          users: [{ email: timesheet.userEmail, time: timesheet.time }],
        });
      } else {
        const userIndex = result.taskDescriptions[
          timesheet.taskDescription
        ].taskTypes[taskTypeIndex].users.findIndex(
          (user) => user.email === timesheet.userEmail,
        );

        if (userIndex === -1) {
          result.taskDescriptions[timesheet.taskDescription].taskTypes[
            taskTypeIndex
          ].users.push({ email: timesheet.userEmail, time: timesheet.time });
        } else {
          result.taskDescriptions[timesheet.taskDescription].taskTypes[
            taskTypeIndex
          ].users[userIndex].time += timesheet.time;
        }
      }
    }
  });

  return result;
};
