const express = require('express');
const router = express.Router();
const { validateActionId, errorHandler, validateActionData } = require('./actions-middlware');
const Action = require('./actions-model')

router.get('/', async (req, res) => {
    try {
        const allActions = await Action.get(); 
        res.json(allActions);
    } catch (error) {
        errorHandler.next(error);
    }
});

router.get('/:id', validateActionId, async (req, res) => {
    try {
        const action = req.action; 
        res.json(action);
    } catch (error) {
        errorHandler.next(error);
    }
});

router.post('/', validateActionData, async (req, res, next) => {
    try {
        const { project_id, description, notes } = req.body;
        const existingProject = true; // You should implement project existence check
        if (!existingProject) {
            return res.status(400).json({ message: 'Project ID does not exist' });
        }
        
        const newAction = await Action.insert({ project_id, description, notes }); 
        res.status(201).json(newAction);
    } catch (error) {
        errorHandler(error, req, res, next);
    }
});

router.put('/:id', validateActionId, validateActionData, async (req, res, next) => {
    try {
        const { project_id, description, notes, completed } = req.body;
        const { id } = req.params;
        
        const actionToUpdate = await Action.get(id);
        if (!actionToUpdate) {
            return res.status(404).json({ message: 'Action not found' });
        }
        
        actionToUpdate.project_id = project_id;
        actionToUpdate.description = description;
        actionToUpdate.notes = notes;
        actionToUpdate.completed = completed; 

        const updatedAction = await Action.update(id, actionToUpdate);
        
        res.json(updatedAction);
    } catch (error) {
        errorHandler(error, req, res, next);
    }
});

router.delete('/:id', validateActionId, async (req, res) => {
    const { id } = req.params;
    
    try {
        await Action.remove(id);
        
        res.status(204).end();
    } catch (error) {
        errorHandler.next(error);
    }
});

module.exports = router;
