import { parseFile } from '../utils/parser.js';
import { extractData } from '../utils/extractor.js';

export const uploadResume = async (req, res) => {
  try {
    const filePath = req.file.path;

    const text = await parseFile(filePath);
    const data = extractData(text);

    res.json({
      message: "Resume processed",
      data
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
