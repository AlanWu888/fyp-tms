import React, { useEffect, useState } from "react";
import NavTabs from "../../navigation/NavTabs-project";
import MySelect from "../../selects/select";
import BreakDownTable from "./breakdownTable";
import Button from "../../buttons/Button";
import { COLOURS } from "@/app/constants";
import AddUserModal from "../manager/modals/addUser";
import UsersTable from "./usersTable";

function TimeBreakdownComponent({
  timesheets,
  currentProject,
  addMemberModalOpen,
  setAddMemberModalOpen,
}) {
  const selectOptions = [
    { value: "day", label: "Today" },
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
    { value: "year", label: "Year" },
    { value: "all", label: "All Time" },
  ];

  const [activeTab, setActiveTab] = useState();
  const [mode, setMode] = useState(selectOptions[0]);
  const [date, setDate] = useState(new Date());
  const [timeByTask, setTimeByTask] = useState({});
  const [timeByUser, setTimeByUser] = useState({});

  const handleSelectChange = (mode) => {
    setMode(mode);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const getModeString = () => {
    switch (mode.value) {
      case "day":
        return "Today: ";
      case "week":
        return "This Week: ";
      case "month":
        return "This Month: ";
      case "year":
        return "This Year: ";
      case "all":
        return "All Time";
      default:
        return "";
    }
  };

  const incrementDate = () => {
    const newDate = new Date(date);
    switch (mode.value) {
      case "day":
        newDate.setDate(newDate.getDate() + 1);
        break;
      case "week":
        newDate.setDate(newDate.getDate() + 7);
        break;
      case "month":
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case "year":
        newDate.setFullYear(newDate.getFullYear() + 1);
        break;
      default:
        break;
    }
    setDate(newDate);
  };

  const decrementDate = () => {
    const newDate = new Date(date);
    switch (mode.value) {
      case "day":
        newDate.setDate(newDate.getDate() - 1);
        break;
      case "week":
        newDate.setDate(newDate.getDate() - 7);
        break;
      case "month":
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      case "year":
        newDate.setFullYear(newDate.getFullYear() - 1);
        break;
      default:
        break;
    }
    setDate(newDate);
  };

  const renderDateText = () => {
    if (mode.value === "week") {
      const startOfWeek = new Date(date);
      const dayOfWeek = date.getDay();
      const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      startOfWeek.setDate(diff);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      return `${startOfWeek.toDateString()} - ${endOfWeek.toDateString()}`;
    } else if (mode.value === "month") {
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      return `${startOfMonth.toDateString()} - ${endOfMonth.toDateString()}`;
    } else if (mode.value === "year") {
      const startOfYear = new Date(date.getFullYear(), 0, 1);
      const endOfYear = new Date(date.getFullYear(), 11, 31);
      return `${startOfYear.toDateString()} - ${endOfYear.toDateString()}`;
    } else {
      return date.toDateString();
    }
  };

  function transformDataByTasks() {
    const transformedData = {
      Billable: [],
      "Non-Billable": [],
      Research: [],
    };

    timesheets.forEach((item) => {
      const { taskDescription, time, date, taskType } = item;

      const newItem = { taskDescription, time, date };

      if (taskType === "Billable") {
        transformedData.Billable.push(newItem);
      } else if (taskType === "Non-Billable") {
        transformedData["Non-Billable"].push(newItem);
      } else if (taskType === "Research") {
        transformedData.Research.push(newItem);
      }
    });

    return transformedData;
  }

  function transformDataByUser() {
    const transformedData = {};

    timesheets.forEach((item) => {
      const { userEmail, time, date } = item;

      if (!transformedData[userEmail]) {
        transformedData[userEmail] = [];
      }
      transformedData[userEmail].push({ time, date });
    });

    currentProject[0].memberEmails.forEach((email) => {
      if (!transformedData[email]) {
        transformedData[email] = [{ time: 0, date: null }];
      }
    });

    return transformedData;
  }

  function groupTasksByDescription(data) {
    const groupedTasks = {};

    data.forEach((item) => {
      if (groupedTasks[item.taskDescription]) {
        groupedTasks[item.taskDescription].push({
          time: item.time,
          date: item.date,
        });
      } else {
        groupedTasks[item.taskDescription] = [
          {
            time: item.time,
            date: item.date,
          },
        ];
      }
    });

    return groupedTasks;
  }

  const handleAddUser = () => {
    setAddMemberModalOpen(true);
  };

  useEffect(() => {
    setTimeByTask(transformDataByTasks);
    setTimeByUser(transformDataByUser);
  }, [timesheets]);

  return (
    <div style={{ marginBottom: "300px" }}>
      <div
        style={{
          borderBottom: "1px solid black",
          paddingBottom: "3px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <NavTabs
          items={["Tasks", "Team"]}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
        <div>
          {activeTab === "Team" && (
            <Button
              bgcolour={COLOURS.GREEN_ENABLED}
              colour={COLOURS.WHITE}
              label="+ Add user"
              onClick={handleAddUser}
            />
          )}
        </div>
      </div>
      <div>
        <div
          className="header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingTop: "10px",
            paddingBottom: "10px",
          }}
        >
          <div
            className="date-counter"
            style={{ display: "flex", alignItems: "center" }}
          >
            <div>
              {mode.value !== "all" ? (
                <div style={{ width: "95px" }}>
                  <button onClick={decrementDate} className="button-dates">
                    <img src={"/arrow-l.png"} alt="Previous Day" />
                  </button>
                  <button onClick={incrementDate} className="button-dates">
                    <img src={"/arrow-r.png"} alt="Next Day" />
                  </button>
                </div>
              ) : (
                <div style={{ width: "95px" }}></div>
              )}
            </div>
            <h2 className="date-text">
              <b>{getModeString()}</b>
              {mode.value !== "all" ? <>{renderDateText()}</> : null}
            </h2>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <p style={{ marginRight: "10px" }}>view by:</p>
            <div>
              <MySelect
                options={selectOptions}
                value={mode}
                onChange={handleSelectChange}
                isRequired={false}
              />
            </div>
          </div>
        </div>

        {activeTab === "Tasks" && (
          <div>
            {Object.keys(timeByTask).map((category) => (
              <div key={category}>
                <BreakDownTable
                  header={`${category} Tasks`}
                  mode={mode.value}
                  data={groupTasksByDescription(timeByTask[category])}
                  type={"tasks"}
                  date={date}
                />
              </div>
            ))}
          </div>
        )}
        {activeTab === "Team" && (
          <div>
            <div>
              <UsersTable
                header={"Team Member"}
                mode={mode.value}
                data={timeByUser}
                currentProject={currentProject}
                date={date}
              />
            </div>
          </div>
        )}
      </div>
      {addMemberModalOpen && (
        <AddUserModal
          onClose={() => setAddMemberModalOpen(false)}
          currentProject={currentProject}
        />
      )}
    </div>
  );
}

export default TimeBreakdownComponent;
