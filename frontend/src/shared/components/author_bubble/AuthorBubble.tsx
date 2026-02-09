import { Avatar, Stack, Typography } from '@mui/material'
import { FC } from 'react'
import { TUser } from 'src/models/TUser'
import UtilService from 'src/services/UtilService'

type Props = {
    author: TUser,
    creationDate: string,
    updateDate?: string
}

const AuthorBubble: FC<Props> = ({ author, creationDate, updateDate }) => {
    return (
        <Stack direction={"row"} spacing={2}>
                        
            <Avatar sx={{width:40,height:40}} alt={author?.firstName}  title={`${author.firstName} ${author.lastName}`} src={author.profileImage ? UtilService.resolveFile(author.profileImage.fileUrl ): ''} />
            <Stack direction={"column"} spacing={0}>
                <Typography variant='body2' fontSize={"0.8rem !important"} >Redaccion por: {author.firstName} {author.lastName} </Typography>
                <Typography variant='body2'fontSize={"0.8rem !important"}>Fecha: {UtilService.parseDate(creationDate)}</Typography>
            </Stack>
        </Stack>
    )
}

export default AuthorBubble;