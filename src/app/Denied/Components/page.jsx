import MyComponents from "@/app/(components)/all-compoents";
import NavTabs from "@/app/(components)/navigation/NavTabs";
import React from "react";

const Components = () => {
  return (
    <div>
    <MyComponents />
    <NavTabs items={['Home', 'About', 'Services', 'Contact']}/>
    </div>
  );
};

export default Components;
