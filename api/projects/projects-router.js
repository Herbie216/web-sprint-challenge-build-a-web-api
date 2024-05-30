const express = require('express');
const router = express.Router();
const Project = require('./projects-model');
const { validateProjectId, errorHandler, validateProjectData } = require('./projects-middleware');

router.get('/', async (req, res) => {
    try {
        const projects = await Project.get(); 
        res.json(projects);
    } catch (error) {
        errorHandler.next(error);
    }
});

router.get('/:id', validateProjectId, (req, res) => {
    res.json(req.project);
});

router.post('/', validateProjectData, async (req, res, next) => {
    try {
        const { name, description, completed } = req.body;
        const newProject = await Project.insert({ name, description, completed }); 
        if (newProject) {
            res.status(201).json(newProject); 
        } else {
            res.status(500).json({ message: 'Error creating project' }); 
        }
    } catch (error) {
        next(error);
    }
});

router.put('/:id', validateProjectId, validateProjectData, async (req, res, next) => {
    try {
        const { name, description, completed } = req.body;
        const { id } = req.params;
        const changes = { name, description, completed }; 
        const updatedProject = await Project.update(id, changes);
        
        if (updatedProject) {
            res.json(updatedProject); 
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', validateProjectId, async (req, res) => {
    const { id } = req.params;

    try {
        const deletedCount = await Project.remove(Number(id));
        
        if (deletedCount > 0) {
            res.status(204).end(); 
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        errorHandler.next(error);
    }
});

router.get('/:id/actions', validateProjectId, async (req, res) => {
    try {
        const projectId = req.params.id;
        const actions = await Project.getProjectActions(projectId);
        res.json(actions);
    } catch (error) {
        errorHandler.next(error);
    }
});

module.exports = router;
