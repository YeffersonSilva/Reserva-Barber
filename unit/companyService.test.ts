// tests/unit/companyService.test.ts
import { CompanyService } from '../src/modules/company/CompanyService';
import { Company } from '../src/entities/Company';
import { AppError } from '../src/error/AppError';

// Creamos un repositorio "mock" para simular las operaciones sin acceder a la base de datos real.
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
    // Se instancia el servicio con el repositorio mockeado.
    companyService = new CompanyService(mockCompanyRepository as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe crear una empresa correctamente', async () => {
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

    // Simulamos que el repositorio devuelve la empresa creada
    mockCompanyRepository.create.mockResolvedValue(createdCompany);

    const result = await companyService.createCompany(companyData);

    expect(result).toEqual(createdCompany);
    // Verificamos que se haya llamado a create con una instancia de Company
    expect(mockCompanyRepository.create).toHaveBeenCalledWith(expect.any(Company));
  });

  it('debe lanzar un error si la empresa no se encuentra', async () => {
    // Simulamos que el repositorio devuelve null para una empresa inexistente
    mockCompanyRepository.findById.mockResolvedValue(null);
    await expect(companyService.getCompanyById(999)).rejects.toThrow(AppError);
  });

  // Aquí se pueden agregar pruebas para update, delete y list
});
