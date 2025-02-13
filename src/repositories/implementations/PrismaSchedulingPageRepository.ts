import prisma from '../../config/dbConfig';
import { SchedulingPage } from '../../entities/SchedulingPage';
import { ISchedulingPageRepository } from '../interfaces/ISchedulingPageRepository';

export class PrismaSchedulingPageRepository implements ISchedulingPageRepository {
  async create(page: SchedulingPage): Promise<SchedulingPage> {
    const created = await prisma.schedulingPage.create({
      data: {
        companyId: page.companyId,
        slug: page.slug,
        background: page.background,
        title: page.title,
        description: page.description,
        customCss: page.customCss,
        customJs: page.customJs,
      },
    });
    return new SchedulingPage(
      created.id,
      created.companyId,
      created.slug,
      created.background,
      created.title,
      created.description,
      created.customCss,
      created.customJs,
     
    );
  }

  async findByCompanyId(companyId: number): Promise<SchedulingPage | null> {
    const found = await prisma.schedulingPage.findUnique({
      where: { companyId },
    });
    if (!found) return null;
    return new SchedulingPage(
      found.id,
      found.companyId,
      found.slug,
      found.background,
      found.title,
      found.description,
      found.customCss,
      found.customJs,
     
    );
  }

  async update(companyId: number, data: Partial<SchedulingPage>): Promise<SchedulingPage> {
    const updated = await prisma.schedulingPage.update({
      where: { companyId },
      data: {
        slug: data.slug,
        background: data.background,
        title: data.title,
        description: data.description,
        customCss: data.customCss,
        customJs: data.customJs,
      },
    });
    return new SchedulingPage(
      updated.id,
      updated.companyId,
      updated.slug,
      updated.background,
      updated.title,
      updated.description,
      updated.customCss,
      updated.customJs,
      
    );
  }

  async delete(companyId: number): Promise<void> {
    await prisma.schedulingPage.delete({
      where: { companyId },
    });
  }
}
