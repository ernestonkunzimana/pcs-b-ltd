import { TaskService } from '../../services/TaskService';
import { AppDataSource } from '../../config/database';
import { Task } from '../../models/Task';
import { Project } from '../../models/Project';
import { Organization } from '../../models/Organization';
import { User } from '../../models/User';

describe('TaskService', () => {
  let taskService: TaskService;
  let testOrganization: Organization;
  let testProject: Project;
  let testUser: User;

  beforeAll(async () => {
    await AppDataSource.initialize();
    taskService = new TaskService();
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

  describe('findAll', () => {
    it('should return empty array when no tasks exist', async () => {
      const result = await taskService.findAll(testOrganization.id, { page: 1, limit: 10 });

      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
      expect(result.pagination).toBeDefined();
      expect(result.pagination.total).toBe(0);
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

      const result = await taskService.findAll(testOrganization.id, { page: 1, limit: 10 });

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].title).toBe('Test Task');
      expect(result.pagination.total).toBe(1);
    });

    it('should handle pagination correctly', async () => {
      // Create multiple test tasks
      const taskRepository = AppDataSource.getRepository(Task);
      for (let i = 1; i <= 15; i++) {
        const task = taskRepository.create({
          projectId: testProject.id,
          title: `Test Task ${i}`,
          description: `Test task description ${i}`,
          status: 'pending',
          assignedBy: testUser.id,
        });
        await taskRepository.save(task);
      }

      const result = await taskService.findAll(testOrganization.id, { page: 1, limit: 10 });

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(10);
      expect(result.pagination.total).toBe(15);
      expect(result.pagination.pages).toBe(2);
    });
  });

  describe('findById', () => {
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

      const result = await taskService.findById(testTask.id, testOrganization.id);

      expect(result.success).toBe(true);
      expect(result.data.id).toBe(testTask.id);
      expect(result.data.title).toBe('Test Task');
    });

    it('should return not found when task does not exist', async () => {
      const fakeId = 'b3f7c580-1234-4d7c-9d9e-123456789012';
      
      const result = await taskService.findById(fakeId, testOrganization.id);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Task not found');
    });
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const taskData = {
        projectId: testProject.id,
        title: 'New Test Task',
        description: 'New task description',
        status: 'pending',
        priority: 'medium',
      };

      const result = await taskService.create(taskData, testUser.id);

      expect(result.success).toBe(true);
      expect(result.data.title).toBe(taskData.title);
      expect(result.data.assignedBy).toBe(testUser.id);
      expect(result.data.projectId).toBe(testProject.id);
    });

    it('should handle creation errors', async () => {
      const taskData = {
        projectId: 'invalid-project-id',
        title: 'New Test Task',
        description: 'New task description',
      };

      const result = await taskService.create(taskData, testUser.id);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Failed to create task');
    });
  });

  describe('update', () => {
    it('should update an existing task', async () => {
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

      const result = await taskService.update(testTask.id, updateData, testUser.id, testOrganization.id);

      expect(result.success).toBe(true);
      expect(result.data.title).toBe('Updated Task Title');
      expect(result.data.status).toBe('in_progress');
    });

    it('should return not found when task does not exist', async () => {
      const fakeId = 'b3f7c580-1234-4d7c-9d9e-123456789012';
      const updateData = { title: 'Updated' };

      const result = await taskService.update(fakeId, updateData, testUser.id, testOrganization.id);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Task not found');
    });
  });

  describe('delete', () => {
    it('should delete an existing task', async () => {
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

      const result = await taskService.delete(testTask.id, testOrganization.id);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Task deleted successfully');

      // Verify task is deleted
      const deletedTask = await taskRepository.findOne({
        where: { id: testTask.id },
      });
      expect(deletedTask).toBeNull();
    });

    it('should return not found when task does not exist', async () => {
      const fakeId = 'b3f7c580-1234-4d7c-9d9e-123456789012';

      const result = await taskService.delete(fakeId, testOrganization.id);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Task not found');
    });
  });
});