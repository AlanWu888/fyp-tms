import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

function WeekViewTimesheet({ date }) {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  const [timesheets, setTimesheets] = useState([]);
  const [filteredTimesheets, setFilteredTimesheets] = useState([]);
  const [weeklyTimesheets, setWeeklyTimesheets] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/Timesheets");
      if (!response.ok) {
        throw new Error("Failed to fetch timesheets");
      }
      const data = await response.json();
      setTimesheets(data.timesheets);
    } catch (error) {
      console.error("Error fetching timesheets:", error);
    }
  };

  const filterTimesheets = () => {
    const filteredTimesheets = timesheets.filter(
      (timesheet) => timesheet.userEmail === userEmail,
    );
    setFilteredTimesheets(filteredTimesheets);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterTimesheets();
  }, [timesheets, userEmail]);

  useEffect(() => {}, [date]);

  return (
    <div>
      {/* <div>
      {JSON.stringify(filteredTimesheets)}
    </div> */}
      <div>{date}</div>
    </div>
  );
}

export default WeekViewTimesheet;
