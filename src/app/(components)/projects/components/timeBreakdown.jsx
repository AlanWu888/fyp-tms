import React, { useState } from "react";
import NavTabs from "../../navigation/NavTabs-project";
import MySelect from "../../selects/select";

function TimeBreakdownComponent() {
  const selectOptions = [
    { value: "day", label: "Today" },
    { value: "week", label: "Week" },
    { value: "fortnight", label: "Fortnight" },
    { value: "month", label: "Month" },
    { value: "all", label: "All Time" },
  ];

  const [activeTab, setActiveTab] = useState("Tasks");
  const [mode, setMode] = useState(selectOptions[0]);
  const [date, setDate] = useState(new Date());

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
      case "fortnight":
        return "This Fortnight: ";
      case "month":
        return "This Month: ";
      case "all":
        return "All Time";
      default:
        return "";
    }
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
    } else if (mode.value === "fortnight") {
      const startOfFortnight = new Date(date);
      const dayOfMonth = date.getDate();
      const diff = dayOfMonth <= 15 ? 1 : 16;
      startOfFortnight.setDate(diff);

      const endOfFortnight = new Date(startOfFortnight);
      endOfFortnight.setDate(startOfFortnight.getDate() + 13);

      return `${startOfFortnight.toDateString()} - ${endOfFortnight.toDateString()}`;
    } else if (mode.value === "month") {
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      return `${startOfMonth.toDateString()} - ${endOfMonth.toDateString()}`;
    } else {
      return date.toDateString();
    }
  };

  return (
    <div style={{ marginBottom: "300px" }}>
      <div style={{ borderBottom: "1px solid black", paddingBottom: "3px" }}>
        <NavTabs
          items={["Tasks", "Team"]}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
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
                  <button onClick={"#"} className="button-dates">
                    <img src={"/arrow-l.png"} alt="Previous Day" />
                  </button>
                  <button onClick={"#"} className="button-dates">
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
            {/* Content for Tasks tab */}
            <h2>Tasks Content</h2>
            <p>This is the content for the Tasks tab.</p>
          </div>
        )}
        {activeTab === "Team" && (
          <div>
            {/* Content for Team tab */}
            <h2>Team Content</h2>
            <p>This is the content for the Team tab.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TimeBreakdownComponent;
