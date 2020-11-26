import { BookOutlined, LinkOutlined, ProfileOutlined } from '@ant-design/icons'
import { Avatar, Button, Divider, List } from 'antd'
import Link from 'next/link'
import { Timeline } from '../../taiga-api/timelines'
import { getActivityDate } from '../../util/getActivityDate'

interface Props {
    item: Timeline
}
export default function RecentTask({ item }: Props) {
    const isTask = item.event_type.includes('task')
    const urlType = isTask ? 'tasks' : 'userstories'
    const issueId = isTask ? item.data.task?.id : item.data.userstory?.id
    return (
        <List.Item
            actions={[
                <Link
                    passHref
                    key="link"
                    href={`/projects/${item.project}/${urlType}/${issueId}`}
                >
                    <Button icon={<LinkOutlined />}></Button>
                </Link>,
            ]}
        >
            <List.Item.Meta
                avatar={
                    <Avatar
                        shape="square"
                        style={{
                            backgroundColor: isTask ? '#45aaff' : '#2ecc71',
                        }}
                        icon={isTask ? <ProfileOutlined /> : <BookOutlined />}
                    />
                }
                title={
                    isTask
                        ? item.data.task?.subject
                        : item.data.userstory?.subject
                }
                description={
                    <>
                        <span>{item.data.project.name}</span>
                        <Divider type="vertical" />
                        <span>
                            Last edited:{' '}
                            {getActivityDate(new Date(item.created))}
                        </span>
                    </>
                }
            />
        </List.Item>
    )
}
