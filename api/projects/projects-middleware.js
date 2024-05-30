const Project = require('./projects-model');

async function validateProjectId(req, res, next) {
    const { id } = req.params;
    try {
        const project = await Project.get(id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        req.project = project;
        next();
    } catch (error) {
        console.error('Error validating project id:', error);
        res.status(500).json({ message: 'Error validating project id' });
    }
}

function errorHandler(err, req, res, next) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
}

function validateProjectData(req, res, next) {
    const { name, description, completed } = req.body;
    const errors = [];

    if (!name) {
        errors.push('Name is required');
    }

    if (!description) {
        errors.push('Description is required');
    }

    if (completed === undefined) {
        errors.push('Completed status is required');
    }

    if (errors.length > 0) {
        res.status(400).json({ message: 'Validation Error', errors });
    } else {
        next();
    }
}

module.exports = {
    validateProjectId,
    errorHandler,
    validateProjectData
};
