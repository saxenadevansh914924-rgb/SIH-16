// Local service boundary for the prototype. Replace these synchronous demo
// adapters with API clients when a backend becomes available.
import { research } from "./research";
import { datasets } from "./datasets";
import { projects } from "./projects";
import { regions } from "./gisData";
import { activity, states, distribution } from "./analytics";
import { challenges } from "./innovations";
import { notifications } from "./notifications";

export const researchService = {
  list: () => research,
  findById: (id) => research.find((item) => item.id === id),
};
export const datasetService = { list: () => datasets };
export const projectService = { list: () => projects };
export const gisService = { listRegions: () => regions };
export const analyticsService = {
  getOverview: () => ({ activity, states, distribution }),
};
export const innovationService = { list: () => challenges };
export const notificationService = { list: () => notifications };
