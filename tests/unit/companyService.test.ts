// tests/unit/companyService.test.ts
import { CompanyService } from '../../src/modules/company/CompanyService';
import { Company } from '../../src/entities/Company';
import { AppError } from '../../src/error/AppError';

const mockCompanyRepository = {
  create: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('CompanyService', () => {
  let companyService: CompanyService;

  beforeEach(() => {
    companyService = new CompanyService(mockCompanyRepository as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a company correctly', async () => {
    const companyData = {
      name: 'Test Company',
      logo: 'logo.png',
      primaryColor: '#ffffff',
      secondaryColor: '#000000',
    };

    const createdCompany = new Company(
      1,
      companyData.name,
      companyData.logo,
      companyData.primaryColor,
      companyData.secondaryColor
    );

    mockCompanyRepository.create.mockResolvedValue(createdCompany);

    const result = await companyService.createCompany(companyData);
    expect(result).toEqual(createdCompany);
    expect(mockCompanyRepository.create).toHaveBeenCalledWith(expect.any(Company));
  });

  it('should throw an error when getting a non-existent company', async () => {
    mockCompanyRepository.findById.mockResolvedValue(null);
    await expect(companyService.getCompanyById(999)).rejects.toThrow(AppError);
  });

  it('should list companies correctly', async () => {
    const companies = [
      new Company(1, 'Company One', 'logo1.png', '#000', '#fff'),
      new Company(2, 'Company Two', 'logo2.png', '#111', '#eee'),
    ];
    mockCompanyRepository.findAll.mockResolvedValue(companies);
    const result = await companyService.listCompanies();
    expect(result).toEqual(companies);
  });
});
