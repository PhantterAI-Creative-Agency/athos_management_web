import { api } from "./client";

export interface MinistryScheduleAssignmentDTO {
  functionId: string;
  functionName: string;
  volunteerIds: string[];
  volunteerNames: string[];
}

export interface MinistryScheduleDTO {
  id: string;
  ministryId: string;
  churchId: string;
  date: string;
  title?: string;
  notes?: string;
  assignments: MinistryScheduleAssignmentDTO[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface MinistryScheduleInputDTO {
  date: string;
  title?: string;
  notes?: string;
  assignments: { functionId: string; volunteerIds: string[] }[];
}

export function listSchedules(
  ministryId: string,
  range?: { from?: string; to?: string },
): Promise<MinistryScheduleDTO[]> {
  const params: Record<string, string> = {};
  if (range?.from) params.from = range.from;
  if (range?.to) params.to = range.to;
  return api.get<MinistryScheduleDTO[]>(`/ministries/${ministryId}/schedules`, { params });
}

export function getSchedule(ministryId: string, scheduleId: string): Promise<MinistryScheduleDTO> {
  return api.get<MinistryScheduleDTO>(`/ministries/${ministryId}/schedules/${scheduleId}`);
}

export function createSchedule(
  ministryId: string,
  data: MinistryScheduleInputDTO,
): Promise<MinistryScheduleDTO> {
  return api.post<MinistryScheduleDTO>(`/ministries/${ministryId}/schedules`, data);
}

export function updateSchedule(
  ministryId: string,
  scheduleId: string,
  data: Partial<MinistryScheduleInputDTO>,
): Promise<MinistryScheduleDTO> {
  return api.patch<MinistryScheduleDTO>(`/ministries/${ministryId}/schedules/${scheduleId}`, data);
}

export function deleteSchedule(ministryId: string, scheduleId: string): Promise<void> {
  return api.delete<void>(`/ministries/${ministryId}/schedules/${scheduleId}`);
}
