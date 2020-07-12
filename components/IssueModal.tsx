import React from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import {
    Modal,
    Backdrop,
    Link,
    Breadcrumbs,
    Button,
    Typography,
    TextField,
    InputLabel,
    FormControl,
    Select,
    MenuItem,
} from '@material-ui/core'
import { useSpring, animated } from 'react-spring'
import styled from 'styled-components'
import CloseIcon from '@material-ui/icons/Close'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        textInput: {
            margin: '10px',
        },
        formControl: {
            margin: '10px',
        }
    })
)

const ModalContainer = styled.div`
    background: #ecf0f1;
    border-radius: 4px;
    width: 80vw;
    height: 80vh;
    padding: 20px;
`

const Header = styled.header`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
`

const Main = styled.main`
    display: flex;
    flex-direction: row;
`

const Content = styled.div`
    flex: 3;
    display: flex;
    flex-direction: column;
`

const Sidebar = styled.aside`
    flex: 1;
`

const Footer = styled.footer`
    display: flex;
`

interface FadeProps {
    children?: React.ReactElement
    in: boolean
    onEnter?: () => {}
    onExited?: () => {}
}

const Fade = React.forwardRef<HTMLDivElement, FadeProps>(function Fade(
    props,
    ref
) {
    const { in: open, children, onEnter, onExited, ...other } = props
    const style = useSpring({
        from: { opacity: 0, transform: 'translate(0px, 30px)' },
        to: {
            opacity: open ? 1 : 0,
            transform: open ? 'translate(0px, 0px)' : 'translate(0px, 30px)',
        },
        onStart: () => {
            if (open && onEnter) {
                onEnter()
            }
        },
        onRest: () => {
            if (!open && onExited) {
                onExited()
            }
        },
    })

    return (
        <animated.div ref={ref} style={style} {...other}>
            {children}
        </animated.div>
    )
})

export default function IssueModal({
    open,
    onClose,
}: {
    open: boolean
    onClose: () => void
}) {
    const classes = useStyles()

    return (
        <Modal
            aria-labelledby="spring-modal-title"
            aria-describedby="spring-modal-description"
            className={classes.modal}
            open={open}
            onClose={onClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={open}>
                <ModalContainer>
                    <Header>
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link color="inherit" href="/">
                                Material-UI
                            </Link>
                            <Link
                                color="inherit"
                                href="/getting-started/installation/"
                            >
                                Core
                            </Link>
                            <Typography color="textPrimary">
                                Breadcrumb
                            </Typography>
                        </Breadcrumbs>

                        <Button onClick={onClose}>
                            <CloseIcon />
                        </Button>
                    </Header>
                    <Main>
                        <Content>
                            <TextField
                                className={classes.textInput}
                                value="The issue Title"
                                id="outlined-basic"
                                label="Title"
                                variant="outlined"
                            />
                            <TextField
                                className={classes.textInput}
                                value="The issue description"
                                multiline
                                rows={4}
                                id="outlined-basic"
                                label="Description"
                                variant="outlined"
                            />
                        </Content>
                        <Sidebar>
                            <FormControl
                                variant="outlined"
                                className={classes.formControl}
                            >
                                <InputLabel id="demo-simple-select-outlined-label">
                                    Status
                                </InputLabel>
                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    value={'To Do'}
                                    onChange={() => {}}
                                    label="Status"
                                >
                                    <MenuItem value={'To Do'}>To Do</MenuItem>
                                    <MenuItem value={'Doing'}>Doing</MenuItem>
                                    <MenuItem value={'Blocked'}>
                                        Blocked
                                    </MenuItem>
                                    <MenuItem value={'In Review'}>
                                        In Review
                                    </MenuItem>
                                    <MenuItem value={'Deployed'}>
                                        Deployed
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Sidebar>
                    </Main>
                    <Typography variant="h5">Comments</Typography>

                    <Footer>
                        <Button>Save</Button>
                    </Footer>
                </ModalContainer>
            </Fade>
        </Modal>
    )
}
