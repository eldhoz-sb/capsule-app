
import React from "react";
import SaltItem from "./SaltItem";
import "./SaltItemList.css";

function SaltItemList({ salts }) {
  return (
    <>
      {salts.map((salt, index) => (
        <SaltItem key={index} salt={salt} />
      ))}
    </>
  );
}

export default SaltItemList;