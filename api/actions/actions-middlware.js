const { get } = require('./actions-model')

async function validateActionId(req, res, next) {
    const { id } = req.params;
    try {
        const action = await get(Number(id)); 
        if (!action) {
            return res.status(404).json({ message: 'Action not found' });
        }
        req.action = action;
        next();
    } catch (error) {
        console.error('Error validating action ID:', error);
        res.status(500).json({ message: 'Error validating action ID' });
    }
}

function errorHandler(err, req, res, next) {  // eslint-disable-line
    console.error('Error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
}

function validateActionData(req, res, next) {
    const { project_id, description, notes } = req.body;
    const errors = [];

    if (!project_id) {
        errors.push('Project ID is required');
    }

    if (!description) {
        errors.push('Description is required');
    }

    if (!notes) {
        errors.push('Notes are required');
    }

    if (errors.length > 0) {
        res.status(400).json({ message: 'Validation Error', errors });
    } else {
        next();
    }
}

module.exports = {
    validateActionId,
    errorHandler,
    validateActionData
};
