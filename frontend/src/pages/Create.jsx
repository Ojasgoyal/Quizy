import React from "react";
import axios from "axios";
import { useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function Create() {
  const apiUrl = import.meta.env.VITE_BACKEND_URL
  const clerk = useClerk();
  const navigate = useNavigate()

  const handleCreateQuiz = async () => {
    try {
      const token = await clerk.session.getToken();

      const res = await axios.post(
        `${apiUrl}/create`,
        {},
        {
          headers:{
            Authorization: `Bearer ${token}`,
            "Content-Type":"application/json",
          },
        }
      );

      const {data} = res.data
      const quizId = data._id.toString();

      navigate(`/quiz/edit/${quizId}`)

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex justify-center p-2 items-center">
        <div className="flex p-4 justify-center items-center w-1/2">
          <h2 className="bg-clip-text text-4xl font-bold text-transparent bg-gradient-to-r from-accent to-primary">Time to Create Some Quizzes</h2>
        </div>
        <div className="flex justify-end p-4 items-center w-1/2">
          <button onClick={handleCreateQuiz} className="btn btn-primary mr-10">
            Create
          </button>
        </div>
      </div>
    </>
  );
}
