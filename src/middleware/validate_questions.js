import { z } from "zod";

const QuestionSchema = z.array(z.object({
  id: z.string().min(1, "ID is required"),
  category: z.string().min(1, "Category is required"),
  question: z.string(),
  context: z.string(),
  hints: z.array(z.string()),
  evaluationRubric: z.object({
    scoringScale: z.string(),
    levels: z.object({
      "1": z.string(),
      "2": z.string(),
      "3": z.string(),
      "4": z.string(),
      "5": z.string(),
    }),
  }),
})).nonempty("Please provide at least one question");

export default function validateQuestions(req, res, next) {

    try{
        const result = QuestionSchema.safeParse(req.body.questions);

        if (!result.success) {

            const getNestedErrors = (error) => {
                const formattedErrors = {};

                for (const issue of error.issues) {
                    const path = issue.path.join('.'); 
                    if (!formattedErrors[path]) {
                    formattedErrors[path] = [];
                    }
                    formattedErrors[path].push(issue.message);
                }

                return formattedErrors;
            };

            return res.status(400).json({
                success: false,
                message: 'Validation failed for questions',
                errors: getNestedErrors(result.error)
            });
        }

    req.body = result.data;
    next();
    }
    catch(err){
        
        return res.status(500).json({
            success: false,
            message: 'Server failed to respond for job validation',
        });
    }
}