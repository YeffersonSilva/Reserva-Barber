import { SchedulingPage } from '../../entities/SchedulingPage';

export interface ISchedulingPageRepository {
  create(page: SchedulingPage): Promise<SchedulingPage>;
  findByCompanyId(companyId: number): Promise<SchedulingPage | null>;
  update(companyId: number, data: Partial<SchedulingPage>): Promise<SchedulingPage>;
  delete(companyId: number): Promise<void>;
}
