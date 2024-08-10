const Application = require('../models/applicationModel');

// To add new application
exports.createApplication = async (req, res ) => {
  try {
    const newApplication = new Application(req.body)
    const savedApplication = await newApplication.save():
    res.status(201).json(savedApplication);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
};

// To get all applications

exports.getApplications = async (req, res ) => {
  try {
    const applications = await Application.find();
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lookup single application by ID
exports.updateApplication = async (req, res ) => {
  try {
    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, rundValidators: true }
    );
    if (!updatedApplication) return res.status(404).json({ message: 'Application not found' });
    res.json(updatedApplication);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//jto remove an application by ID
exports.deleteApplication = async ( req, res ) => {
  try {
    const deletedApplication = await Application.findByIdAndDelete(req.params.id);
    if (!deletedApplication) return res.status(404).json({ message: 'Application not found' });
    res.json({ message: 'Application deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
