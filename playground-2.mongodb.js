// conectar a la base de datos
use('acco');

// crea la coleccion de usuarios con validacion
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'email', 'password'],
      properties: {
        name: {
          bsonType: 'string',
          description: 'User full name'
        },
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
          description: 'Valid email address'
        },
        password: {
          bsonType: 'string',
          description: 'Hashed password'
        },
        avatar: {
          bsonType: 'string'
        },
        role: {
          enum: ['user', 'admin'],
          description: 'User role in the system'
        },
        isActive: {
          bsonType: 'bool'
        },
        lastLogin: {
          bsonType: 'date'
        },
        createdAt: {
          bsonType: 'date'
        },
        updatedAt: {
          bsonType: 'date'
        }
      }
    }
  }
});

// crea la coleccion de proyectos
db.createCollection('projects', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'owner'],
      properties: {
        name: {
          bsonType: 'string',
          minLength: 3,
          maxLength: 100
        },
        description: {
          bsonType: 'string',
          maxLength: 500
        },
        owner: {
          bsonType: 'objectId',
          description: 'User ID of the project owner'
        },
        color: {
          bsonType: 'string'
        },
        status: {
          enum: ['active', 'completed', 'archived', 'on-hold']
        },
        priority: {
          enum: ['low', 'medium', 'high', 'urgent']
        },
        startDate: {
          bsonType: 'date'
        },
        dueDate: {
          bsonType: 'date'
        },
        tags: {
          bsonType: 'array',
          items: {
            bsonType: 'string'
          }
        },
        collaborators: {
          bsonType: 'array',
          items: {
            bsonType: 'objectId'
          }
        },
        isArchived: {
          bsonType: 'bool'
        },
        createdAt: {
          bsonType: 'date'
        },
        updatedAt: {
          bsonType: 'date'
        }
      }
    }
  }
});

// crea la coleccion de tareas
db.createCollection('tasks', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['title', 'project', 'createdBy'],
      properties: {
        title: {
          bsonType: 'string',
          minLength: 3,
          maxLength: 200
        },
        description: {
          bsonType: 'string',
          maxLength: 1000
        },
        project: {
          bsonType: 'objectId'
        },
        assignedTo: {
          bsonType: 'objectId'
        },
        createdBy: {
          bsonType: 'objectId'
        },
        status: {
          enum: ['todo', 'in-progress', 'review', 'completed', 'blocked']
        },
        priority: {
          enum: ['low', 'medium', 'high', 'urgent']
        },
        dueDate: {
          bsonType: 'date'
        },
        completedAt: {
          bsonType: 'date'
        },
        estimatedHours: {
          bsonType: 'number'
        },
        actualHours: {
          bsonType: 'number'
        },
        tags: {
          bsonType: 'array'
        },
        position: {
          bsonType: 'number'
        },
        createdAt: {
          bsonType: 'date'
        },
        updatedAt: {
          bsonType: 'date'
        }
      }
    }
  }
});

// crea los indices para mejor rendimiento
db.users.createIndex({ email: 1 }, { unique: true });
db.projects.createIndex({ owner: 1, status: 1 });
db.tasks.createIndex({ project: 1, status: 1 });

print('Base de datos ACCO creada exitosamente');