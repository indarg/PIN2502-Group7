import { Dispatch, useState } from "react";

type TReturnProps = [
    string,(data: string) => void, Dispatch<React.SetStateAction<string>>
]

const useDecodeRichText = (richtextBase64 = ""): TReturnProps => {
    let richtextHtml = atob(richtextBase64);
    const [data, setData] = useState<string>(richtextHtml);


    const decodeData = (data: string) => {
        richtextHtml = atob(data);
        setData(richtextHtml);
    };

    return [data, decodeData, setData]
}

export default useDecodeRichText;