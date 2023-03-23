import React, { useState } from "react";
import { data } from "../data/data";

const handleKeybord = (e: React.KeyboardEvent<HTMLInputElement>) => {
  const [targetIndex, setTargetIndex] = useState<number>(-1);
  const [resultData, setResultData] = useState<Array<Data>>([]);
  const [searchText, setSearchText] = useState<string>("");

  const key = e.key;
  if (key !== "ArrowDown" && key !== "ArrowUp" && key !== "Enter") {
    return true;
  }

  e.preventDefault();
  let nowIndex = targetIndex;
  let prevIndex = 0;

  switch (key) {
    case "ArrowUp":
      nowIndex--;
      prevIndex = nowIndex + 1;

      if (nowIndex < 0) {
        nowIndex = resultData.length - 1;
        prevIndex = 0;
      }
      break;
    case "ArrowDown":
      nowIndex++;
      prevIndex = nowIndex - 1;
      if (nowIndex >= resultData.length || prevIndex < 0) {
        nowIndex = 0;
        prevIndex = resultData.length - 1;
      }
      break;
    case "Enter":
      if (nowIndex === -1) {
        return false;
      }
      setSearchText(resultData[nowIndex].name.replace(/(<([^>]+)>)/gi, ""));
      return false;
  }

  setResultData(
    resultData.map((item, index) => {
      if (index === nowIndex) {
        item.target = true;
      } else {
        item.target = false;
      }
      return item;
    })
  );
  setTargetIndex(nowIndex);
  setSearchText(resultData[nowIndex].data.replace(/(<([^>]+)>)/gi, ""));

  return {
    resultData,
    targetIndex,
    searchText,
  };
};

export default handleKeybord;
