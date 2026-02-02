import { Edit } from "@mui/icons-material";
import { Box, Button, Modal, Stack, Typography } from "@mui/material";
import "./RichtextOverview.css";
import { FC, useState } from "react";
import RichtextEditor from "../richtext_editor/RichtextEditor";
import useDecodeRichText from "src/shared/hooks/useDecodeRichText";

interface RichtextOverviewProps {
    editable?: boolean;
    richtextBase64?: string;
    title: string;
    onChange?: (...event: any[]) => void;
}

const RichtextOverview: FC<RichtextOverviewProps> = ({ editable = true, richtextBase64 = "", onChange, title }) => {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [data, decodeData] = useDecodeRichText(richtextBase64);
    function handleClick() {
        setModalOpen(true);
    }

    return <>
        <Box className="container">
            <Stack>
                <Stack className="header" direction="row" justifyContent="space-between">
                    <Typography variant="h3">{title}</Typography>
                    {editable &&
                        <Button variant="text" onClick={handleClick}><Edit></Edit></Button>
                    }
                </Stack>
            </Stack>
            <div className="content" dangerouslySetInnerHTML={{ __html: data }}></div>
        </Box>
        <Modal onClose={setModalOpen} open={modalOpen} title={title}>
            <RichtextEditor initialValue={data} sendData={(data) => {
                decodeData(data);
                setModalOpen(false);
            }} onChange={onChange} />
        </Modal>
    </>;
};

export default RichtextOverview;