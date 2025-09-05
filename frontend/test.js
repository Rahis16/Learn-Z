const quizes = [
    {
        question: "What is the capital of France?",
        options: ["Berlin", "Madrid", "Paris", "Rome"],
        answer: "Paris"
    },
    {
        question: "What is 2 + 2?",
        options: ["3", "4", "5", "6"],
        answer: "4"
    }
]

const airesponse = await ai.getStructuredOutput({
    prmomt: context,
    schema: Array > { question, options: Array, answer: String}
})