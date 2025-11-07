import mongoose,{Schema} from "mongoose";

const answerSchema = new Schema({
    questionId: { type: Schema.Types.ObjectId,ref:"Quiz.questions", required: true },
    answerGiven: { type: Schema.Types.ObjectId,ref:"Quiz.questions.options"},
    isCorrect: { type: Boolean, required: true },
})

const attemptSchema = new Schema({
    quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
    playerClerkId: { type: String},
    playerName: { type: String , required: true},
    score:{type:Number, required:true , default:0},
    answers: [answerSchema],  
}, { timestamps: true })

export const Attempt = mongoose.model("Attempt", attemptSchema)