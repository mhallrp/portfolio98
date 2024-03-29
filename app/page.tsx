"use client";
import React, { useState, useEffect, useRef } from "react";
import { getSessionStatus } from "@/Model/authOutcalls";
import { Values } from "@/Types";
import TitleBar from "@/Components/TitleBar";
import Note from "@/Components/Note";
import Quiz from "@/Components/Quiz";
import TaskBar from "@/Components/TaskBar";
import Authentication from "@/Components/Authentication";
import ErrorView from "@/Components/ErrorView";
import { WindowData } from "@/Types";
import { AddNewWindow } from "@/Model/WindowLogic";

export default function App() {
  const [state, setState] = useState("login");
  const [values, setValues] = useState<Values[]>([]);
  const [userData, setUserData] = useState({ name: "", score: 0 });
  const [topZ, setTopZ] = useState(51);
  const [shutdown, setShutdown] = useState(false);
  const isInitialMount = useRef(true);

  useEffect(() => {
    const checkSession = async () => {
      const response = await getSessionStatus();
      setUserData(response.data);
      response.success ? setState("quiz") : AddNewWindow(setValues, "login", { title: "Welcome to portfolio 98", data: "" });
    };
    checkSession();
  }, []);

  useEffect(() => {
    isInitialMount.current
      ? (isInitialMount.current = false)
      : state === "quiz"
        ? setValues([])
        : AddNewWindow(setValues, "login", { title: "Welcome to portfolio 98", data: "" });
  }, [state]);

  return !shutdown ? (
    <div className="flex h-dvh w-screen overflow-hidden bg-windoorsGreen">
      <div className={`flex w-full flex-col items-center overflow-hidden`}>
        <div className="w-full overflow-hidden">
          {values.map((valueData) => {
            const close = valueData.type !== "error" && valueData.type !== "login";
            return (
              <TitleBar key={valueData.id} values={valueData} setValues={setValues} zIndex={topZ} updateZIndex={setTopZ} close={close}>
                {valueData.type === "note" ? (
                  <Note />
                  
                ) : valueData.type === "quiz" ? (
                  <Quiz setUserData={setUserData} setValues={setValues} values={valueData} userData={userData} />
                ) : valueData.type === "error" ? (
                  <ErrorView errorData={valueData.data as WindowData} values={valueData} setValues={setValues} />
                ) : (
                  <Authentication setState={setState} setValues={setValues} setUserData={setUserData} />
                )}
              </TitleBar>
            );
          })}
        </div>
        {state === "quiz" && (
          <TaskBar setState={setState} setValues={setValues} setShutdown={setShutdown} username={userData.name} setUserData={setUserData} />
        )}
      </div>
    </div>
  ) : (
    <div className="flex h-dvh w-screen overflow-hidden bg-black"></div>
  );
}
