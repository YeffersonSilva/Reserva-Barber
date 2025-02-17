// tests/unit/schedulingPageService.test.ts
import { SchedulingPageService } from '../../src/modules/schedulingPage/SchedulingPageService';
import { ISchedulingPageRepository } from '../../src/repositories/interfaces/ISchedulingPageRepository';
import { SchedulingPage } from '../../src/entities/SchedulingPage';
import { AppError } from '../../src/error/AppError';

describe('SchedulingPageService', () => {
  let schedulingPageService: SchedulingPageService;
  const mockRepo: Partial<ISchedulingPageRepository> = {
    findByCompanyId: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(() => {
    schedulingPageService = new SchedulingPageService(mockRepo as ISchedulingPageRepository);
    jest.clearAllMocks();
  });

  it('should create a scheduling page if none exists', async () => {
    const companyId = 1;
    const data = {
      title: "Scheduling Title",
      description: "Scheduling Description",
      slug: undefined,
      background: "bg.png",
      customCss: undefined,
      customJs: undefined,
    };

    (mockRepo.findByCompanyId as jest.Mock).mockResolvedValue(null);
    const createdPage = new SchedulingPage(1, companyId, "generated-slug", data.background, data.title, data.description, null, null);
    (mockRepo.create as jest.Mock).mockResolvedValue(createdPage);

    const result = await schedulingPageService.createSchedulingPage(data, companyId);
    expect(result).toEqual(createdPage);
  });

  it('should throw error if scheduling page already exists', async () => {
    const companyId = 1;
    const data = {
      title: "Scheduling Title",
      description: "Scheduling Description",
      slug: undefined,
      background: "bg.png",
      customCss: undefined,
      customJs: undefined,
    };

    const existingPage = new SchedulingPage(1, companyId, "slug", "bg", "Title", "Desc", null, null);
    (mockRepo.findByCompanyId as jest.Mock).mockResolvedValue(existingPage);
    await expect(schedulingPageService.createSchedulingPage(data, companyId)).rejects.toThrow(AppError);
  });
});
