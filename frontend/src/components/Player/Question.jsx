import React, { useState } from "react";

export default function Question({ question, onAnswerSelect, selectedAnswer }) {
  const [selectedOption, setSelectedOption] = useState(selectedAnswer || null);

  const handleOptionClick = (optionId) => {
    setSelectedOption(optionId);
    onAnswerSelect(question._id, optionId);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-3xl space-y-8">
      {/* Question box */}
      <div className="px-8 py-6 w-full text-center">
        <h2 className="text-2xl font-semibold">{question.question}</h2>
      </div>

      {/* Options grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
        {question.options.map((option) => (
          <div
            key={option._id}
            className={`btn btn-lg rounded-md text-lg font-medium h-20 transition-all duration-200
              ${
                selectedOption === option._id
                  ? "btn-accent scale-102"
                  : "btn hover:brightness-110"
              }`}
            onClick={() => handleOptionClick(option._id)}
          >
            {option.text}
          </div>
        ))}
      </div>
    </div>
  );
}
