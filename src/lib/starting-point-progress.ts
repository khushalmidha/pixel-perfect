import { getLesson } from "./mock-data";
import { useLearning } from "./learning-context";
import { useStartingPoint } from "./plan-context";
import type { StartingPoint } from "./starter-plan";

export function getPathProgress(
  point: Pick<StartingPoint, "lessonIds"> | null,
  completedIds: readonly string[],
) {
  const lessonIds = point?.lessonIds ?? [];
  const nextId = lessonIds.find((id) => !completedIds.includes(id));
  return {
    nextLesson: nextId ? getLesson(nextId) : undefined,
    completedCount: lessonIds.filter((id) => completedIds.includes(id)).length,
    complete: !!point && lessonIds.every((id) => completedIds.includes(id)),
  };
}
export function useStartingPointProgress() {
  const starting = useStartingPoint();
  const learning = useLearning();
  const hydrated = starting.hydrated && learning.hydrated;
  return {
    ...starting,
    hydrated,
    completedIds: learning.completedIds,
    storageAvailable: starting.storageAvailable && learning.storageAvailable,
    ...getPathProgress(hydrated ? starting.startingPoint : null, learning.completedIds),
  };
}
