import React, {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
} from "react";
import { data } from "../data/data";
import "../styles/Auto.css";

interface Data {
  data: any;
  target: boolean;
  id: string;
  age: number;
  name: string;
  gender: string;
  email: string;
  phone: string;
  address: string;
}

const AutoComplete = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [debounceTextValue, setDebounceTextValue] = useState<string>("");
  const [resultData, setResultData] = useState<Array<Data>>([]);
  const [targetIndex, setTargetIndex] = useState<number>(-1);
  const [hover, setHover] = useState<boolean>(false);
  const [isHidden, setIsHidden] = useState(true);

  //input 검색어
  const debounceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.currentTarget.value);
  };
  //debounce 처리된 input 값
  const debounceTextChange = (searchValue: string) => {
    setDebounceTextValue(searchValue);
  };

  //debounce 일정 시간 처리
  const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };
  const debounceValue = useDebounce(searchText, 300);

  //debounce 처리
  useEffect(() => {
    // const data: Array<Data> = [];
    // const textArr: Array<string> = debounceValue.split(" ");

    // setResultData(data.filter((item) => {}));
    if (debounceValue) {
      debounceTextChange(debounceValue);
    } else {
      setDebounceTextValue("");
    }
  }, [debounceValue]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
  };

  const onMouseOver = (event: MouseEvent) => {
    event.currentTarget.className = "hover";
  };
  const onMouseLeave = (event: MouseEvent) => {
    event.currentTarget.className = "list";
  };

  const onResultClick = (event: MouseEvent) => {
    const { textContent } = event.currentTarget;
    setResultData(textContent as any);
    setDebounceTextValue(textContent as string);
    setIsHidden(true);
  };

  const userData = [...data].filter(
    (item) => item.name.includes(debounceValue)
    // || item.age.includes(debounceValue),
  );
  // console.log(userData);

  return (
    <>
      <div>
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          onChange={
            // (e) => setSearchText(e.target.value)
            debounceChange
          }
          value={searchText}
          className="input"
        />
        <div className="list">
          <ul className="ul">
            {userData.length > 0 && searchText !== "" ? (
              userData.slice(0, 5).map((data, index) => {
                console.log(data.name);
                return (
                  <li
                    key={index}
                    onClick={onResultClick}
                    // hidden={!userData.includes(debounceValue as any)}
                    onMouseOver={onMouseOver}
                    onMouseLeave={onMouseLeave}
                  >
                    {data.name}
                  </li>
                );
              })
            ) : (
              <li>검색 결과가 없습니다.</li>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default AutoComplete;
