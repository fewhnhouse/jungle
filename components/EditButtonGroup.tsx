import styled from 'styled-components'
import CloseIcon from '@material-ui/icons/Close'
import CheckIcon from '@material-ui/icons/Check'
import { Button } from 'rsuite'

const BtnContainer = styled.div`
    display: flex;
    margin-top: ${({ theme }) => theme.spacing.mini};
`

const StyledButton = styled(Button)`
    margin: 0px 2px;
    height: 25px;
    width: 25px;
    padding: 0px;
`

export default function EditButtonGroup({
    onClick,
}: {
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
}) {
    return (
        <BtnContainer>
            <StyledButton onClick={onClick} size="sm">
                <CloseIcon />
            </StyledButton>
            <StyledButton size="sm">
                <CheckIcon />
            </StyledButton>
        </BtnContainer>
    )
}
