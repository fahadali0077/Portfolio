const Skill = require('../models/Skill');

// Get all skills
exports.getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ category: 1, order: 1 });
    
    // Group skills by category
    const groupedSkills = skills.reduce((acc, skill) => {
      const category = skill.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(skill);
      return acc;
    }, {});
    
    res.json({
      success: true,
      count: skills.length,
      data: groupedSkills
    });
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch skills'
    });
  }
};

// Get skills by category
exports.getSkillsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const skills = await Skill.find({ category }).sort({ order: 1 });
    
    res.json({
      success: true,
      count: skills.length,
      data: skills
    });
  } catch (error) {
    console.error('Error fetching skills by category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch skills'
    });
  }
};
