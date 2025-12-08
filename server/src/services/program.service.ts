import { prisma } from "@/lib/prisma";
import {
  Program,
  ProgramRequirement,
  DegreeLevel,
  Category,
} from "@/generated/prisma/client";

export async function getAllPrograms(): Promise<Program[]> {
  return await prisma.program.findMany({
    include: {
      requirements: true,
      _count: {
        select: {
          degreePlans: true,
        },
      },
    },
    orderBy: {
      code: "asc",
    },
  });
}

export async function getActiveProgramsOnly(): Promise<Program[]> {
  return await prisma.program.findMany({
    where: {
      isActive: true,
    },
    include: {
      requirements: true,
    },
    orderBy: {
      code: "asc",
    },
  });
}

export async function getProgramById(id: string): Promise<Program | null> {
  return await prisma.program.findUnique({
    where: { id },
    include: {
      requirements: true,
      degreePlans: {
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
            },
          },
        },
      },
    },
  });
}

export async function getProgramByCode(code: string): Promise<Program | null> {
  return await prisma.program.findUnique({
    where: { code },
    include: {
      requirements: true,
    },
  });
}

interface CreateProgramData {
  code: string;
  name: string;
  level?: DegreeLevel;
  totalCredits: number;
  isActive?: boolean;
}

export async function createProgram(data: CreateProgramData): Promise<Program> {
  return await prisma.program.create({
    data: {
      code: data.code,
      name: data.name,
      level: data.level || "BACHELOR",
      totalCredits: data.totalCredits,
      isActive: data.isActive ?? true,
    },
    include: {
      requirements: true,
    },
  });
}

interface UpdateProgramData {
  code?: string;
  name?: string;
  level?: DegreeLevel;
  totalCredits?: number;
  isActive?: boolean;
}

export async function updateProgram(
  id: string,
  data: UpdateProgramData
): Promise<Program> {
  return await prisma.program.update({
    where: { id },
    data,
    include: {
      requirements: true,
    },
  });
}

export async function deleteProgram(id: string): Promise<Program> {
  return await prisma.program.delete({
    where: { id },
  });
}

export async function getProgramRequirements(
  programId: string
): Promise<ProgramRequirement[]> {
  return await prisma.programRequirement.findMany({
    where: { programId },
    include: {
      program: true,
    },
    orderBy: {
      category: "asc",
    },
  });
}

export async function getProgramRequirementByCategory(
  programId: string,
  category: Category
): Promise<ProgramRequirement | null> {
  return await prisma.programRequirement.findUnique({
    where: {
      programId_category: {
        programId,
        category,
      },
    },
    include: {
      program: true,
    },
  });
}

interface CreateProgramRequirementData {
  programId: string;
  category: Category;
  credits: number;
}

export async function createProgramRequirement(
  data: CreateProgramRequirementData
): Promise<ProgramRequirement> {
  return await prisma.programRequirement.create({
    data: {
      programId: data.programId,
      category: data.category,
      credits: data.credits,
    },
    include: {
      program: true,
    },
  });
}

interface UpdateProgramRequirementData {
  credits?: number;
}

export async function updateProgramRequirement(
  id: string,
  data: UpdateProgramRequirementData
): Promise<ProgramRequirement> {
  return await prisma.programRequirement.update({
    where: { id },
    data,
    include: {
      program: true,
    },
  });
}

export async function deleteProgramRequirement(
  id: string
): Promise<ProgramRequirement> {
  return await prisma.programRequirement.delete({
    where: { id },
  });
}

export async function createProgramWithRequirements(
  programData: CreateProgramData,
  requirements: Array<{ category: Category; credits: number }>
): Promise<Program> {
  return await prisma.program.create({
    data: {
      code: programData.code,
      name: programData.name,
      level: programData.level || "BACHELOR",
      totalCredits: programData.totalCredits,
      isActive: programData.isActive ?? true,
      requirements: {
        create: requirements,
      },
    },
    include: {
      requirements: true,
    },
  });
}
