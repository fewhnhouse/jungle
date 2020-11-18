import styled from 'styled-components'
import { Timeline } from '../../taiga-api/timelines'
import RecentTask from './RecentTask'

const Container = styled.div`
    flex: 1;
    @media (min-width: 960px) {
        &:first-child {
            margin-right: 10px;
        }
        &:last-child {
            margin-left: 10px;
        }
    }
    margin-bottom: ${({ theme }) => theme.spacing.big};
    min-width: 400px;
    width: 100%;
    max-width: 500px;
`
interface Props {
    timeline?: Timeline[]
    title: string
}

export default function RecentTasks({ timeline = [], title }: Props) {
    console.log(timeline)
    return (
        <Container>
            <h2>{title}</h2>
            {timeline.map((item) =>
                item.event_type.includes('task') ? (
                    <RecentTask
                        key={item.id}
                        type="task"
                        title={item.data.task?.subject}
                        id={item.data.task?.id}
                        description={`Last edited: ${new Date(
                            item.created
                        ).toDateString()}`}
                        projectName={item.data.project.name}
                        projectId={item.data.project.id}
                    ></RecentTask>
                ) : (
                    <RecentTask
                        key={item.id}
                        type="userstory"
                        title={item.data.userstory?.subject}
                        id={item.data.userstory?.id}
                        description={`Last edited: ${new Date(
                            item.created
                        ).toDateString()}`}
                        projectName={item.data.project.name}
                        projectId={item.data.project.id}
                    ></RecentTask>
                )
            )}
        </Container>
    )
}
