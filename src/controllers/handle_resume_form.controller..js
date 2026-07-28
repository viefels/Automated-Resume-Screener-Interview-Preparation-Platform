
export default function handleFormRoute(req, res){
    try{
        const candidateData = req.body.validatedCandidate;
        
        return res.status(201).json({
            success: true,
            data: "Resume successfully saved"
        });

    }catch(err){
        return res.status(500).json({
            success: false,
            message: 'Server error while saving candidate'
        });
    }
}