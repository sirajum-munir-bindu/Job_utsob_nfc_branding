import { prisma } from "./prisma";
import fs from "fs";
import path from "path";
import crypto from "crypto";

export interface StudentRecord {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  cardImageUrl: string | null;
  cardGeneratedAt: Date | null;
  cardGenerationStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DisplayStateRecord {
  id: string;
  currentStudentId: string | null;
  studentName: string | null;
  cardImageUrl: string | null;
  isPaused: boolean;
  mode: string;
  updatedAt: Date;
}

// Local fallback database file path (used seamlessly if PostgreSQL is not yet started locally)
const DATA_DIR = path.join(process.cwd(), ".data");
const STUDENTS_FILE = path.join(DATA_DIR, "students.json");
const DISPLAY_FILE = path.join(DATA_DIR, "display.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJsonFile<T>(filePath: string, fallback: T): T {
  try {
    ensureDataDir();
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2));
      return fallback;
    }
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJsonFile<T>(filePath: string, data: T) {
  ensureDataDir();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

let isPostgresAvailable: boolean | null = null;

async function checkPostgres(): Promise<boolean> {
  if (isPostgresAvailable !== null) return isPostgresAvailable;
  try {
    await prisma.$queryRaw`SELECT 1`;
    isPostgresAvailable = true;
    return true;
  } catch (err) {
    console.warn("PostgreSQL not reachable locally. Using resilient fallback storage for local development.");
    isPostgresAvailable = false;
    return false;
  }
}

export const db = {
  student: {
    async findMany(args?: {
      where?: any;
      orderBy?: { createdAt?: "asc" | "desc" };
      skip?: number;
      take?: number;
    }): Promise<StudentRecord[]> {
      const hasPg = await checkPostgres();
      if (hasPg) {
        try {
          return await prisma.student.findMany(args as any);
        } catch (e) {
          isPostgresAvailable = false;
        }
      }

      // Fallback
      let list: StudentRecord[] = readJsonFile<StudentRecord[]>(STUDENTS_FILE, []).map((s) => ({
        ...s,
        createdAt: new Date(s.createdAt),
        updatedAt: new Date(s.updatedAt),
        cardGeneratedAt: s.cardGeneratedAt ? new Date(s.cardGeneratedAt) : null,
      }));

      if (args?.where) {
        if (args.where.OR) {
          list = list.filter((item) => {
            return args.where.OR.some((cond: any) => {
              if (cond.fullName?.contains) {
                return item.fullName.toLowerCase().includes(cond.fullName.contains.toLowerCase());
              }
              if (cond.phone?.contains) {
                return item.phone.includes(cond.phone.contains);
              }
              if (cond.email?.contains) {
                return item.email.toLowerCase().includes(cond.email.contains.toLowerCase());
              }
              return false;
            });
          });
        }
      }

      // Sort
      list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      // Pagination
      const skip = args?.skip || 0;
      const take = args?.take || list.length;
      return list.slice(skip, skip + take);
    },

    async count(args?: { where?: any }): Promise<number> {
      const hasPg = await checkPostgres();
      if (hasPg) {
        try {
          return await prisma.student.count(args as any);
        } catch (e) {
          isPostgresAvailable = false;
        }
      }

      const list = await db.student.findMany({ where: args?.where });
      return list.length;
    },

    async findFirst(args: { where: any }): Promise<StudentRecord | null> {
      const hasPg = await checkPostgres();
      if (hasPg) {
        try {
          return await prisma.student.findFirst(args as any);
        } catch (e) {
          isPostgresAvailable = false;
        }
      }

      const list = readJsonFile<StudentRecord[]>(STUDENTS_FILE, []);
      const found = list.find((s) => {
        if (!args?.where) return true;
        if (args.where.OR) {
          return args.where.OR.some((cond: any) => {
            if (cond.phone && s.phone === cond.phone) return true;
            if (cond.email && s.email.toLowerCase() === cond.email.toLowerCase()) return true;
            return false;
          });
        }
        if (args.where.id && s.id !== args.where.id) return false;
        if (args.where.cardGenerationStatus && s.cardGenerationStatus !== args.where.cardGenerationStatus) return false;
        return true;
      });

      if (!found) return null;
      return {
        ...found,
        createdAt: new Date(found.createdAt),
        updatedAt: new Date(found.updatedAt),
        cardGeneratedAt: found.cardGeneratedAt ? new Date(found.cardGeneratedAt) : null,
      };
    },

    async findUnique(args: { where: { id: string } }): Promise<StudentRecord | null> {
      const hasPg = await checkPostgres();
      if (hasPg) {
        try {
          return await prisma.student.findUnique(args as any);
        } catch (e) {
          isPostgresAvailable = false;
        }
      }

      return db.student.findFirst({ where: { id: args.where.id } });
    },

    async create(args: { data: Omit<StudentRecord, "id" | "createdAt" | "updatedAt" | "cardImageUrl" | "cardGeneratedAt"> & { cardImageUrl?: string | null; cardGeneratedAt?: Date | null; } }): Promise<StudentRecord> {
      const hasPg = await checkPostgres();
      if (hasPg) {
        try {
          return await prisma.student.create(args as any);
        } catch (e) {
          isPostgresAvailable = false;
        }
      }

      const list = readJsonFile<StudentRecord[]>(STUDENTS_FILE, []);
      const newRecord: StudentRecord = {
        id: crypto.randomUUID(),
        fullName: args.data.fullName,
        phone: args.data.phone,
        email: args.data.email,
        cardImageUrl: args.data.cardImageUrl || null,
        cardGeneratedAt: args.data.cardGeneratedAt || null,
        cardGenerationStatus: args.data.cardGenerationStatus || "PENDING",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      list.unshift(newRecord);
      writeJsonFile(STUDENTS_FILE, list);
      return newRecord;
    },

    async update(args: { where: { id: string }; data: Partial<StudentRecord> }): Promise<StudentRecord> {
      const hasPg = await checkPostgres();
      if (hasPg) {
        try {
          return await prisma.student.update(args as any);
        } catch (e) {
          isPostgresAvailable = false;
        }
      }

      const list = readJsonFile<StudentRecord[]>(STUDENTS_FILE, []);
      const index = list.findIndex((s) => s.id === args.where.id);
      if (index === -1) {
        throw new Error(`Student record not found: ${args.where.id}`);
      }

      const updated = {
        ...list[index],
        ...args.data,
        updatedAt: new Date(),
      };
      list[index] = updated;
      writeJsonFile(STUDENTS_FILE, list);
      return {
        ...updated,
        createdAt: new Date(updated.createdAt),
        updatedAt: new Date(updated.updatedAt),
        cardGeneratedAt: updated.cardGeneratedAt ? new Date(updated.cardGeneratedAt) : null,
      };
    },

    async delete(args: { where: { id: string } }): Promise<void> {
      const hasPg = await checkPostgres();
      if (hasPg) {
        try {
          await prisma.student.delete(args as any);
          return;
        } catch (e) {
          isPostgresAvailable = false;
        }
      }

      let list = readJsonFile<StudentRecord[]>(STUDENTS_FILE, []);
      list = list.filter((s) => s.id !== args.where.id);
      writeJsonFile(STUDENTS_FILE, list);
    },
  },

  displayState: {
    async get(): Promise<DisplayStateRecord> {
      const defaultState: DisplayStateRecord = {
        id: "CURRENT_DISPLAY",
        currentStudentId: null,
        studentName: null,
        cardImageUrl: null,
        isPaused: false,
        mode: "CARD",
        updatedAt: new Date(),
      };

      let state: DisplayStateRecord = defaultState;

      const hasPg = await checkPostgres();
      if (hasPg) {
        try {
          const pgState = await prisma.displayState.findUnique({
            where: { id: "CURRENT_DISPLAY" },
          });
          if (pgState) state = pgState;
        } catch (e) {
          isPostgresAvailable = false;
        }
      }

      if (!hasPg || !state.studentName) {
        const fallback = readJsonFile<DisplayStateRecord>(DISPLAY_FILE, defaultState);
        state = {
          ...fallback,
          updatedAt: new Date(fallback.updatedAt),
        };
      }

      // If no active card is set yet, automatically look up the latest generated student card
      if (!state.cardImageUrl || !state.studentName) {
        const latestStudent = await db.student.findFirst({
          where: { cardGenerationStatus: "GENERATED" },
        });
        if (latestStudent && latestStudent.cardImageUrl) {
          state.currentStudentId = latestStudent.id;
          state.studentName = latestStudent.fullName;
          state.cardImageUrl = latestStudent.cardImageUrl;
          state.mode = "CARD";
        }
      }

      return state;
    },

    async upsert(data: Partial<DisplayStateRecord>): Promise<DisplayStateRecord> {
      const hasPg = await checkPostgres();
      if (hasPg) {
        try {
          return await prisma.displayState.upsert({
            where: { id: "CURRENT_DISPLAY" },
            update: { ...data, updatedAt: new Date() },
            create: {
              id: "CURRENT_DISPLAY",
              currentStudentId: data.currentStudentId || null,
              studentName: data.studentName || null,
              cardImageUrl: data.cardImageUrl || null,
              isPaused: data.isPaused ?? false,
              mode: data.mode || "WELCOME",
            },
          });
        } catch (e) {
          isPostgresAvailable = false;
        }
      }

      const current = await db.displayState.get();
      const updated: DisplayStateRecord = {
        ...current,
        ...data,
        updatedAt: new Date(),
      };
      writeJsonFile(DISPLAY_FILE, updated);
      return updated;
    },
  },
};
