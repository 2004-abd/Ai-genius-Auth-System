const freeModel = (req, res) => {
  return res.status(200).json({
    success: true,
    model: "AI-Genius Free Text Model",
    message: "Free AI model accessed successfully by logged-in user.",
    sampleOutput: "Here is a basic AI-generated text response.",
    user: req.user
  });
};

const premiumModel = (req, res) => {
  const prompt = req.body.prompt || "Generate a professional SaaS product tagline.";

  return res.status(200).json({
    success: true,
    model: "AI-Genius Premium Text/Image Model",
    message: "Premium AI model accessed successfully.",
    inputPrompt: prompt,
    sampleOutput: "AI-Genius helps teams create smarter content with secure premium AI workflows.",
    user: req.user
  });
};

const purgeCache = (req, res) => {
  return res.status(200).json({
    success: true,
    action: "PURGE_CACHE",
    message: "AI model cache purged successfully. Admin-only endpoint executed.",
    performedBy: req.user
  });
};

module.exports = {
  freeModel,
  premiumModel,
  purgeCache
};
