import { Dispatch, SetStateAction, useState } from "react";

type TReturnProps = [
  Record<number, Blob>,                                        // fileAsBlobMap
  Dispatch<SetStateAction<Record<number, Blob>>>,              // setFileAsBlobMap
  Dispatch<SetStateAction<Record<number, string | null>>>,     // setCroppedImageMap
  Record<number, string | null>                                // croppedImageMap
];

const useObjectImageUploadLoaders = (): TReturnProps => {
  const [croppedImageMap, setCroppedImageMap] = useState<Record<number, string | null>>({});
  const [fileAsBlobMap, setFileAsBlobMap] = useState<Record<number, Blob>>({});

  return [
    fileAsBlobMap,
    setFileAsBlobMap,
    setCroppedImageMap,
    croppedImageMap,
  ];
};

export default useObjectImageUploadLoaders;
