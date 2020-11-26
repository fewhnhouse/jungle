import { List } from 'antd'
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
    width: 100%;
`
interface Props {
    timeline?: Timeline[]
    title: string
}

export default function RecentTasks({ timeline = [], title }: Props) {
    return (
        <Container>
            <h2>{title}</h2>
            <List style={{ width: '100%' }}>
                {timeline.map((item) => (
                    <RecentTask key={item.id} item={item} />
                ))}
            </List>
        </Container>
    )
}
