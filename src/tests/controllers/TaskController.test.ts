import request from 'supertest';
import { Application } from 'express';
import app from '../../app';
import { AppDataSource } from '../../config/database';
import { User } from '../../models/User';
import { Task } from '../../models/Task';
import { Project } from '../../models/Project';
import { Organization } from '../../models/Organization';
import jwt from 'jsonwebtoken';

describe('TaskController', () => {
  let testApp: Application;
  let testUser: User;
  let testOrganization: Organization;
  let testProject: Project;
  let authToken: string;

  beforeAll(async () => {
    await AppDataSource.initialize();
    testApp = app;
  });

  beforeEach(async () => {
    // Create test organization
    const orgRepository = AppDataSource.getRepository(Organization);
    testOrganization = orgRepository.create({
      name: 'Test Organization',
      email: 'test@example.com',
    });
    await orgRepository.save(testOrganization);

    // Create test user
    const userRepository = AppDataSource.getRepository(User);
    testUser = userRepository.create({
      email: 'test@example.com',
      passwordHash: 'hashedpassword',
      firstName: 'Test',
      lastName: 'User',
      isActive: true,
      isVerified: true,
    });
    await userRepository.save(testUser);

    // Create test project
    const projectRepository = AppDataSource.getRepository(Project);
    testProject = projectRepository.create({
      organizationId: testOrganization.id,
      name: 'Test Project',
      status: 'active',
      createdBy: testUser.id,
    });
    await projectRepository.save(testProject);

    // Generate auth token
    authToken = jwt.sign(
      {
        userId: testUser.id,
        email: testUser.email,
        organizationId: testOrganization.id,
      },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );
  });

  afterEach(async () => {
    // Clean up test data
    await AppDataSource.getRepository(Task).clear();
    await AppDataSource.getRepository(Project).clear();
    await AppDataSource.getRepository(User).clear();
    await AppDataSource.getRepository(Organization).clear();
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  describe('GET /api/tasks', () => {
    it('should return empty array when no tasks exist', async () => {
      const response = await request(testApp)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
      expect(response.body.pagination).toBeDefined();
    });

    it('should return tasks when they exist', async () => {
      // Create test task
      const taskRepository = AppDataSource.getRepository(Task);
      const testTask = taskRepository.create({
        projectId: testProject.id,
        title: 'Test Task',
        description: 'Test task description',
        status: 'pending',
        assignedBy: testUser.id,
      });
      await taskRepository.save(testTask);

      const response = await request(testApp)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].title).toBe('Test Task');
    });

    it('should return 401 when no auth token provided', async () => {
      const response = await request(testApp)
        .get('/api/tasks')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Access token required');
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const taskData = {
        projectId: testProject.id,
        title: 'New Test Task',
        description: 'New task description',
        status: 'pending',
        priority: 'medium',
      };

      const response = await request(testApp)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(taskData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(taskData.title);
      expect(response.body.data.assignedBy).toBe(testUser.id);
    });

    it('should return 400 when required fields are missing', async () => {
      const taskData = {
        description: 'Task without title',
      };

      const response = await request(testApp)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(taskData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation error');
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should return task by id', async () => {
      // Create test task
      const taskRepository = AppDataSource.getRepository(Task);
      const testTask = taskRepository.create({
        projectId: testProject.id,
        title: 'Test Task',
        description: 'Test task description',
        status: 'pending',
        assignedBy: testUser.id,
      });
      await taskRepository.save(testTask);

      const response = await request(testApp)
        .get(`/api/tasks/${testTask.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(testTask.id);
      expect(response.body.data.title).toBe('Test Task');
    });

    it('should return 404 when task not found', async () => {
      const fakeId = 'b3f7c580-1234-4d7c-9d9e-123456789012';
      
      const response = await request(testApp)
        .get(`/api/tasks/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Task not found');
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update task', async () => {
      // Create test task
      const taskRepository = AppDataSource.getRepository(Task);
      const testTask = taskRepository.create({
        projectId: testProject.id,
        title: 'Test Task',
        description: 'Test task description',
        status: 'pending',
        assignedBy: testUser.id,
      });
      await taskRepository.save(testTask);

      const updateData = {
        title: 'Updated Task Title',
        status: 'in_progress',
      };

      const response = await request(testApp)
        .put(`/api/tasks/${testTask.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Updated Task Title');
      expect(response.body.data.status).toBe('in_progress');
    });

    it('should return 404 when task not found', async () => {
      const fakeId = 'b3f7c580-1234-4d7c-9d9e-123456789012';
      
      const response = await request(testApp)
        .put(`/api/tasks/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Updated' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Task not found');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete task', async () => {
      // Create test task
      const taskRepository = AppDataSource.getRepository(Task);
      const testTask = taskRepository.create({
        projectId: testProject.id,
        title: 'Test Task',
        description: 'Test task description',
        status: 'pending',
        assignedBy: testUser.id,
      });
      await taskRepository.save(testTask);

      const response = await request(testApp)
        .delete(`/api/tasks/${testTask.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Task deleted successfully');

      // Verify task is deleted
      const deletedTask = await taskRepository.findOne({
        where: { id: testTask.id },
      });
      expect(deletedTask).toBeNull();
    });

    it('should return 404 when task not found', async () => {
      const fakeId = 'b3f7c580-1234-4d7c-9d9e-123456789012';
      
      const response = await request(testApp)
        .delete(`/api/tasks/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Task not found');
    });
  });
});