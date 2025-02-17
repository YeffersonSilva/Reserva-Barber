// tests/unit/serviceService.test.ts
import { ServiceService } from '../../src/modules/services/ServiceService';
import { IServiceRepository } from '../../src/repositories/interfaces/IServiceRepository';
import { Service } from '../../src/entities/Service';
import { AppError } from '../../src/error/AppError';
import prisma from '../../src/config/dbConfig';

// Se usa jest.mock para interceptar la llamada a prisma.company.findUnique.
jest.mock('../../src/config/dbConfig', () => ({
  __esModule: true,
  default: {
    company: {
      findUnique: jest.fn(),
    },
    // Se puede mantener otros modelos si se requieren.
  },
}));

describe('ServiceService', () => {
  let serviceService: ServiceService;
  const mockRepo: Partial<IServiceRepository> = {
    create: jest.fn(),
    findById: jest.fn(),
    findAllByCompany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockedPrisma = prisma as any;

  beforeEach(() => {
    serviceService = new ServiceService(mockRepo as IServiceRepository);
    jest.clearAllMocks();
  });

  it('should create a service if company exists', async () => {
    const companyId = 1;
    const serviceData = {
      name: "Test Service",
      description: "Description",
      duration: 45,
    };
    // Simular que la empresa existe
    mockedPrisma.company.findUnique.mockResolvedValue({ id: companyId });
    const createdService = new Service(1, companyId, serviceData.name, serviceData.description, serviceData.duration, true);
    (mockRepo.create as jest.Mock).mockResolvedValue(createdService);

    const result = await serviceService.createService(serviceData, companyId);
    expect(result).toEqual(createdService);
    expect(mockedPrisma.company.findUnique).toHaveBeenCalledWith({ where: { id: companyId } });
  });

  it('should throw error if company does not exist', async () => {
    const companyId = 999;
    const serviceData = {
      name: "Test Service",
      description: "Description",
      duration: 45,
    };
    mockedPrisma.company.findUnique.mockResolvedValue(null);
    await expect(serviceService.createService(serviceData, companyId)).rejects.toThrow(AppError);
  });
});
