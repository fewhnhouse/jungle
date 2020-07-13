import { DraggableLocation } from "react-beautiful-dnd";
import { Issue } from "../../interfaces/Issue";

// a little function to help us with reordering the result
const reorder = (list: any[], startIndex: number, endIndex: number): any[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

export default reorder;

interface ReorderIssueMapArgs {
    issueMap: Issue[],
    source: DraggableLocation,
    destination: DraggableLocation,
};



export interface ReorderIssueMapResult {
    issueMap: Issue[]
};

export const reorderQuoteMap = ({
    issueMap,
    source,
    destination,
}: ReorderIssueMapArgs): ReorderIssueMapResult => {
    const current: Issue[] = issueMap.filter(issue => issue.status === source.droppableId)
    const next: Issue[] = issueMap.filter(issue => issue.status === destination.droppableId)
    const target: Issue = current[source.index];

    // moving to same list
    if (source.droppableId === destination.droppableId) {
        const reordered: Issue[] = reorder(
            current,
            source.index,
            destination.index,
        );
        const unaffected = issueMap.filter(issue => issue.status !== source.droppableId)
        return {
            issueMap: [...unaffected, ...reordered]
        }

    }

    // moving to different list

    // remove from original
    current.splice(source.index, 1);
    // insert into next
    next.splice(destination.index, 0, { ...target, status: destination.droppableId });
    const unaffected = issueMap.filter(issue => issue.status !== source.droppableId && issue.status !== destination.droppableId)

    return {
        issueMap: [...unaffected, ...current, ...next],
    };
};

type List<T> = {
    id: string,
    values: T[],
};

type MoveBetweenArgs<T> = {
    list1: List<T>,
    list2: List<T>,
    source: DraggableLocation,
    destination: DraggableLocation,
};

type MoveBetweenResult<T> = {
    list1: List<T>,
    list2: List<T>,
};

export function moveBetween<T>({
    list1,
    list2,
    source,
    destination,
}: MoveBetweenArgs<T>): MoveBetweenResult<T> {
    const newFirst = Array.from(list1.values);
    const newSecond = Array.from(list2.values);

    const moveFrom = source.droppableId === list1.id ? newFirst : newSecond;
    const moveTo = moveFrom === newFirst ? newSecond : newFirst;

    const [moved] = moveFrom.splice(source.index, 1);
    moveTo.splice(destination.index, 0, moved);

    return {
        list1: {
            ...list1,
            values: newFirst,
        },
        list2: {
            ...list2,
            values: newSecond,
        },
    };
}