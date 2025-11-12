'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Users table
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      role: {
        type: Sequelize.ENUM('admin', 'teacher', 'student'),
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      profile_photo: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      class_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      suspended: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex('users', ['email'], { unique: true });
    await queryInterface.addIndex('users', ['role']);
    await queryInterface.addIndex('users', ['class_id']);

    // Classes table
    await queryInterface.createTable('classes', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      teacher_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex('classes', ['teacher_id']);

    // Courses table
    await queryInterface.createTable('courses', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      teacher_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      class_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'classes',
          key: 'id',
        },
      },
      lesson_notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex('courses', ['teacher_id']);
    await queryInterface.addIndex('courses', ['class_id']);

    // Exams table
    await queryInterface.createTable('exams', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      course_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'courses',
          key: 'id',
        },
      },
      title: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('mcq', 'written', 'mixed'),
        allowNull: false,
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      available_from: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      available_until: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex('exams', ['course_id']);

    // Questions table
    await queryInterface.createTable('questions', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      exam_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'exams',
          key: 'id',
        },
      },
      question_text: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      options: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      answer_key: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      word_limit: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      points: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex('questions', ['exam_id']);

    // Student Exams table
    await queryInterface.createTable('student_exams', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      exam_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'exams',
          key: 'id',
        },
      },
      answers: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      score: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      },
      ai_remarks: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      submitted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex('student_exams', ['student_id', 'exam_id'], { unique: true });
    await queryInterface.addIndex('student_exams', ['exam_id']);

    // AI Remarks table
    await queryInterface.createTable('ai_remarks', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      student_exam_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'student_exams',
          key: 'id',
        },
      },
      course_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'courses',
          key: 'id',
        },
      },
      score: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      remark: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex('ai_remarks', ['student_exam_id']);
    await queryInterface.addIndex('ai_remarks', ['course_id']);

    // Performance History table
    await queryInterface.createTable('performance_history', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      course_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'courses',
          key: 'id',
        },
      },
      exam_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'exams',
          key: 'id',
        },
      },
      score: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      remark: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex('performance_history', ['student_id']);
    await queryInterface.addIndex('performance_history', ['course_id']);
    await queryInterface.addIndex('performance_history', ['exam_id']);

    // AI Logs table
    await queryInterface.createTable('ai_logs', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      job_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      student_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      teacher_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      course_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      exam_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      action_type: {
        type: Sequelize.ENUM('training', 'grading', 'parsing'),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pending', 'running', 'completed', 'failed'),
        allowNull: false,
        defaultValue: 'pending',
      },
      input_summary: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      output_summary: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      full_log: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      error_trace: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex('ai_logs', ['job_id'], { unique: true });
    await queryInterface.addIndex('ai_logs', ['status']);
    await queryInterface.addIndex('ai_logs', ['action_type']);
    await queryInterface.addIndex('ai_logs', ['created_at']);

    // Audit Logs table
    await queryInterface.createTable('audit_logs', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      action_type: {
        type: Sequelize.ENUM('create', 'update', 'delete', 'suspend', 'reactivate'),
        allowNull: false,
      },
      target_type: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      target_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      changes: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex('audit_logs', ['user_id']);
    await queryInterface.addIndex('audit_logs', ['target_type', 'target_id']);
    await queryInterface.addIndex('audit_logs', ['created_at']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('audit_logs');
    await queryInterface.dropTable('ai_logs');
    await queryInterface.dropTable('performance_history');
    await queryInterface.dropTable('ai_remarks');
    await queryInterface.dropTable('student_exams');
    await queryInterface.dropTable('questions');
    await queryInterface.dropTable('exams');
    await queryInterface.dropTable('courses');
    await queryInterface.dropTable('classes');
    await queryInterface.dropTable('users');
  },
};
