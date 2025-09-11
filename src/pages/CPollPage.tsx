import React from "react";
import { useForm, useFieldArray, } from "react-hook-form";
import type{SubmitHandler } from "react-hook-form";
import "./CPollPage.css"
import {selectAuthUser} from "../Features/auth/authSlice"
import { useAppSelector } from '../app/hook'
import { useAppDispatch } from "../app/hook";
import {PollCreate} from "../Features/Poll/pollSlice"
interface ISHOWPOLL {
  setShowPoll: React.Dispatch<React.SetStateAction<boolean>>;
}

type PollFormValues = {
  question: string;
  options: { value: string }[];
  ExpiredAt:Date
};

const CPollPage: React.FC<ISHOWPOLL> = ({ setShowPoll }) => {
  const { register, handleSubmit, control } = useForm<PollFormValues>({
    defaultValues: {
      question: "",
      options: [{ value: "" }, { value: "" }], 
    },
  });
const user=useAppSelector(selectAuthUser);
const Dispatch=useAppDispatch();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });
 

  const createdBy = user?.name ?? "";
  const onSubmit: SubmitHandler<PollFormValues> = (data) => {
    console.log("Poll Data:", data);
    const realdata={
      ExpiredAt:data.ExpiredAt,
      Question:data.question,
    Option:data.options,
      createdBy
    }
    console.log("realdata",realdata);
    Dispatch(PollCreate(realdata));
    setShowPoll(false); 
  };

  return (
    <div className="poll-container">
      <h1 className="poll-title">Create Poll</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="poll-form">


       <div className="form-group">
          <label>Expired At</label>
          <input type="datetime-local"
            {...register("ExpiredAt", { required: true })}
            
          />
        </div>
    
        <div className="form-group">
          <label>Question</label>
          <input
            {...register("question", { required: true })}
            placeholder="Enter your question"
          />
        </div>

       
        <div className="form-group">
          <label>Options</label>
          {fields.map((field, index) => (
            <div key={field.id} className="option-row">
              <input
                {...register(`options.${index}.value`, { required: true })}
                placeholder={`Option ${index + 1}`}
              />
              {fields.length > 2 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="remove-btn"
                >
                  ❌
                </button>
              )}
            </div>
          ))}

      
          {fields.length < 4 && (
            <button
              type="button"
              onClick={() => append({ value: "" })}
              className="add-btn"
            >
              ➕ Add Option
            </button>
          )}
        </div>

        <div className="button-group">
          <button type="submit" className="submit-btn">
            Submit Poll
          </button>
          <button
            type="button"
            onClick={() => setShowPoll(false)}
            className="cancel-btn"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CPollPage;
