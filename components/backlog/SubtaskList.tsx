import React, { useState } from 'react'
import styled from 'styled-components'
import { Button, Icon, Tag, Input, Placeholder } from 'rsuite'
import { queryCache, useQuery } from 'react-query'
import { getTasks, createTask, Task } from '../../api/tasks'
import { useRouter } from 'next/router'
import Link from 'next/link'

const { Paragraph } = Placeholder

const TaskList = styled.ul`
    list-style: none;
    padding: 0;
`

const TaskItem = styled.li`
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    border: 2px solid transparent;
    background-color: #ecf0f1;
    box-sizing: border-box;
    padding: ${({ theme }) => `${theme.spacing.mini}`};
    margin-bottom: ${({ theme }) => `${theme.spacing.mini}`};
    &:hover,
    &:active {
        color: #7f8c8d;
    }
    display: flex;
`

const Flex = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
`

const InputLi = styled.li`
    display: flex;
    align-items: center;
    width: 100%;
    button {
        margin-left: 5px;
    }
`

const TaskContent = styled.div`
    /* flex child */
    flex-grow: 1;
    flex-basis: 100%;
    align-items: center;
    justify-content: space-between;
    /* flex parent */
    display: flex;
    flex-direction: row;
`

const TaskSubject = styled.p`
    margin: 0px 10px;
`

const TagContainer = styled.div`
    display: flex;
    margin-top: ${({ theme }) => `${theme.spacing.mini}`};
    align-items: center;
`

interface Props {
    id: number
}

const SubtaskList = ({ id }: Props) => {
    const { projectId } = useRouter().query
    const [subtask, setSubtask] = useState('')

    const { isLoading: isTasksLoading, data: subtasks } = useQuery(
        ['subtasks', { id }],
        (key, { id }) =>
            getTasks({
                projectId: projectId as string,
                userStory: id,
            }),

        { enabled: id && projectId }
    )

    const handleChangeSubtask = (val: string) => {
        setSubtask(val)
    }

    const handleAddSubtask = () => {
        setSubtask('')
        createTask({
            assigned_to: null,
            project: projectId,
            // TODO status: 16,
            subject: subtask,
            user_story: id,
        }).then((newTask) => {
            queryCache.setQueryData(
                ['subtasks', { id }],
                (prevData: Task[]) => [...prevData, newTask]
            )
        })
    }

    return (
        <TaskList>
            {isTasksLoading ? (
                <Paragraph rows={2} />
            ) : (
                <>
                    {subtasks?.map((task) => (
                        <TaskItem key={task.id}>
                            <Link
                                key={task.id}
                                href="/project/[projectId]/tasks/[id]"
                                as={`/project/${projectId}/tasks/${id}`}
                            >
                                <Flex>
                                    <Icon icon="task" />
                                    <TaskContent>
                                        <TaskSubject>
                                            {task.subject}
                                        </TaskSubject>
                                        <TagContainer>
                                            <Tag>
                                                ID-
                                                {task.id}
                                            </Tag>
                                        </TagContainer>
                                    </TaskContent>
                                </Flex>
                            </Link>
                        </TaskItem>
                    ))}
                    <InputLi>
                        <Input
                            onChange={handleChangeSubtask}
                            value={subtask}
                            placeholder="Add Subtask..."
                        />
                        <Button onClick={handleAddSubtask}>+</Button>
                    </InputLi>
                </>
            )}
        </TaskList>
    )
}

export default SubtaskList
