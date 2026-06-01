const Project = require('../models/Project');
const Task = require('../models/Task');

/**
 * @desc    obtiene todos los proyectos del usuario
 * @route   GET /api/projects
 * @access  Private
 */
exports.getProjects = async (req, res, next) => {
  try {
    const { status, priority, search } = req.query;
    
    // construye filtros
    let filters = { 
      owner: req.user.id,
      isArchived: false
    };

    if (status) filters.status = status;
    if (priority) filters.priority = priority;

    let projects = await Project.find(filters)
      .populate('collaborators', 'name email avatar')
      .sort({ createdAt: -1 });

    // filtro de busqueda por texto
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      projects = projects.filter(project => 
        searchRegex.test(project.name) || 
        searchRegex.test(project.description)
      );
    }

    // calcula el progreso para cada proyecto
    const projectsWithProgress = await Promise.all(
      projects.map(async (project) => {
        const progress = await project.calculateProgress();
        return {
          ...project.toObject(),
          progress
        };
      })
    );

    res.json({
      success: true,
      count: projectsWithProgress.length,
      data: {
        projects: projectsWithProgress
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    obtiene un proyecto por id
 * @route   GET /api/projects/id
 * @access  Private
 */
exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('collaborators', 'name email avatar')
      .populate({
        path: 'tasks',
        options: { sort: { position: 1 } }
      });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // verifica los permisos
    if (project.owner.toString() !== req.user.id && 
        !project.collaborators.some(collab => collab._id.toString() === req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this project'
      });
    }

    const progress = await project.calculateProgress();
    const stats = await Task.getProjectStats(project._id);

    res.json({
      success: true,
      data: {
        project: {
          ...project.toObject(),
          progress,
          stats
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    crea un nuevo proyecto
 * @route   POST /api/projects
 * @access  Private
 */
exports.createProject = async (req, res, next) => {
  try {
    const { name, description, color, priority, dueDate, tags } = req.body;

    const project = await Project.create({
      name,
      description,
      color,
      priority,
      dueDate,
      tags,
      owner: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: {
        project
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    actualiza el proyecto
 * @route   PUT /api/projects/id
 * @access  Private
 */
exports.updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // verifica los permisos - solo el owner puede actualizar
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this project'
      });
    }

    const allowedUpdates = ['name', 'description', 'color', 'status', 'priority', 'dueDate', 'tags'];
    const updates = {};

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    project = await Project.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('collaborators', 'name email avatar');

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: {
        project
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    elimina el proyecto
 * @route   DELETE /api/projects/id
 * @access  Private
 */
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // verifica los permisos
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this project'
      });
    }

    // elimina todas las tareas del proyecto
    await Task.deleteMany({ project: project._id });

    // elimina el proyecto
    await Project.findByIdAndDelete(req.params.id);
    await Task.deleteMany({ project: req.params.id })

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    archivar/desarchivar proyecto
 * @route   PUT /api/projects/id/archive
 * @access  Private
 */
exports.toggleArchive = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to archive this project'
      });
    }

    project.isArchived = !project.isArchived;
    await project.save();

    res.json({
      success: true,
      message: `Proyecto ${project.isArchived ? 'archivado' : 'desarchivado'} exitosamente`,
      data: {
        project
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    agrega un colaborador al proyecto
 * @route   POST /api/projects/id/collaborators
 * @access  Private
 */
exports.addCollaborator = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the Owner can add collaborators'
      });
    }

    if (project.collaborators.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'User is already a collaborator'
      });
    }

    project.collaborators.push(userId);
    await project.save();

    await project.populate('collaborators', 'name email avatar');

    res.json({
      success: true,
      message: 'Collaborator added successfully',
      data: {
        project
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    obtiene las estadisticas del proyecto
 * @route   GET /api/projects/id/stats
 * @access  Private
 */
exports.getProjectStats = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const stats = await Task.getProjectStats(project._id);
    const overdueTasks = await Task.findOverdue(project._id);
    const progress = await project.calculateProgress();

    res.json({
      success: true,
      data: {
        stats: {
          ...stats,
          progress,
          overdueCount: overdueTasks.length
        }
      }
    });
  } catch (error) {
    next(error);
  }
};